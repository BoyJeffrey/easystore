package cn.usually.modules.controllers.pay.back;

import cn.usually.common.constant.ConstantEasystoreOrder;
import cn.usually.common.pay.wechat.RequestHandler;
import cn.usually.common.pay.wechat.XMLUtil;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_order;
import cn.usually.modules.services.pay.EasystorePayService;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.lang.util.NutMap;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.POST;
import org.nutz.mvc.annotation.Param;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Map;

/**
 * @desc 微信回调处理
 * @author 
 * @Copyright: (c) 2017/05/23
 * @company: 
 */
@IocBean
@At("/thirdpay/back/wechat")
public class WechatBackController {
	
	private static final Log log = Logs.get();
	
	@Inject
    private EasystorePayService payService;
	
	/**
     * 回调
     */
	@SuppressWarnings("unchecked")
	@At
    @POST
	public void notify(@Param("..") NutMap map, HttpServletRequest req, HttpServletResponse res) {
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
    	
}
