package cn.usually.common.constant;
/**
 * @desc URL常量
 * @author 
 * @Copyright: (c) 2016年12月8日 上午11:15:50
 * @company: 
 */
public class ConstantUrl {

	/**
	 * 工程主地址
	 */
	public static final String	SERVER_DOMAIN_ROOT	=	"http://www.newworklife.cn//easystore";
	
	/**
	 * 微信RedirectUrl
	 */
	public static final String URL_WECHAT_REDIRECT = "http://www.newworklife.cn/easystore/post/paycenter/redirect_wechat?";

	/**
	 * 微信同步通知前端所跳转的front_url:用户购买产品
	 */
	public static final String URL_WECHAT_FRONT = "http://www.newworklife.cn/easystore/frontweb/qr.html";

	/**
	 * 微信异步所通知的服务器Notify_url:用户购买产品
	 */
	public static final String URL_WECHAT_NOTIFY_EMPLOYEE = "http://www.newworklife.cn/easystore/frontweb/employee/report_buy_result";
	
}
