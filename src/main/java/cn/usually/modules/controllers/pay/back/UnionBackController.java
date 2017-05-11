package cn.usually.modules.controllers.pay.back;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

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

import cn.usually.common.constant.CommonFinal;
import cn.usually.common.constant.ConstantPay;
import cn.usually.common.pay.union.sdknew.LogUtil;
import cn.usually.common.pay.union.sdknew.SDKConfig;
import cn.usually.common.pay.union.sdknew.SDKConstants;
import cn.usually.common.util.CheckUtil;
import cn.usually.common.util.DateUtil;
import cn.usually.common.util.YinLianPayUtil;
import cn.usually.modules.models.app.pay.param.PayParam;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.pay.Pay_order_statistics;
import cn.usually.modules.services.pay.CommonPayService;

/**
 * @desc 银联回调处理
 * @author 
 * @Copyright: (c) 2016年12月6日 上午11:40:45
 * @company: 
 */
@IocBean
@At("/thirdpay/back/union")
public class UnionBackController {
	
	private static final Log log = Logs.get();
	
	@Inject
    private CommonPayService commonPayService;
	
	/**
     * 回调
     */
	@At
    @POST
    public void notify(@Param("..") NutMap map, HttpServletRequest req, HttpServletResponse res) {
    	log.info("-------------银联回调开始-------------");
    	log.debug("map::" + Json.toJson(map));
    	String out_trade_no = "";
    	try {
    		req.setCharacterEncoding("ISO-8859-1");
    		SDKConfig.getConfig().loadPropertiesFromSrc();
    		String encoding = req.getParameter(SDKConstants.param_encoding);
    		// 获取请求参数中所有的信息
    		Map<String, String> reqParam = getAllRequestParam(req);
    		// 打印请求报文
    		LogUtil.printRequestLog(reqParam);
    		Map<String, String> valideData = null;
    		if (null != reqParam && !reqParam.isEmpty()) {
    			Iterator<Entry<String, String>> it = reqParam.entrySet().iterator();
    			valideData = new HashMap<String, String>(reqParam.size());
    			while (it.hasNext()) {
    				Entry<String, String> e = it.next();
    				String key = (String) e.getKey();
    				String value = (String) e.getValue();
    				value = new String(value.getBytes("ISO-8859-1"), encoding);
    				valideData.put(key, value);
    			}
    		}
    		out_trade_no = valideData.get("orderId");
    		// 本地检查已支付成功则忽略
    		PayParam payParam = new PayParam();
    		payParam.setOut_trade_no(out_trade_no);
    		CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象
    		commonPayService.validateIsOrderSuccess(payParam, checkInfo);
    		if(checkInfo.getFlag()) {
            	log.info("订单号:" + out_trade_no + "已支付");
            	return;
    		}
    		YinLianPayUtil yinlian = new YinLianPayUtil();
    		String return_result = yinlian.callBackResult(reqParam);
    		if(CommonFinal.SUCCESS.equals(return_result)) { // 回调成功
    			// 整理待修改订单信息
				Pay_order_statistics pay_order_statistics = tidyOrderStatistic(reqParam);
				// 修改订单状态
				CheckUtil.emptyCheckInfo(checkInfo);
				Pay_order_statistics update_order_statistics = commonPayService.updateOrderPaySuccess(pay_order_statistics, checkInfo);
				// 异步通知
				if(checkInfo.getFlag()) {
					commonPayService.notifyCustomMachine(update_order_statistics);
				} else {
					log.info("银联支付回调结果：订单支付未成功，订单号：" + out_trade_no + ";订单状态:" + return_result);
				}
    		}
    	} catch(Exception e) {
    		e.printStackTrace();
    		log.info("银联支付回调异常，订单号：" + out_trade_no);
    	}
    }
    
    public static Map<String, String> getAllRequestParam(final HttpServletRequest request) {
		Map<String, String> res = new HashMap<String, String>();
		Enumeration<?> temp = request.getParameterNames();
		if (null != temp) {
			while (temp.hasMoreElements()) {
				String en = (String) temp.nextElement();
				String value = request.getParameter(en);
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
		String orderId = reqParam.get("orderId"); // 获取订单号
		String queryId = reqParam.get("queryId"); // 订单号
		String txnAmt = reqParam.get("txnAmt"); // 金额:分
		pay_order_statistics.setOut_trade_no(orderId);
		pay_order_statistics.setTrade_no_third(queryId);
		pay_order_statistics.setPaytime(DateUtil.getDateTime());
		pay_order_statistics.setOrder_status(ConstantPay.ORDERSTATISTICS_ORDERSTATUS_PAYSUCCESS);
		pay_order_statistics.setPayment(ConstantPay.PAYTYPE_UNION);
		log.info("该笔订单信息orderId:" + orderId + ";queryId:" + queryId + ";txnAmt:" + txnAmt);
		return pay_order_statistics;
	}

}
