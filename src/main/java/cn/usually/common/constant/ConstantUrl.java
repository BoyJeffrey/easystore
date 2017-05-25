package cn.usually.common.constant;
/**
 * @desc URL常量
 * @author 
 * @Copyright: (c) 2016年12月8日 上午11:15:50
 * @company: 
 */
public class ConstantUrl {
	
	/**
	 * 微信RedirectUrl
	 */
	public static final String URL_WECHAT_REDIRECT = "http://106.14.133.211/easystore/post/paycenter/redirect_wechat?";

	/**
	 * 微信同步通知前端所跳转的front_url
	 */
	public static final String URL_WECHAT_FRONT = "http://106.14.133.211/easystore/frontweb/qr.html";

	/**
	 * 微信异步所通知的服务器Notify_url
	 */
	public static final String URL_WECHAT_NOTIFY = "http://106.14.133.211/easystore/thirdpay/back/wechat/notify";
	
}
