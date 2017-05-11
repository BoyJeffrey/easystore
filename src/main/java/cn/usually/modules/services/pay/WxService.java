package cn.usually.modules.services.pay;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import cn.usually.common.base.Service;
import cn.usually.common.constant.ConstantUrl;
import cn.usually.common.pay.wechat.ConfigUtil;
import cn.usually.common.pay.wechat.GetWxOrderno;
import cn.usually.common.pay.wechat.RequestHandler;
import cn.usually.common.pay.wechat.Sha1Util;
import cn.usually.common.pay.wechat.TenpayUtil;
import cn.usually.common.pay.wechat.http.HttpConnect;
import cn.usually.common.pay.wechat.http.HttpResponse;
import cn.usually.common.util.Strings;
import cn.usually.modules.models.app.pay.param.PayParam;
import cn.usually.modules.models.app.pay.result.WechatPageInfo;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.pay.Pay_order_statistics;
import cn.usually.modules.models.platform.wx.Wx_config;

/**
 * Created on 2016/12/2.
 */
@SuppressWarnings("rawtypes")
@IocBean(args = {"refer:dao"})
public class WxService extends Service {
	
	private static final Log log = Logs.get();
	
	@Inject
	private CommonPayService commonPayService;
	
	public WxService(Dao dao) {
		super(dao);
	}

	/**
     * 使用微信进行支付
     * @param payParam
	 * @param res 
     * @param res 
     * @param checkInfo 
     */
	@SuppressWarnings("deprecation")
	public void redirectUrlWx(PayParam payParam, HttpServletResponse res, CheckInfo checkInfo) {
		// 查询微信配置信息
		Wx_config wxConfig = dao().fetch(Wx_config.class);
        if(wxConfig != null) {
        	if(Strings.isNullOrEmpty(wxConfig.getAppid()) || Strings.isNullOrEmpty(wxConfig.getAppsecret())
        			|| Strings.isNullOrEmpty(wxConfig.getMch_id()) || Strings.isNullOrEmpty(wxConfig.getApi_key())
        			|| Strings.isNullOrEmpty(wxConfig.getNotify_url())) {
        		checkInfo.setMsg("微信账户配置有误");
        		log.info("【商户号】:" + payParam.getOut_trade_no() + "请求微信服务时,微信账户配置有误!");
        		return;
        	}else {
        		ConfigUtil.setAPI_KEY(wxConfig.getApi_key());
        	}
        }else {
        	checkInfo.setMsg("微信账户配置有误");
        	log.info("【商户号】:" + payParam.getOut_trade_no() + "请求微信服务时,微信账户配置有误!");
        	return;
        }
		// 指定参数
		String redirecturl = ConstantUrl.URL_WECHAT_REDIRECT
				+ "out_trade_no="
				+ payParam.getOut_trade_no()
				+ "&amount="
				+ payParam.getAmount()
				+ "&paytype="
				+ payParam.getPaytype()
				+ "&front_url="
				+ payParam.getFront_url()
				+ "&notify_url="
				+ wxConfig.getNotify_url()
				+ "&source_entrance="
				+ payParam.getSource_entrance();
		redirecturl = URLEncoder.encode(redirecturl);
		String codeurl = ConfigUtil.OAUTH2_CODE_URL
				+ "appid="
				+ wxConfig.getAppid()
				+ "&redirect_uri="
				+ redirecturl
				+ "&response_type=code&scope=snsapi_base#wechat_redirect";
		// 保存该笔订单至数据库
		commonPayService.addPayOrder(payParam, checkInfo);
		try {
			res.sendRedirect(codeurl);
		} catch (IOException e) {
			e.printStackTrace();
			log.info("【商户号】:" + payParam.getOut_trade_no() + "请求微信跳转地址异常!");
		}
	}

