package cn.usually.modules.services.pay;

import cn.usually.common.base.Service;
import cn.usually.common.constant.ConstantUrl;
import cn.usually.common.pay.wechat.*;
import cn.usually.common.pay.wechat.http.HttpConnect;
import cn.usually.common.pay.wechat.http.HttpResponse;
import cn.usually.common.util.PayUtil;
import cn.usually.modules.models.app.pay.result.WechatPageInfo;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_order;
import net.sf.json.JSONObject;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.SortedMap;
import java.util.TreeMap;

/**
 * Created on 2017/05/23.
 */
@SuppressWarnings("rawtypes")
@IocBean(args = {"refer:dao"})
public class WxService extends Service {
	
	private static final Log log = Logs.get();
	
//	@Inject
//	private CommonPayService commonPayService;
	
	public WxService(Dao dao) {
		super(dao);
	}

	/**
     * 使用微信进行支付
	 * @param empolyee_order
     * @param res
	 * @param checkInfo
	 */
	@SuppressWarnings("deprecation")
	public void redirectUrlWx(Easy_empolyee_order empolyee_order, HttpServletResponse res, CheckInfo checkInfo) {
		// 指定参数
		String redirecturl = ConstantUrl.URL_WECHAT_REDIRECT
				+ "buy_order_id="
				+ empolyee_order.getBuy_order_id();
		redirecturl = URLEncoder.encode(redirecturl);
		String codeurl = WechatConfig.OAUTH2_CODE_URL
				+ "appid="
				+ WechatConfig.APPID
				+ "&redirect_uri="
				+ redirecturl
				+ "&response_type=code&scope=snsapi_base#wechat_redirect";
		try {
			res.sendRedirect(codeurl);
		} catch (IOException e) {
			e.printStackTrace();
			log.info("【商户订单号】:" + empolyee_order.getBuy_order_id() + "请求微信跳转地址异常!");
		}
	}

