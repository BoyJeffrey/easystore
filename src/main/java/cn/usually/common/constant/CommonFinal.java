package cn.usually.common.constant;

import java.math.BigDecimal;

public class CommonFinal {

	public static final String RANDOMKEY = "ypt.hyb_encryptSetting_beijing";// 密码加密键

	public static final int SHORTMSG_COUNT = 20;// 当天获取某个类型的短信验证码记录条数

	public static final long TIMEDIFFERENCE = 2;// 短信验证码超时时长（分钟）

	public static final int NORMALSTATUS = 0;// 商家员工用户正常状态

	public static final long PASSWORDUPDATETIME = 5 * 60 * 1000;// 用户密码变更错误时长（时间戳）分钟

	public static final long LOCKTIME = 3 * 60 * 60 * 1000;// 用户密码变更错误锁定时长（时间戳）小时

	public static final int MERUSERSHORTMSGSTUTAS = 5;// 商家推送的短信状态

	public static final int RESULT_CODE_SUCCESS = 0;// 成功

	public static final int RESULT_CODE_FAILURE = -1;// 失败

	public static final int RESULT_CODE_ZERO = 1;// 数据条数为0

	public static final int BARUSER_TYPE_MANAGE = 0;// 用户类型是后台

	public static final int BARUSER_TYPE_CLIENT = 1;// 用户类型是前台

	public static final Integer URLRESOURCE_PLATFORMREC = 9;// 导航资源为平台推荐

	public static final Integer URLRESOURCE_HOTURL = 10;// 导航资源为热门导航

	public static final Integer ARTICLE_STATUS_SHOW = 1;// 文章状态 显示

	public static final Integer ARTICLE_STATUS_AUDIT = 2;// 文章状态 审核

	public static final Integer ARTICLE_STATUS_DELETE = 3;// 文章状态 已删除

	public static final Integer MAX_AD_COUNT = 5;// 每个商家最多广告数量

	/**
	 * 红包/优惠券设置的状态： 可用
	 */
	public static final Integer CASHSET_STATUS_USE = 1;

	/**
	 * 红包/优惠券设置的状态： 不可用
	 */
	public static final Integer CASHSET_STATUS_UNUSE = 2;

	/**
	 * 红包/优惠券设置的状态： 已删除
	 */
	public static final Integer CASHSET_STATUS_DELETED = 3;

	/**
	 * 优惠券过期状态: 未过期
	 */
	public static final Integer EXPIRE_STATUS_UNPAST = 1;

	/**
	 * 优惠券过期状态: 已过期
	 */
	public static final Integer EXPIRE_STATUS_PASTED = 2;

	/**
	 * 充值-定金-消费状态(支付状态):1 已支付
	 */
	public static final Integer AMOUNT_STATUS_PAYED = 1;

	/**
	 * 充值-定金-消费状态(支付状态):2 未支付
	 */
	public static final Integer AMOUNT_STATUS_UNPAY = 2;

	/**
	 * 充值-定金-消费状态(支付状态):3 支付失败
	 */
	public static final Integer AMOUNT_STATUS_PAYFAIL = 3;

	/**
	 * 充值-定金-消费状态(支付状态):4 支付取消
	 */
	public static final Integer AMOUNT_STATUS_PAYCANCEL = 4;

	/**
	 * 充值-定金-消费状态(支付状态):5 支付异常
	 */
	public static final Integer AMOUNT_STATUS_PAYEXCEPTION = 5;
	
	/**
	 * 定金-尾款订单状态:31 支付中
	 */
	public static final int ORDER_STATUS_PAYING = 31;
	
	/**
	 * 预约订单状态:31 定金支付中
	 */
	public static final int ORDER_STATUS_PAYING_PREORDERSUB = 31;
	
	/**
	 * 预约订单状态:32尾款 支付中
	 */
	public static final int ORDER_STATUS_PAYING_PREORDERCON = 32;

	/**
	 * 广告类型：商户广告
	 */
	public static final Integer ADTYPE_MERCHANT = 1;

	/**
	 * 广告类型：系统广告
	 */
	public static final Integer ADTYPE_SYSTEM = 0;

	/**
	 * 支付类型: 1 余额支付
	 */
	public static final Integer AMOUNTTYPE_YUE = 1;

	/**
	 * 支付类型: 0 非余额支付
	 */
	public static final Integer AMOUNTTYPE_OTHER = 0;

	/**
	 * 注册、充值、消费优惠类型： 1 充值返现
	 */
	public static final Integer CASHORPAYTYPE_1 = 1;

	/**
	 * 注册、充值、消费优惠类型： 2 消费返红包
	 */
	public static final Integer CASHORPAYTYPE_2 = 2;

