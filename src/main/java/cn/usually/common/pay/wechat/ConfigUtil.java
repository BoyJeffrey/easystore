package cn.usually.common.pay.wechat;

public class ConfigUtil {
	/**
	 * 服务号相关信息
	 */
	// 微信公众号支付参数
//	public final static String MCH_ID = "1342584701";//商户号
//	 public final static String APPID = "wx84530328d59524b8";//服务号的应用号
//	 public final static String APP_SECRECT = "52be76870090532fa3b52cb7f93caa52";//服务号的应用密码
	 public static String API_KEY;//API密钥
	 public final static String SIGN_TYPE = "MD5";//签名加密方式
	 // 微信app支付参数
	 public final static String MCH_ID_APP = "1361194602";//商户号
	 public final static String APPID_APP = "wx958a56f9cacfa0b4"; // 微信开放平台APPID
	 public final static String APP_SECRECT_APP = "b3aec7d84186ff3bc5a9b3d793ba9ce7"; // 微信开放平台APP密钥
	 public final static String API_KEY_APP = "b3aec7d84186ff3bc5a9b3d793ba9ce7";//API密钥
	 
	//微信支付成功支付后跳转的地址
	 //oauth2授权时回调action
//	 public final static String REDIRECT_URI = "http://hyb.minszx.com/hyb/QuickPay/WeChatPay?";
//	 public final static String REDIRECT_URI = "http://123.57.232.188:8080/paymanager/post/paycenter/redirect?";
	 public final static String REDIRECT_URI = "http://192.168.1.112/paymanager/post/paycenter/redirect?";
	 
	/**
	 * 微信基础接口地址
	 */
	 public final static String OAUTH2_CODE_URL="https://open.weixin.qq.com/connect/oauth2/authorize?";
	 //oauth2授权接口(GET)
	 public final static String OAUTH2_OPENID_URL = "https://api.weixin.qq.com/sns/oauth2/access_token?";
	 //刷新access_token接口（GET）
	/**
	 * 微信支付接口地址
	 */
	//微信支付统一接口(POST)
	public final static String UNIFIED_ORDER_URL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	//微信退款接口(POST)
	public final static String REFUND_URL = "https://api.mch.weixin.qq.com/secapi/pay/refund";
	//订单查询接口(POST)
	public final static String CHECK_ORDER_URL = "https://api.mch.weixin.qq.com/pay/orderquery";
	//关闭订单接口(POST)
	public final static String CLOSE_ORDER_URL = "https://api.mch.weixin.qq.com/pay/closeorder";
	//退款查询接口(POST)
	public final static String CHECK_REFUND_URL = "https://api.mch.weixin.qq.com/pay/refundquery";
	//对账单接口(POST)
	public final static String DOWNLOAD_BILL_URL = "https://api.mch.weixin.qq.com/pay/downloadbill";
	//短链接转换接口(POST)
	public final static String SHORT_URL = "https://api.mch.weixin.qq.com/tools/shorturl";
	//接口调用上报接口(POST)
	public final static String REPORT_URL = "https://api.mch.weixin.qq.com/payitil/report";
	
	public static void setAPI_KEY(String aPI_KEY) {
		API_KEY = aPI_KEY;
	}
}