	/**
	 * 微信跳转后url处理
	 * @param buy_order_id
	 * @param req
	 * @param res
	 */
	@SuppressWarnings("static-access")
	public void dealRedirect(String buy_order_id, HttpServletRequest req, HttpServletResponse res, CheckInfo checkInfo) {
		// 获取订单信息
		Easy_empolyee_order easy_empolyee_order = dao().fetch(Easy_empolyee_order.class, buy_order_id);
		if(easy_empolyee_order != null) {
			String code = req.getParameter("code");
			String openId = "";
			String URL = WechatConfig.OAUTH2_OPENID_URL + "appid=" + WechatConfig.APPID
					+ "&secret=" + WechatConfig.APP_SECRECT + "&code=" + code
					+ "&grant_type=authorization_code";
			log.info("获取微信openid的url");
			HttpResponse temp = HttpConnect.getInstance().doGetStr(URL);
			String tempValue = "";
			if (temp == null) {
				checkInfo.setFlag(false);
	    		checkInfo.setMsg("获取微信支付授权失败，请重试");
	    		log.info("【商户订单号】:" + buy_order_id + "获取微信支付授权失败，请重试");
	    		return;
			} else {
				try {
					tempValue = temp.getStringResult();
				} catch (Exception e) {
					e.printStackTrace();
				}
				JSONObject jsonObj = JSONObject.fromObject(tempValue);
				log.info("jsonObj:" + jsonObj.toString());
				if (jsonObj.containsKey("errcode")) {
					checkInfo.setFlag(false);
		    		checkInfo.setMsg("获取微信支付授权失败，请重试");
		    		log.info("【商户订单号】:" + buy_order_id + "获取微信支付授权失败，请重试");
		    		return;
				}
				openId = jsonObj.getString("openid");
			}
			// 下单
	        log.info("获取到商户订单号:【" + buy_order_id + "】所对应用户的openid:" + openId);
			String currTime = TenpayUtil.getCurrTime();
			// 8位日期
			String strTime = currTime.substring(8, currTime.length());
			// 四位随机数
			String strRandom = TenpayUtil.buildRandom(4) + "";
			// 10位序列号,可以自行调整。
			String strReq = strTime + strRandom;
			// 商户号
			String mch_id = WechatConfig.MCH_ID;
			// 子商户号 非必输
			// String sub_mch_id="";
			// 设备号 非必输
//			String device_info = "";
			// 随机数
			String nonce_str = strReq;
			// 商品描述
			// String body = describe;
			// 商品描述根据情况修改
			String body = WechatConfig.MCH_NAME;
			// 附加数据
			String attach = "";
			// 总金额以分为单位，不带小数点
			int total_fee = (int) (easy_empolyee_order.getTotal_price() * 100);
			// 订单生成的机器 IP
			String spbill_create_ip = req.getRemoteAddr();
			// 订 单 生 成 时 间 非必输
			// String time_start ="";
			// 订单失效时间 非必输
			// String time_expire = "";
			// 商品标记 非必输
			// String goods_tag = "";
			// 这里notify_url是 支付完成后微信发给该链接信息，可以判断会员是否支付成功，改变订单状态等。
			String notify_url = ConstantUrl.URL_WECHAT_NOTIFY_EMPLOYEE;
			String trade_type = "JSAPI";
			String openid = openId;
			// 非必输
			// String product_id = "";
			SortedMap<String, String> packageParams = new TreeMap<>();
			packageParams.put("appid", WechatConfig.APPID);
			packageParams.put("mch_id", mch_id);
			packageParams.put("nonce_str", nonce_str);
			packageParams.put("body", body);
			packageParams.put("attach", attach);
			packageParams.put("out_trade_no", buy_order_id); //

			// 这里写的金额为1 分到时修改
			packageParams.put("total_fee", String.valueOf(total_fee));
			packageParams.put("spbill_create_ip", spbill_create_ip);
			packageParams.put("notify_url", notify_url);

			packageParams.put("trade_type", trade_type);
			packageParams.put("openid", openid);


			String sign = PayUtil.createSignWx(packageParams);
			String xml = "<xml>"
							+ "<appid>" + WechatConfig.APPID + "</appid>"
							+ "<mch_id>" + mch_id + "</mch_id>"
							+ "<nonce_str>" + nonce_str + "</nonce_str>"
							+ "<sign>" + sign + "</sign>"
							+ "<body><![CDATA[" + body + "]]></body>"
							+ "<attach>" + attach + "</attach>"
							+ "<out_trade_no>" + buy_order_id + "</out_trade_no>"
							+ "<attach>" + attach + "</attach>"
							+ "<total_fee>" + String.valueOf(total_fee) + "</total_fee>"
							+ "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
							+ "<notify_url>" + notify_url + "</notify_url>"
							+ "<trade_type>" + trade_type + "</trade_type>"
							+ "<openid>" + openid + "</openid>"
						+ "</xml>";
			log.info(xml);
			String prepay_id = "";
			prepay_id = new GetWxOrderno().getPayNo(WechatConfig.UNIFIED_ORDER_URL, xml); // 获取微信预支付Id
			if (prepay_id.equals("")) {
				checkInfo.setFlag(false);
				checkInfo.setMsg("获取微信支付prepay_id失败");
				log.info("【商户号】:" + buy_order_id + "获取微信支付prepay_id失败，请重试");
				return;
			}
			SortedMap<String, String> finalpackage = new TreeMap<String, String>();
			String timestamp = Sha1Util.getTimeStamp();
			String packages = "prepay_id=" + prepay_id;
			finalpackage.put("appId", WechatConfig.APPID);
			finalpackage.put("timeStamp", timestamp);
			finalpackage.put("nonceStr", nonce_str);
			finalpackage.put("package", packages);
			finalpackage.put("signType", "MD5");
			String finalsign = PayUtil.createSignWx(finalpackage);

			WechatPageInfo wechatPageInfo = new WechatPageInfo();
			wechatPageInfo.setAppid(WechatConfig.APPID);
			wechatPageInfo.setTimeStamp(timestamp);
			wechatPageInfo.setNonceStr(nonce_str);
			wechatPageInfo.setSign(finalsign);
			wechatPageInfo.setPackageStr(packages);
			wechatPageInfo.setPrepay_id(prepay_id);
			req.setAttribute("wechatPageInfo", wechatPageInfo);
			req.setAttribute("front_url", ConstantUrl.URL_WECHAT_FRONT);
		}
	}