	/**
	 * 注册、充值、消费优惠类型： 3 消费返优惠券
	 */
	public static final Integer CASHORPAYTYPE_3 = 3;

	/**
	 * 注册、充值、消费优惠类型：4 注册返红包
	 */
	public static final Integer CASHORPAYTYPE_4 = 4;

	/**
	 * 注册、充值、消费优惠类型： 5 充值返红包
	 */
	public static final Integer CASHORPAYTYPE_5 = 5;

	/**
	 * 注册、充值、消费优惠类型： 6 充值送优惠券
	 */
	public static final Integer CASHORPAYTYPE_6 = 6;

	/**
	 * 注册、充值、消费优惠类型： 7 单笔红包消费金额设置
	 */
	public static final Integer CASHORPAYTYPE_7 = 7;

	/**
	 * 红包/优惠券状态： 0不可用
	 */
	public static final Integer WEALSTATUS_0 = 0;

	/**
	 * 红包/优惠券状态： 1未消费/红包状态
	 */
	public static final Integer WEALSTATUS_1 = 1;

	/**
	 * 红包/优惠券状态： 2已消费 对优惠券有效
	 */
	public static final Integer WEALSTATUS_2 = 2;

	// 0 未完成 1 已完成 2 充值异常 3 充值失败 4充值取消
	/**
	 * 充值状态 未完成
	 */
	public static final Integer RECHARGETATUS_0 = 0;
	/**
	 * 充值状态 1 已完成
	 */
	public static final Integer RECHARGESTATUS_1 = 1;
	/**
	 * 充值状态 2 充值异常
	 */
	public static final Integer RECHARGESTATUS_2 = 2;
	/**
	 * 充值状态 3 充值失败
	 */
	public static final Integer RECHARGESTATUS_3 = 3;
	/**
	 * 充值状态 4 充值取消
	 */
	public static final Integer RECHARGESTATUS_4 = 4;

	/**
	 * 银联支付状态信息 银联支付状态 success,fail,cancel
	 */
	/**
	 * 成功
	 */
	public static final String SUCCESS = "SUCCESS";
	/**
	 * 失败
	 */
	public static final String FAIL = "FAIL";
	/**
	 * 取消
	 */
	public static final String CANCEL = "CANCEL";
	/**
	 * 图片类型代码（0：环境；1：详细；2：其他。默认：'0'）
	 */
	public static final String TYPECODE = "0";
	/**
	 * 前台充值
	 */
	public static final String YLTYPEPAY = "1";
	/**
	 * 后台充值
	 */
	public static final String YLTYPERECHARGE = "2";
	/**
	 * 前台消费
	 */
	public static final String YLTYPECONSUME = "3";
	/**
	 * 订金预付
	 */
	public static final String YLTYPESUBPN = "4";
	/**
	 * 惠缘包商户充值
	 */
	public static final String HYBSHCZ = "惠缘包商户充值";
	/**
	 * 惠缘包会员消费
	 */
	public static final String HYBHYXF = "惠缘包会员消费";
	/**
	 * 惠缘包会员充值
	 */
	public static final String HYBHYCZ = "惠缘包会员充值";
	/**
	 * 惠缘包预付订金
	 */
	public static final String HYBHYYD = "惠缘包预付订金";
	/**
	 * 是否继续查询
	 */
	public static final String AGAIN="AGAIN";
	/**
	 * 银联异常
	 */
	public static final String EXCEPTION="EXCEPTION";
	
	/**
	 * 商家状态： 已注销
	 */
	public static final Integer MERCHANTSTATUS_2 = 2;
	/**
	 * 商家状态： 可用
	 */
	public static final Integer MERCHANTSTATUS = 1;
	
	/**
	 * 商家状态： 锁定
	 */
	public static final Integer MERCHANTSTATUS_0 = 0;
	
