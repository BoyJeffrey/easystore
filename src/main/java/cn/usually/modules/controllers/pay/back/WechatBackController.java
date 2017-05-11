package cn.usually.modules.controllers.pay.back;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.lang.util.NutMap;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.POST;
import org.nutz.mvc.annotation.Param;

import cn.usually.common.constant.ConstantPay;
import cn.usually.common.pay.wechat.RequestHandler;
import cn.usually.common.pay.wechat.XMLUtil;
import cn.usually.common.util.CheckUtil;
import cn.usually.common.util.DateUtil;
import cn.usually.modules.models.app.pay.param.PayParam;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.pay.Pay_order_statistics;
import cn.usually.modules.services.pay.CommonPayService;

/**
 * @desc 微信回调处理
 * @author 
 * @Copyright: (c) 2016年12月6日 上午11:40:45
 * @company: 
 */
@IocBean
@At("/thirdpay/back/wechat")
public class WechatBackController {
	
	private static final Log log = Logs.get();
	
	@Inject
    private CommonPayService commonPayService;
	
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
			PayParam payParam = new PayParam();
			payParam.setOut_trade_no(out_trade_no);
			CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象
			commonPayService.validateIsOrderSuccess(payParam, checkInfo);
			if (checkInfo.getFlag()) {
				log.info("订单号:" + out_trade_no + "已支付");
				return;
			}
			String return_code = resultMap.get("return_code");
			log.info("微信支付回调，相关【商户订单号】：" + out_trade_no);
			// 签名验证
			if (return_code.equals("SUCCESS")) {
				// 整理待修改订单信息
				Pay_order_statistics pay_order_statistics = tidyOrderStatistic(resultMap);
				// 修改订单状态
				CheckUtil.emptyCheckInfo(checkInfo);
				Pay_order_statistics update_order_statistics = commonPayService.updateOrderPaySuccess(pay_order_statistics, checkInfo);
				// 异步通知
				if (checkInfo.getFlag()) {
					commonPayService.notifyCustomMachine(update_order_statistics);
				}
				// 通知微信.异步确认成功.必写.不然会一直通知后台.八次之后就认为交易失败了.
				res.getWriter().write(RequestHandler.setXML("SUCCESS", ""));
			} else
				log.info("微信支付回调结果：订单支付未成功，订单号：" + out_trade_no + ";订单状态:" + return_code);
		} catch (Exception e) {
			e.printStackTrace();
			log.info("微信支付回调异常，订单号：" + out_trade_no);
		}
	}
    	
    public static Map<String, String> getAllRequestParam(final HttpServletRequest req) {
		Map<String, String> res = new HashMap<String, String>();
		Enumeration<?> temp = req.getParameterNames();
		if (null != temp) {
			while (temp.hasMoreElements()) {
				String en = (String) temp.nextElement();
				String value = req.getParameter(en);
				res.put(en, value);
				// 在报文上送时，如果字段的值为空，则不上送<下面的处理为在获取所有参数数据时，判断若值为空，则删除这个字段>
				// System.out.println("ServletUtil类247行  temp数据的键=="+en+"     值==="+value);
				if (null == res.get(en) || "".equals(res.get(en))) {
					res.remove(en);
				}
			}
		}
		return res;
	}

    /**
     * 整理待修改订单信息
     * @param params
     * @return
     */
	private Pay_order_statistics tidyOrderStatistic(Map<String, String> reqParam) {
		Pay_order_statistics pay_order_statistics = new Pay_order_statistics();
		String out_trade_no = reqParam.get("out_trade_no"); // 获取商户订单号
		String transaction_id = reqParam.get("transaction_id"); // 微信支付订单号
		String total_fee = reqParam.get("total_fee"); // 订单总金额:分
		pay_order_statistics.setOut_trade_no(out_trade_no);
		pay_order_statistics.setTrade_no_third(transaction_id);
		pay_order_statistics.setPaytime(DateUtil.getDateTime());
		pay_order_statistics.setOrder_status(ConstantPay.ORDERSTATISTICS_ORDERSTATUS_PAYSUCCESS);
		pay_order_statistics.setPayment(ConstantPay.PAYTYPE_WECHAT);
		log.info("该笔订单信息out_trade_no:" + out_trade_no + ";transaction_id:" + transaction_id + ";total_fee:" + total_fee);
		return pay_order_statistics;
	}

}