	/**
	 * 获取用户微信支付前JSAPI所需参数
	 * 场景：用户扫码后,前端跳转至微信授权的用户购买产品页面,此逻辑在购买商品时,已经获取到了用户open_id信息
	 *
	 * @param company_id
	 * @param buy_order_id
	 * @param open_id
	 * @param total_price
	 * @param req
	 * @param checkInfo
	 * @param notify_url
	 * @return wechatPageInfo
	 */
	public WechatPageInfo getWechatPageInfoBeforePay(long company_id, String buy_order_id, String open_id, double total_price, HttpServletRequest req, CheckInfo checkInfo, String notify_url) {
		log.info("开始获取微信预支付Id,当前商户订单号:【" + buy_order_id + "】;用户的openid:【" + open_id + "】");
		// 下单
		String currTime = TenpayUtil.getCurrTime();
		// 8位日期
		String strTime = currTime.substring(8, currTime.length());
		// 四位随机数
		String strRandom = TenpayUtil.buildRandom(4) + "";
		// 10位序列号,可以自行调整。
		String strReq = strTime + strRandom;
		// 商户号
		String mch_id = WechatConfig.MCH_ID;
		// 子商户号 非必输
		// String sub_mch_id="";
		// 设备号 非必输
//			String device_info = "";
		// 随机数
		String nonce_str = strReq;
		// 商品描述
		// String body = describe;
		// 商品描述根据情况修改
		String body = WechatConfig.MCH_NAME;
		// 附加数据
		String attach = "";
		// 总金额以分为单位，不带小数点
		int total_fee = (int) (total_price * 100);
		// 订单生成的机器 IP
		String spbill_create_ip = req.getRemoteAddr();
		// 订 单 生 成 时 间 非必输
		// String time_start ="";
		// 订单失效时间 非必输
		// String time_expire = "";
		// 商品标记 非必输
		// String goods_tag = "";
		// 这里notify_url是 支付完成后微信发给该链接信息，可以判断会员是否支付成功，改变订单状态等。
//		String notify_url = ConstantUrl.URL_WECHAT_NOTIFY_EMPLOYEE;
		String trade_type = "JSAPI";
		String openid = open_id;
		// 非必输
		// String product_id = "";
		SortedMap<String, String> packageParams = new TreeMap<>();
		packageParams.put("appid", WechatConfig.APPID);
		packageParams.put("mch_id", mch_id);
		packageParams.put("nonce_str", nonce_str);
		packageParams.put("body", body);
		packageParams.put("attach", attach);
		packageParams.put("out_trade_no", buy_order_id); //

		// 这里写的金额为1 分到时修改
		packageParams.put("total_fee", String.valueOf(total_fee));
		packageParams.put("spbill_create_ip", spbill_create_ip);
		packageParams.put("notify_url", notify_url);

		packageParams.put("trade_type", trade_type);
		packageParams.put("openid", openid);


		String sign = PayUtil.createSignWx(packageParams);
		String xml = "<xml>"
				+ "<appid>" + WechatConfig.APPID + "</appid>"
				+ "<mch_id>" + mch_id + "</mch_id>"
				+ "<nonce_str>" + nonce_str + "</nonce_str>"
				+ "<sign>" + sign + "</sign>"
				+ "<body><![CDATA[" + body + "]]></body>"
				+ "<attach>" + attach + "</attach>"
				+ "<out_trade_no>" + buy_order_id + "</out_trade_no>"
				+ "<attach>" + attach + "</attach>"
				+ "<total_fee>" + String.valueOf(total_fee) + "</total_fee>"
				+ "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
				+ "<notify_url>" + notify_url + "</notify_url>"
				+ "<trade_type>" + trade_type + "</trade_type>"
				+ "<openid>" + openid + "</openid>"
				+ "</xml>";
		log.info(xml);
		String prepay_id = "";
		prepay_id = new GetWxOrderno().getPayNo(WechatConfig.UNIFIED_ORDER_URL, xml);
		if (prepay_id.equals("")) {
			checkInfo.setMsg("获取微信支付prepay_id失败");
			log.info("【商户号】:" + buy_order_id + "获取微信支付prepay_id失败，请重试");
			return null;
		}
		SortedMap<String, String> finalpackage = new TreeMap<String, String>();
		String timestamp = Sha1Util.getTimeStamp();
		String packages = "prepay_id=" + prepay_id;
		finalpackage.put("appId", WechatConfig.APPID);
		finalpackage.put("timeStamp", timestamp);
		finalpackage.put("nonceStr", nonce_str);
		finalpackage.put("package", packages);
		finalpackage.put("signType", "MD5");
		String finalsign = PayUtil.createSignWx(finalpackage);

		// 整理参数
		WechatPageInfo wechatPageInfo = new WechatPageInfo();
		wechatPageInfo.setAppid(WechatConfig.APPID);
		wechatPageInfo.setTimeStamp(timestamp);
		wechatPageInfo.setNonceStr(nonce_str);
		wechatPageInfo.setSign(finalsign);
		wechatPageInfo.setPackageStr(packages);
		wechatPageInfo.setPrepay_id(prepay_id);
		wechatPageInfo.setFront_url(ConstantUrl.URL_WECHAT_FRONT + "?company_id=" + company_id);
		// 参数准备成功
		checkInfo.setFlag(true);
		return wechatPageInfo;
	}

	/**
	 * 整理微信JS请求微信时参数
	 * @param wechatPageInfo
	 * @return
	 */
//	private Map<String, String> tidyWechatPageParamMap(WechatPageInfo wechatPageInfo) {
//		Map<String, String> paramMap = new HashMap<String, String>();
//		paramMap.put("appid", wechatPageInfo.getAppid());
//		paramMap.put("timeStamp", wechatPageInfo.getTimeStamp());
//		paramMap.put("nonceStr", wechatPageInfo.getNonceStr());
//		paramMap.put("sign", wechatPageInfo.getSign());
//		paramMap.put("prepay_id", wechatPageInfo.getPrepay_id());
//		return paramMap;
//	}
}
