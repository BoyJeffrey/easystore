package cn.usually.modules.controllers.frontweb;

import cn.usually.common.base.Result;
import cn.usually.common.constant.ConstantEasystoreOrder;
import cn.usually.common.constant.ConstantUrl;
import cn.usually.common.pay.wechat.RequestHandler;
import cn.usually.common.pay.wechat.WechatConfig;
import cn.usually.common.pay.wechat.XMLUtil;
import cn.usually.common.util.CheckUtil;
import cn.usually.modules.models.app.pay.result.WechatPageInfo;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.frontapi.param.FrontApiParam;
import cn.usually.modules.models.frontapi.result.CompanyProducts;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_order;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_orderdetail;
import cn.usually.modules.services.frontweb.FrontUserService;
import cn.usually.modules.services.pay.EasystorePayService;
import cn.usually.modules.services.pay.WxService;
import com.yimin.easystore.wechat.util.StringUtil;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.lang.util.NutMap;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.JsonAdaptor;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * 便利店前端请求
 */
@IocBean
@At("/frontweb/employee")
public class EmployeeController extends WeChatBaseController {

	private static final Log log = Logs.get();

	@Inject
	private FrontUserService frontUserService;
	@Inject
	private WxService wxService;
	@Inject
	private EasystorePayService payService;

	/**
	 * 没有公司ID,进入引导货柜扫码页面
	 */
	@At("/scan_guide")
	@Ok("beetl:/frontweb/wechat/employee/scan_guide.html")
	public void scanQRGuide(){

	}

	/**
	 * 用户扫描公司货架二维码后跳转至相应未授权页面
	 * @param param
	 * @param req
	 */
	@At("/company_shop_from_scan")
	@Ok("beetl:/frontweb/wechat/employee/company_shop_1.html")
	public void scanQR_1(@Param("..") FrontApiParam param, HttpServletRequest req){
		req.setAttribute("app_id", WechatConfig.APPID);
		req.setAttribute("company_id", param.getCompany_id());
	}

	/**
	 * 微信授权回调处理后，跳转至用户购买产品页面
	 * @param  param
	 * @param  req
	 * @return
	 */
	@At("/company_shop_from_scan_2")
	@Ok("beetl:/frontweb/wechat/employee/employee_buy_index.html")
	public void	scanQR(@Param("..") FrontApiParam param, HttpServletRequest req){

		log.debug("param::" + param);
		String code 		= (String)(req.getParameter("code"));
		String openID 		= getOpenIDFromCode(code);
		log.debug("company_id:" + param.getCompany_id() + ";code::" + code + ";openID:" + openID);
		// 校验参数
		CheckInfo checkInfo = frontUserService.checkShowProductsParam(param);
		if(! checkInfo.getFlag() || StringUtil.isBlank(openID)) {
			req.setAttribute("title", "");
			req.setAttribute("checkInfo", checkInfo);
			req.setAttribute("company_id", -1);
			req.setAttribute("open_id", "");
			return;
		}
		// 校验通过,则获取该公司货架上商品信息
		CompanyProducts companyProducts = frontUserService.getCompanyProductsInfo(param.getCompany_id());
		req.setAttribute("checkInfo", checkInfo);
		req.setAttribute("title", companyProducts.getTitle());
		req.setAttribute("company_id", param.getCompany_id());
		req.setAttribute("open_id", openID);
		req.setAttribute("categoryList", companyProducts.getCategoryList());
	}

	/**
	 * ajax请求---员工购买产品:根据公司ID,员工openid,商品信息进行购买
	 */
	@At
	@Ok("json")
	@AdaptBy(type = JsonAdaptor.class)
	public Object buy(@Param("company_id") long company_id, @Param("open_id") String open_id, @Param("total_price") double total_price, @Param("orderitem_datas") String orderitem_datas, HttpServletRequest req) {
		log.debug("用户下单前,订单校验:company_id:" + company_id + ";open_id:" + open_id + ";total_price:" + total_price + ";orderitem_datas:" + orderitem_datas);
		List<Easy_empolyee_orderdetail> orderdetailList = Json.fromJsonAsList(Easy_empolyee_orderdetail.class, orderitem_datas);
		CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象初始化
		String buy_order_id = frontUserService.dealEmployeeBeforePay(company_id, total_price, orderdetailList, checkInfo);
		if(checkInfo.getFlag()) { // 获取页面JSAPI所需参数
			CheckUtil.emptyCheckInfo(checkInfo);
			WechatPageInfo wechatPageInfo = wxService.getWechatPageInfoBeforePay(buy_order_id, open_id, total_price, req, checkInfo, ConstantUrl.URL_WECHAT_NOTIFY_EMPLOYEE);
			if(checkInfo.getFlag())
				return Result.success("ok", wechatPageInfo);
		}
		return Result.error(checkInfo.getMsg());
	}