	/**
	 * 支付宝，手机端返回给后台信息
	 */
	/*成功*/
	public final static  String  ALIPAY_SUCCESS = "ALIPAY_SUCCESS";
	/*失败*/
	public final static  String ALIPAY_FAIL = "ALIPAY_FAIL";
	/*待确认*/
	public final static  String ALIPAY_TO_CONFIRMED = "ALIPAY_TO_CONFIRMED";
	/*取消 */
	public final static  String ALIPAY_CANCEL = "ALIPAY_CANCEL";
	/*
	 * 支付异常	 
	 */
	public final static String ALIPAY_TO_EXCEPTION = "ALIPAY_TO_EXCEPTION";
	/**
	 * 付款以后用户退款成功,交易自动关闭
	 */
	public final static String ALIPAY_CLOSED = "ALIPAY_CLOSED";
	
	
	/**
	 * 资金明细表类型 //资金明细类型 
	 *  1 充值 
	 *  2 消费 
	 *  3 提现  
	 *  4 系统给予第一商家分销 
	 *  5 系统给予经销商分销 
	 *  6 系统获取第三方手续费用（第一商家，第N商家手续费，费用体现在费率不同）
	 *  7 系统分红，平台给予系统分红
	 */
	//充值
	public final static  int  FUND_DETAILS_RECHARGE= 1;
	//消费
	public final static  int  FUND_DETAILS_CONSUME= 2;
	//提现
	public final static  int  FUND_DETAILS_WIDTHDRAW= 3;
	//系统给予第一商家分销 
	public final static  int  FUND_DETAILS_SYSTO_FIRST= 4;
	//系统给予经销商分销 
	public final static  int  FUND_DETAILS_SYSTO_DIS= 5;
	//系统获取第三方手续费用（第一商家，第N商家手续费，费用体现在费率不同）
	public final static  int  FUND_DETAILS_SYSGET_POUN= 6;
	//系统获取分红
	public final static  int  FUND_DETAILS_SYSGET_SYSTEM= 7;
	//用户积分消费，系统补助商家金额
	public final static  int  FUND_DETAILS_SYSGET_MERCHANT= 8;
	//订金消费
	public final static  int  FUND_DETAILS_SYSGET_SUBTN= 9;
	/**
	 * 订金充至惠缘包系统
	 */
	public final static  int  FUND_DETAILS_SYSGET_SUBTN_TOSYSTEM= 10;
	/**
	 * 惠缘包系统扣除定金
	 */
	public final static  int  FUND_DETAILS_SYSGET_SUBTN_SYSTEMOUT= 11;
	/**
	 * 用户使用惠缘包系统进行充值
	 */
	public final static  int  FUND_DETAILS_SYSGET_RECHARGE_TOSYSTEM= 12;
	/**
	 * 用户第三方支付订金从惠缘包系统退还给用户
	 */
	public final static  int  FUND_DETAILS_SYSRETURN_SUBTN_TOUSER= 13;
	/**
	 * 消费时，用户使用惠员币时，平台补贴商家
	 */
	public final static  int  FUND_DETAILS_SYSTO_MERCHANT_VIRTUALMONEY= 14;
	/**
	 * 消费时，用户使用平台余额支付，系统补助给商家会员价相对平台价差价金额
	 */
	public final static  int  FUND_DETAILS_SYSTO_MERCHANT_VIPPRICEVSPLAT= 15;
	/**
	 * 快捷支付消费标志
	 */
	public final static  int  FUND_DETAILS_QUICKPAY= 16;
	/**
	 * 订货郞秒杀红包金额消费
	 */
	public final static  int  FUND_DETAILS_ORDERLANG_REDBAO = 17;
	/**
	 * 订货郞秒杀红包金额充至惠缘包系统标志
	 */
	public final static  int  FUND_DETAILS_ORDERLANG_REDBAO_TOSYSTEM = 18;
	/**
	 * 惠缘包系统扣除订货郞秒杀红包金额标志
	 */
	public final static  int  FUND_DETAILS_ORDERLANG_REDBAO_SYSTEMOUT = 19;
	/**
	 * 订货郞供货区特价商品金额消费
	 */
	public final static  int  FUND_DETAILS_ORDERLANG_TJ = 20;
	//
    //推送类型,活动推送
	public final static  int  ACTIVITY_PUSH= 0;
    //推送审核状态，审核通过
	public final static  int  ACTIVITY_AUDIT= 1;
	//无效的等级值
	public final static int INVALID_GRADEVALUE = 0;
	/**
	 * 资金明细类别：系统
	 */
	public static final Integer SYSFUNDDETALISTYPE = 1;
	/**
	 * 资金明细类别：商家
	 */
	public static final Integer MERFUNDDETALISTYPE = 2;
	/**
	 * 资金明细类别：分销商
	 */
	public static final Integer DEALERFUNDDETALISTYPE = 3;
	/**
	 * 资金明细类别：5 订货郞供货商
	 */
	public static final Integer ORDERLANGSUPPORTFUNDDETALISTYPE = 5;
	
	/**
	 * 提现类型:1 商户
	 */
	public static final Integer WITHDRAW_TYPE_MERCHANT = 1;
	
	/**
	 * 提现类型:2 用户
	 */
	public static final Integer WITHDRAW_TYPE_USER = 2;
	
	/**
	 * 提现类型:3 经销商
	 */
	public static final Integer WITHDRAW_TYPE_DEALER = 3;
	
