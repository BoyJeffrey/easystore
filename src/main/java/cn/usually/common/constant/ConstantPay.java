package cn.usually.common.constant;
/**
 * @desc 支付常量
 * @author 
 * @Copyright: (c) 2016年12月2日 下午4:21:16
 * @company: 
 */
public class ConstantPay {
	
	/**
	 * 支付类型:1 支付宝
	 */
	public static final int PAYTYPE_ALIPAY = 1;
	
	/**
	 * 支付类型:2 微信
	 */
	public static final int PAYTYPE_WECHAT = 2;
	
	/**
	 * 支付类型:3 银联
	 */
	public static final int PAYTYPE_UNION = 3;
	
	/**
	 * 订单状态:1 未支付
	 */
	public static final Integer ORDERSTATISTICS_ORDERSTATUS_UNPAY = 1;
	/**
	 * 订单状态:2 处理中
	 */
	public static final Integer ORDERSTATISTICS_ORDERSTATUS_PAYING = 2;
	/**
	 * 订单状态:3 支付成功
	 */
	public static final Integer ORDERSTATISTICS_ORDERSTATUS_PAYSUCCESS = 3;
	/**
	 * 订单状态:4 支付失败
	 */
	public static final Integer ORDERSTATISTICS_ORDERSTATUS_PAYFAIL = 4;
	/**
	 * 订单状态:5 已取消
	 */
	public static final Integer ORDERSTATISTICS_ORDERSTATUS_PAYCANCEL = 5;
	/**
	 * 订单状态:6 退款中
	 */
	public static final Integer ORDERSTATISTICS_ORDERSTATUS_REFUNDING = 6;
	/**
	 * 订单状态:7 已退款
	 */
	public static final Integer ORDERSTATISTICS_ORDERSTATUS_PAYREFUNDED = 7;
	
	/**
	 * 本地支付状态代码:成功 PAYSUCCESS
	 */
	public static final String PAY_SUCCESS = "PAYSUCCESS";
	
	/**
	 * 本地支付状态代码:失败 PAYFAIL
	 */
	public static final String PAY_FAIL = "PAYFAIL";
	
	/**
	 * 本地支付状态代码:支付中 PAYING
	 */
	public static final String PAY_ING = "PAYING";
	
	/**
	 * 客户端返回成功接收异步通知信息
	 */
	public static final String CUSTOMBACK_SUCCESSINFO = "SUCCESS";
	
	/**
	 * 客户端返回成功接收异步通知标识
	 */
	public static final Integer ORDERSTATISTICS_FLAGBACKSUCCESS = 1;
	
	/**
	 * 默认每次异步通知客户端订单数:50
	 */
	public static final Integer NOTIFYORDER_EVERYNUM = 50;
	
}
