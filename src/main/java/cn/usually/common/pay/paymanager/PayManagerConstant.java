package cn.usually.common.pay.paymanager;
/**
 * @desc 支付服务中心 --- 常量设置
 * @author 
 * @Copyright: (c) 2016年12月8日 上午10:20:49
 * @company:  
 */
public class PayManagerConstant {
	
	/**
	 * 来源:临时使用,表示来源系统1、系统2等
	 */
	public static Integer PAYMANAGER_SOURCE_ENTRANCE = 1;
	
	/**
	 * 重定向:支付服务中心URL
	 */
//	public static String URL_REDIRECT_PAYMANAGER = "http://hyb.minszx.com/paymanager/post/paycenter/pay"; // 正式环境
//	public static String PAYMANAGER_URL_REDIRECT = "http://123.57.232.188:8080/paymanager/post/paycenter/pay"; // 测试环境
	public static String PAYMANAGER_URL_REDIRECT = "http://192.168.1.112:7778/paymanager/post/paycenter/pay"; // 测试环境

}
