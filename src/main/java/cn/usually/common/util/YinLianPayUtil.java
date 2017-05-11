/**
 * 
 */
package cn.usually.common.util;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;

import cn.usually.common.constant.CommonFinal;
import cn.usually.common.pay.union.demo.DemoBase;
import cn.usually.common.pay.union.sdk.SDKConfig;

/**
 * @Description
 * @author 李畅通
 * @DateTime 2015年11月25日下午2:30:10
 */
public class YinLianPayUtil extends DemoBase {
	Logger logger = Logger.getLogger(YinLianPayUtil.class);

	/**
	 * 判断银联支付状态
	 * 
	 * @author 李畅通
	 * @method queryResult
	 * @return String
	 * @exception (方法有异常的话加)
	 * @DateTime 2015年11月26日下午12:04:25
	 */
	public String queryResult(Map<String, String> resMap) {

		String resultStr = CommonFinal.AGAIN;
		if (resMap != null && resMap.size() > 0) {
			logger.info("===:" + resMap);
			String respCode = resMap.get("respCode") == null ? "" : resMap.get("respCode");
			if (respCode.equals("00")) { // 查询状态 成功
				String origRespCode = resMap.get("origRespCode") == null ? "" : resMap.get("origRespCode");
				if (origRespCode.equals("00")) { // 交易成功
					resultStr = CommonFinal.SUCCESS;
				} else {
					// 查询状态不是交易成功
					resultStr = CommonFinal.FAIL;
				}
			} else if (respCode.equals("34")) {// 取消，查无此交易
				resultStr = CommonFinal.CANCEL;
			} else if (respCode.equals("03") || respCode.equals("04") || respCode.equals("05")) {
				resultStr = CommonFinal.AGAIN;
			} else {
				resultStr = CommonFinal.FAIL;
			}
		} else {
			// 输入为空
			resultStr = CommonFinal.AGAIN;
		}
		logger.info("resultStr = " + resultStr);
		return resultStr;
	}

	/**
	 * 银联回调参数验证
	 * 
	 * @author 李畅通
	 * @method callBackResult
	 * @return String
	 * @exception (方法有异常的话加)
	 * @DateTime 2015年12月3日下午3:07:51
	 */
	public String callBackResult(Map<String, String> resMap) {
		String rv = CommonFinal.EXCEPTION;
		if (resMap != null && resMap.size() > 0) {
			String respCode = resMap.get("respCode") == null ? "" : resMap.get("respCode");
			if ("00".equals(respCode)) {
				rv = CommonFinal.SUCCESS;
			} else if (respCode.equals("03") || respCode.equals("04") || respCode.equals("05")) {
				rv = CommonFinal.EXCEPTION;
			} else if ("01".equals(respCode)) {
				rv = CommonFinal.FAIL;
			} else {
				rv = CommonFinal.EXCEPTION;
			}
		}
		return rv;
	}


	/**
	 * 
	 * @author 李畅通 ##单笔查询请求地址
	 * @method queryPayStutas
	 * @return String
	 * @exception (方法有异常的话加)
	 * @DateTime 2015年11月25日下午5:45:19
	 */
	public Map<String, String> queryPayStutas(String orderID, String orderTxntime) {
		/**
		 * 参数初始化 在java main 方式运行时必须每次都执行加载 如果是在web应用开发里,这个方写在可使用监听的方式写入缓存,无须在这出现
		 */
		SDKConfig.getConfig().loadPropertiesFromSrc();// 从classpath加载acp_sdk.properties文件

		/**
		 * 组装请求报文
		 */
		Map<String, String> data = new HashMap<String, String>();
		// 版本号
		data.put("version", "5.0.0");
		// 字符集编码 默认"UTF-8"
		data.put("encoding", "UTF-8");
		// 签名方法 01 RSA
		data.put("signMethod", "01");
		// 交易类型
		data.put("txnType", "00");
		// 交易子类型
		data.put("txnSubType", "00");
		// 业务类型
		data.put("bizType", "000000");
		// 渠道类型，07-PC，08-手机
		data.put("channelType", "08");
		// 接入类型，商户接入填0 0- 商户 ， 1： 收单， 2：平台商户
		data.put("accessType", "0");
		// 商户号码，请改成自己的商户号
		data.put("merId", SDKConfig.getConfig().getMerId());
		// 商户订单号，请修改被查询的交易的订单号
		data.put("orderId", orderID);
		// data.put("orderId", "20151126161248");

		// 订单发送时间，请修改被查询的交易的订单发送时间
		data.put("txnTime", orderTxntime);

		// data.put("txnTime", "20151126161248");
		data = signData(data);

		// 交易请求url 从配置文件读取
		// acpsdk.singleQueryUrl
		String url = SDKConfig.getConfig().getSingleQueryUrl();

		Map<String, String> resmap = submitUrl(data, url);

		System.out.println("请求报文=[" + data.toString() + "]");
		System.out.println("应答报文=[" + resmap.toString() + "]");
		// 返回应答报文
		return resmap;
	}

	
}