	/**
	 * 微信跳转后url处理
	 * @param payParam 
	 * @param req
	 * @param res
	 */
	@SuppressWarnings("static-access")
	public void dealRedirect(PayParam payParam, HttpServletRequest req, HttpServletResponse res, CheckInfo checkInfo) {
		// 查询微信配置信息
		Wx_config wxConfig = dao().fetch(Wx_config.class);
		// 查询订单是否存在,不存在则添加
		Pay_order_statistics db_order_statistics = dao().fetch(Pay_order_statistics.class, Cnd.where("out_trade_no", "=", payParam.getOut_trade_no()).and("source_entrance", "=", payParam.getSource_entrance()));
		if(db_order_statistics != null) {
			String code = req.getParameter("code");
			String openId = "";
			String URL = ConfigUtil.OAUTH2_OPENID_URL + "appid=" + wxConfig.getAppid()
					+ "&secret=" + wxConfig.getAppsecret() + "&code=" + code
					+ "&grant_type=authorization_code";
			System.out.println(URL);
			HttpResponse temp = HttpConnect.getInstance().doGetStr(URL);
			String tempValue = "";
			if (temp == null) {
				checkInfo.setFlag(false);
	    		checkInfo.setMsg("获取微信支付授权失败，请重试");
	    		log.info("【商户号】:" + payParam.getOut_trade_no() + "获取微信支付授权失败，请重试");
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
		    		log.info("【商户号】:" + payParam.getOut_trade_no() + "获取微信支付授权失败，请重试");
		    		return;
				}
				openId = jsonObj.getString("openid");
			}
			// 下单
	        System.out.println(openId);
			// 获取openId后调用统一支付接口https://api.mch.weixin.qq.com/pay/unifiedorder
			String currTime = TenpayUtil.getCurrTime();
			// 8位日期
			String strTime = currTime.substring(8, currTime.length());
			// 四位随机数
			String strRandom = TenpayUtil.buildRandom(4) + "";
			// 10位序列号,可以自行调整。
			String strReq = strTime + strRandom;
			// 商户号
			String mch_id = wxConfig.getMch_id();
			// 子商户号 非必输
			// String sub_mch_id="";
			// 设备号 非必输
//			String device_info = "";
			// 随机数
			String nonce_str = strReq;
			// 商品描述
			// String body = describe;
			// 商品描述根据情况修改
			String body = db_order_statistics.getSubject_name();
			// 附加数据
			String attach = "";
			// 商户订单号
			int intMoney = (int) (payParam.getAmount() * 100);

			// 总金额以分为单位，不带小数点
			int total_fee = intMoney;
			// 订单生成的机器 IP
			String spbill_create_ip = req.getRemoteAddr();
			// 订 单 生 成 时 间 非必输
			// String time_start ="";
			// 订单失效时间 非必输
			// String time_expire = "";
			// 商品标记 非必输
			// String goods_tag = "";
			// 这里notify_url是 支付完成后微信发给该链接信息，可以判断会员是否支付成功，改变订单状态等。
			String notify_url = wxConfig.getNotify_url();
			String trade_type = "JSAPI";
			String openid = openId;
			// 非必输
			// String product_id = "";
			SortedMap<String, String> packageParams = new TreeMap<String, String>();
			packageParams.put("appid", wxConfig.getAppid());
			packageParams.put("mch_id", mch_id);
			packageParams.put("nonce_str", nonce_str);
			packageParams.put("body", body);
			packageParams.put("attach", attach);
			packageParams.put("out_trade_no", payParam.getOut_trade_no());

			// 这里写的金额为1 分到时修改
			packageParams.put("total_fee", String.valueOf(total_fee));
			packageParams.put("spbill_create_ip", spbill_create_ip);
			packageParams.put("notify_url", notify_url);

			packageParams.put("trade_type", trade_type);
			packageParams.put("openid", openid);

			RequestHandler reqHandler = new RequestHandler(req, res);
			reqHandler.init(wxConfig.getAppid(), wxConfig.getAppsecret(),  wxConfig.getApi_key());

			String sign = reqHandler.createSign(packageParams);
			String xml = "<xml>"
							+ "<appid>" + wxConfig.getAppid() + "</appid>"
							+ "<mch_id>" + mch_id + "</mch_id>"
							+ "<nonce_str>" + nonce_str + "</nonce_str>"
							+ "<sign>" + sign + "</sign>"
							+ "<body><![CDATA[" + body + "]]></body>"
							+ "<attach>" + attach + "</attach>"
							+ "<out_trade_no>" + payParam.getOut_trade_no() + "</out_trade_no>"
							+ "<attach>" + attach + "</attach>"
							+ "<total_fee>" + String.valueOf(total_fee) + "</total_fee>"
							+ "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
							+ "<notify_url>" + notify_url + "</notify_url>"
							+ "<trade_type>" + trade_type + "</trade_type>"
							+ "<openid>" + openid + "</openid>"
						+ "</xml>";
			log.info(xml);
			String createOrderURL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
			String prepay_id = "";
			try {
				prepay_id = new GetWxOrderno().getPayNo(createOrderURL, xml);
				if (prepay_id.equals("")) {
					checkInfo.setFlag(false);
		    		checkInfo.setMsg("获取微信支付prepay_id失败");
		    		log.info("【商户号】:" + payParam.getOut_trade_no() + "获取微信支付prepay_id失败，请重试");
		    		return;
				}
			} catch (Exception e1) {
				e1.printStackTrace();
			}
			SortedMap<String, String> finalpackage = new TreeMap<String, String>();
			String appid2 = wxConfig.getAppid();
			String timestamp = Sha1Util.getTimeStamp();
			String nonceStr2 = nonce_str;
			String prepay_id2 = "prepay_id=" + prepay_id;
			String packages = prepay_id2;
			finalpackage.put("appId", appid2);
			finalpackage.put("timeStamp", timestamp);
			finalpackage.put("nonceStr", nonceStr2);
			finalpackage.put("package", packages);
			finalpackage.put("signType", "MD5");
			String finalsign = reqHandler.createSign(finalpackage);

			WechatPageInfo wechatPageInfo = new WechatPageInfo();
			wechatPageInfo.setAppid(appid2);
			wechatPageInfo.setTimeStamp(timestamp);
			wechatPageInfo.setNonceStr(nonceStr2);
			wechatPageInfo.setSign(finalsign);
			wechatPageInfo.setPackageStr(packages);
//			wechatPageInfo.setPrepay_id(prepay_id);
			req.setAttribute("wechatPageInfo", wechatPageInfo);
			req.setAttribute("front_url", payParam.getFront_url());
			// 跳转至微信JS请求页面url时参数
//			Map<String, String> paramMap = tidyWechatPageParamMap(wechatPageInfo);
//			PayManagerClient.getPayManagerClient(res, payParam.getFront_url(), paramMap).redirectByPost();
		}
	}

	/**
	 * 整理微信JS请求微信时参数
	 * @param wechatPageInfo
	 * @return
	 */
	private Map<String, String> tidyWechatPageParamMap(WechatPageInfo wechatPageInfo) {
		Map<String, String> paramMap = new HashMap<String, String>();
		paramMap.put("appid", wechatPageInfo.getAppid());
		paramMap.put("timeStamp", wechatPageInfo.getTimeStamp());
		paramMap.put("nonceStr", wechatPageInfo.getNonceStr());
		paramMap.put("sign", wechatPageInfo.getSign());
		paramMap.put("prepay_id", wechatPageInfo.getPrepay_id());
		return paramMap;
	}
}
