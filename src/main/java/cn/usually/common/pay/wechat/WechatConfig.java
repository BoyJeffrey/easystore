package cn.usually.common.pay.wechat;

public class WechatConfig {
	/**
	 * 服务号相关信息
	 */
	// 公众号名称
	 public final static String MCH_NAME = "易民新便利";
	 // 微信公众号支付参数
	 public final static String MCH_ID = "";//商户号
	 public final static String APPID = "wx9d2a4d6ba347cb26";//服务号的应用号
	 public final static String APP_SECRECT = "62651b156ea3794019e58c0a70d26cc0";//服务号的应用密码
	 public final static String API_KEY = "";//API密钥
	 public final static String SIGN_TYPE = "MD5";//签名加密方式
//	 public final static String REDIRECT_URI = "http://192.168.1.112/paymanager/post/paycenter/redirect?";

	/**
	 * 微信基础接口地址
	 */
	 public final static String OAUTH2_CODE_URL="https://open.weixin.qq.com/connect/oauth2/authorize?";
	 public final static String OAUTH2_CODE_URL_NEW="https://open.weixin.qq.com/connect/qrconnect?";
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

}