	/**
	 * 虚拟金额类别：注册
	 */
	public static final Integer VIRTUALBALDETAILSREGISTER = 1;
	
	/**
	 * 预约操作：订单审核操作
	 */
	public static final Integer PRODUCT_PREORDER_CHECK = 1;
	
	/**
	 * 参数验证不合法的返参
	 */
	public final static String FAIL_MSG = "参数不合法";
	
	/**
	 *商家分类  0 商家分类，1 地区分类
	 */
	public final static Integer CATEGORY_MERCHANT = 0;
	
	/**
	 *商家分类  0 商家分类，1 地区分类 , 2 第一商家模块
	 */
	public final static Integer CATEGORY_FIRSTMERCHANT = 2;
	
	/**
	 *分类等级1 一级，2 二级
	 */
	public final static Integer CATEGORY_PARENT = 1;
	
	/**
	 *分类等级1 一级，2 二级
	 */
	public final static Integer CATEGORY_SECONDARY = 2;
	
	/**
	 * 系统公告
	 */
	public final static Integer ADTYPE_SYSNOTICE = 3;
	
	public final static String PARAM_SPLIT = ";";
	
	/***
	 * 套餐
	 */
	public final static String PRODUCT_TYPENAME="套餐";
	
	/**
	 * 规格商品
	 */
	public final static Integer PRODUCT_SPEC = 1 ;
	
	/**
	 * 非规格商品
	 */
	public final static Integer PRODUCT_NOTSPEC = 2 ;
	
	/**
	 * 单独商品类详细类别
	 */
	public final static Integer ORDER_SINGLETYPE = 1;
	
	/**
	 * 套餐类商品详细类别
	 */
	public final static Integer ORDER_PACKAGETYPE = 2;
	
	
	/**
	 * 订单待使用
	 */
	public final static Integer ORDER_WAITUSE = 21;
	
	/**
	 * 订单待预约
	 */
	public final static Integer ORDER_WAITRESERVE = 22;
	
	/**
	 * 订单已消费
	 */
	public final static Integer ORDER_CONSUMED = 23;
	
	/**
	 * 订单未付款
	 */
	public final static Integer ORDER_WAITPAY = 2;
	
	/**
	 * 订单已付款
	 */
	public final static Integer ORDER_FINISHPAY = 1;

	/**
	 * 订单默认失效时间(分钟)
	 */
	public final static Integer ORDER_ABATETIME = 15 * 24 * 60;
	
	/**
	 * 检查结果：(N:否)
	 */
	public final static String COMMON_RESULTS_NOT="N"; 
	
	/**
	 * 检查结果：(Y：是)
	 */
	public final static String COMMON_RESULTS_YES="Y"; 
	
	/**
	 * 支付宝支付成功后返回的状态
	 */
	public final static String ALIPAYBACK_SUCCESS = "TRADE_SUCCESS";
	
	/**
	 * 注册验证码
	 */
	public final static int CHECKCODE_REGIST = 1;
	
	/**
	 * 找回密码验证码
	 */
	public final static int CHECKCODE_BACKPASSWORD = 2;
	
	/**
	 * 换绑手机号验证码
	 */
	public final static int CHECKCODE_CHANGEPHONE = 3;
	
	/**
	 * 找回支付密码验证码
	 */
	public final static int CHECKCODE_BACKPAYPASSWORD = 4;
	
	/**
	 * 绑定或更改银行卡
	 */
	public final static int CHECKCODE_BINDCARDNO = 5;
	
	/**
	 * 验证码有效时间（单位:毫秒 5分钟）
	 */
	public final static long CHECKCODE_LIFE = 300000;
	
	/**
	 * 系统配置 键
	 */
	public final static String SYSTEM_INFO = "systemInfo";
	
	/**
	 * 图片地址Url
	 */
	public static final String ImgURL = "http://huiyuanbao.oss-cn-hangzhou.aliyuncs.com/";
	
	/**
	 * 系统默认图片地址Url
	 */
	public static final String LOG_PATH_SYSTEM = "resource/images/default_log.png"; // 系统默认图片
	
	/**
	 * 
	 */
	public final static String LOG_PATH_BANK = "resource/images/bank/default.png"; // 默认银行log存放处
	
	/**
	 * 会员等级名称默认
	 */
	public final static String DEFAULT_GRADECN_NORMAL = "普通会员";
	
	/**
	 * 会员折扣默认值
	 */
	public final static BigDecimal DEFAULT_DISCOUNT_NORMAL = new BigDecimal(1);
	
	/**
	 * 账单详情类型:3非预约支付类型
	 */
	public final static int BILLDETAIL_TYPE_NOPREOREDER = 3;
}