	/**
	 * 微信异步通知结果:用户购买产品后
	 * @param req
	 * @param res
	 * @return
	 */
	@At("report_buy_result")
	@POST
	public void reportBuyResult(@Param("..") NutMap map, HttpServletRequest req, HttpServletResponse res){
		log.debug("map::" + Json.toJson(map));
		log.info("-------------微信回调开始-------------");
		String out_trade_no = "";
		String openid = ""; // 用户openid
		String transaction_id = ""; // 微信支付订单号
		String pay_time = ""; // 支付完成时间
		try {
			InputStream inStream = req.getInputStream();
			ByteArrayOutputStream outSteam = new ByteArrayOutputStream();
			byte[] buffer = new byte[1024];
			int len = 0;
			while ((len = inStream.read(buffer)) != -1) {
				outSteam.write(buffer, 0, len);
			}
			outSteam.close();
			inStream.close();
			String resultStr = new String(outSteam.toByteArray(), "utf-8");
			Map<String, String> resultMap = XMLUtil.doXMLParse(resultStr);
			out_trade_no = resultMap.get("out_trade_no");
			// 本地检查已支付成功则忽略
			Easy_empolyee_order empolyee_order = payService.dao().fetch(Easy_empolyee_order.class, out_trade_no);
			if(empolyee_order == null) {
				log.info("订单号:" + out_trade_no + "未找到");
				return;
			}
			if(ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_PAYSUCCESS == empolyee_order.getPay_status()) {
				log.info("订单号:" + out_trade_no + "已支付");
				return;
			}
			String return_code = resultMap.get("return_code");
			log.info("微信支付回调，相关【商户订单号】：" + out_trade_no);
			// 签名验证
			if (return_code.equals("SUCCESS")) {
				// 修改订单状态
				openid = resultMap.get("openid");
				transaction_id = resultMap.get("transaction_id");
				pay_time = resultMap.get("pay_time");
				payService.updateEmlpoyeeOrderSuccess(out_trade_no, openid, transaction_id, pay_time);
				// 通知微信.异步确认成功.必写.不然会一直通知后台.八次之后就认为交易失败了.
				res.getWriter().write(RequestHandler.setXML("SUCCESS", ""));
			} else
				log.info("微信支付回调结果：订单支付未成功，订单号：" + out_trade_no + ";订单状态:" + return_code);
		} catch (Exception e) {
			e.printStackTrace();
			log.info("微信支付回调异常，订单号：" + out_trade_no);
		}
	}

	/**
	 * 用户扫描公司货架二维码后获取商品信息
	 * @param --param
	 * @return
	 */
    /*@At
    @Ok("json")
    public Object showProducts(@Param("..") FrontApiParam param) {
        try {
            log.debug("param::" + param);
            // 校验参数
            CheckInfo checkInfo = frontUserService.checkShowProductsParam(param);
            if(! checkInfo.getFlag())
                return Result.error(checkInfo.getMsg());
            // 校验通过,则获取该公司货架上商品信息
            CompanyProducts companyProducts = frontUserService.getCompanyProductsInfo(param.getCompany_id());
            return Result.success("ok",companyProducts);
        } catch (Exception e) {
            return Result.error("fail");
        }
    }*/

	/**
	 * 用户扫描公司货架二维码后跳转至相应页面
	 * @param param
	 * @param  req
	 * @return
	 */
	/*@At
	@Ok("beetl:/frontweb/user/employee_buy_index.html")
	public void showProducts(@Param("..") FrontApiParam param, HttpServletRequest req) {
		log.debug("param::" + param);
		// 校验参数
		CheckInfo checkInfo = frontUserService.checkShowProductsParam(param);
		if(! checkInfo.getFlag()) {
			req.setAttribute("title", "");
			req.setAttribute("checkInfo", checkInfo);
			req.setAttribute("company_id", -1);
			return;
		}
		// 校验通过,则获取该公司货架上商品信息
		CompanyProducts companyProducts = frontUserService.getCompanyProductsInfo(param.getCompany_id());
		req.setAttribute("checkInfo", checkInfo);
		req.setAttribute("title", companyProducts.getTitle());
		req.setAttribute("company_id", param.getCompany_id());
		req.setAttribute("categoryList", companyProducts.getCategoryList());
	}*/

	/**
	 * 校验用户支付前参数,校验通过则返回该笔订单在本系统中商户订单号
	 * @param company_id
	 * @param total_price
	 * @param orderitem_datas
	 */
	/*@At
	@Ok("json")
	@AdaptBy(type = JsonAdaptor.class)
	public Object checkBeforePay(@Param("company_id") long company_id, @Param("total_price") double total_price, @Param("orderitem_datas") String orderitem_datas) {
		log.debug("用户下单前,订单校验:company_id:" + company_id + ";total_price:" + total_price + ";orderitem_datas:" + orderitem_datas);
		List<Easy_empolyee_orderdetail> orderdetailList = Json.fromJsonAsList(Easy_empolyee_orderdetail.class, orderitem_datas);
		CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象初始化
		String buy_order_id = frontUserService.dealEmployeeBeforePay(company_id, total_price, orderdetailList, checkInfo);
		if(checkInfo.getFlag())
			return Result.success("success", buy_order_id);
		else
			return Result.error(checkInfo.getMsg());
	}*/
}
