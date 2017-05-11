package cn.usually.modules.controllers.pay.back;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
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

import cn.usually.common.constant.ConstantAlipay;
import cn.usually.common.constant.ConstantPay;
import cn.usually.common.pay.alipay.util.AlipayNotify;
import cn.usually.common.util.CheckUtil;
import cn.usually.common.util.DateUtil;
import cn.usually.modules.models.app.pay.param.PayParam;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.pay.Pay_order_statistics;
import cn.usually.modules.services.pay.CommonPayService;

/**
 * @desc 支付宝回调处理
 * @author 
 * @Copyright: (c) 2016年12月6日 上午11:40:45
 * @company: 
 */
@IocBean
@At("/thirdpay/back/alipay")
public class AlipayBackController {
	
	private static final Log log = Logs.get();
	
	@Inject
    private CommonPayService commonPayService;
	
	/**
     * 回调
     */
    @SuppressWarnings("rawtypes")
	@At
    @POST
    public void notify(@Param("..") NutMap map, HttpServletRequest req, HttpServletResponse res) {
    	log.info("-------------支付宝回调开始-------------");
    	log.debug("map::" + Json.toJson(map));
    	// 获取支付宝POST过来反馈信息
		Map<String, String> params = new HashMap<String, String>();
		Map reqParams = req.getParameterMap();
		for (Iterator iter = reqParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) reqParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			params.put(name, valueStr);
		}
		String out_trade_no = req.getParameter("out_trade_no"); // 获取订单号
		try {
    		PrintWriter out = res.getWriter();
    		// 本地检查已支付成功则忽略
    		PayParam payParam = new PayParam();
    		payParam.setOut_trade_no(out_trade_no);
    		CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象
    		commonPayService.validateIsOrderSuccess(payParam, checkInfo);
    		if(checkInfo.getFlag()) {
            	log.info("订单号:" + out_trade_no + "已支付");
            	return;
    		}
    		String trade_status = req.getParameter("trade_status"); // 交易状态
    		if (AlipayNotify.verify(params)) { // 验证成功
    			// 请在这里加上商户的业务逻辑程序代码
    			if (ConstantAlipay.TRADE_FINISHED.equals(trade_status) || ConstantAlipay.TRADE_SUCCESS.equals(trade_status)) { // 返回成功代码
    				// 整理待修改订单信息
    				Pay_order_statistics pay_order_statistics = tidyOrderStatistic(req);
    				// 修改订单状态
    				CheckUtil.emptyCheckInfo(checkInfo);
    				Pay_order_statistics update_order_statistics = commonPayService.updateOrderPaySuccess(pay_order_statistics, checkInfo);
    				// 异步通知
    				if(checkInfo.getFlag()) {
    					commonPayService.notifyCustomMachine(update_order_statistics);
    				}
    				out.println("success"); // 请不要修改或删除
    			} else {
    				log.info("支付宝支付回调结果：订单支付未成功，订单号：" + out_trade_no + ";订单状态:" + trade_status);
    				out.println("success"); // 请不要修改或删除
    			}
    		} else { // 验证失败
    			log.info("支付宝支付验证参数失败，订单号：" + out_trade_no + ";订单状态:" + trade_status);
    			out.println("fail");
    		}
    	} catch(Exception e) {
    		e.printStackTrace();
    		log.info("支付宝支付回调异常，订单号：" + out_trade_no);
    	}
    }

    /**
     * 整理待修改订单信息
     * @param params
     * @return
     */
	private Pay_order_statistics tidyOrderStatistic(HttpServletRequest req) {
		Pay_order_statistics pay_order_statistics = new Pay_order_statistics();
		String out_trade_no = req.getParameter("out_trade_no"); // 获取订单号
		String trade_no = req.getParameter("trade_no"); // 支付宝交易号
		String amount = req.getParameter("amount"); // 金额:元
		pay_order_statistics.setOut_trade_no(out_trade_no);
		pay_order_statistics.setTrade_no_third(trade_no);
		pay_order_statistics.setPaytime(DateUtil.getDateTime());
		pay_order_statistics.setOrder_status(ConstantPay.ORDERSTATISTICS_ORDERSTATUS_PAYSUCCESS);
		pay_order_statistics.setPayment(ConstantPay.PAYTYPE_ALIPAY);
		log.info("该笔订单信息out_trade_no:" + out_trade_no + ";trade_no:" + trade_no + ";amount:" + amount);
		return pay_order_statistics;
	}

}
