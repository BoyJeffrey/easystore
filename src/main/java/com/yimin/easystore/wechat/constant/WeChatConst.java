package com.yimin.easystore.wechat.constant;

import cn.usually.common.constant.ConstantUrl;
import cn.usually.common.pay.wechat.WechatConfig;

public class WeChatConst {

	public static final	String	WECHAT_APPID     = WechatConfig.APPID;
	public static final String	WECHAT_APPSECRET = WechatConfig.APP_SECRECT;
	public static final String  WECHAT_TOKEN     = "easystorewechat";

	public static final	String	WECHAT_JS_NONCE  = "easystore88888";
	
	public static final String  WECHAT_MERCHATID = "";
	public static final String  WECHAT_JSKEY	 = "";
	public static final String  WECHAT_PAY_URL	 = WechatConfig.UNIFIED_ORDER_URL;

//	public static final String	SERVER_DOMAIN_ROOT	=	"http://47.93.184.3/easystore_wechat";
	public static final String	SERVER_DOMAIN_ROOT	= ConstantUrl.SERVER_DOMAIN_ROOT;
}
