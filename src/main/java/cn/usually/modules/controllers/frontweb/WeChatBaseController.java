package cn.usually.modules.controllers.frontweb;


import com.yimin.easystore.wechat.constant.WeChatConst;
import com.yimin.easystore.wechat.pojo.WeChatAccessToken;
import com.yimin.easystore.wechat.pojo.WeChatJsConfig;
import com.yimin.easystore.wechat.pojo.WeChatUserInfo;
import com.yimin.easystore.wechat.pojo.WeChatWebAccessToken;
import com.yimin.easystore.wechat.util.StringUtil;
import com.yimin.easystore.wechat.util.WeChatSignatureUtil;
import com.yimin.easystore.wechat.util.WeChatUtil;
import org.nutz.ioc.loader.annotation.Inject;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * 基础处理器.
 */
public class WeChatBaseController {
    
	@Inject
//    private MemcachedClient memcachedClient;
	
    private static int 		sessionExpire 		= 60*60;
    
    private static String 	key_access_token 	= "accessToken";
    
    private static String	key_web_access_token= "webaccessToken";
    private static String 	key_web_js_ticket 	= "webjsTicket";
    private static String 	key_web_js_config 	= "webjsConfig";
    
    /*
     * 所有的controller开始请求之前执行这个方法，主要在modelandview中加入这个属性
     */
    @ModelAttribute
	public void init(ModelMap model, HttpServletRequest request) {
		model.put("ctx", request.getContextPath());
	}
    
    /*
     * 从微信服务器获取用户信息
     * 只在关注时使用，避免频繁刷AccessToken
     */
    public WeChatUserInfo getUserInfoFromWeixin(String openid){
    	String	accessToken	= getAccessToken();
    	return	WeChatUtil.getUserInfo(accessToken, openid);
    }
    
    /*
     * 跳转到授权网页
     * 在授权网页中取得code值，以取得个人信息
     * 只在用户入口处使用
     */
    public String	getAuthRequestURL(String rediectURL, String state,boolean isUserInfoAuth) throws Exception{
    	String	newRedirectString	=	WeChatConst.SERVER_DOMAIN_ROOT + rediectURL;
    	newRedirectString   =   java.net.URLEncoder.encode(newRedirectString,   "utf-8");
    	String 	authrequeString = "";
    	if(isUserInfoAuth == true){
    		authrequeString	= WeChatUtil.auth_request_url.replace("APPID", WeChatConst.WECHAT_APPID).replace("REDIRECT_URI", newRedirectString).replace("STATE", state);
    	}else {
    		authrequeString	= WeChatUtil.auth_request_base__url.replace("APPID", WeChatConst.WECHAT_APPID).replace("REDIRECT_URI", newRedirectString).replace("STATE", state);
		}
    	return	"redirect:" + authrequeString;	
    }
    /*
     * 从base网页授权获取用户openID
     */
    public String getOpenIDFromWeixinWeb(HttpServletRequest request){
    	String code = request.getParameter("code");
    	if(code == null){
    		return	null;
    	}
    	WeChatWebAccessToken webAccessToken = WeChatUtil.getWebAccessToken(code);
    	return webAccessToken.getOpenid();
    }
    
    public String getOpenIDFromCode(String code){
    	if(code == null){
    		return	null;
    	}
    	WeChatWebAccessToken webAccessToken = WeChatUtil.getWebAccessToken(code);
    	return webAccessToken.getOpenid();
    }
    /*
     * 从网页授权获取用户信息
     */
    public WeChatUserInfo getUserInfoFromWeixinWeb(HttpServletRequest request){
    	String code = request.getParameter("code");
    	if(code == null){
    		return	null;
    	}
    	WeChatWebAccessToken webAccessToken = WeChatUtil.getWebAccessToken(code);
    	WeChatUserInfo userInfo = WeChatUtil.getUserInfoFromWeb(webAccessToken.getAccessToken(), webAccessToken.getOpenid());
    	return userInfo;
    }
    /**
     * 朋友圈分享相关情报
     * @param --url
     * @return
     */
     public  WeChatJsConfig	getJsConfig(HttpServletRequest request) {
    	 String url = WeChatConst.SERVER_DOMAIN_ROOT      
                 	  + request.getServletPath()
                 	  + "?"
                      + request.getQueryString();
    	 
//	    WeChatJsConfig	tempWXJSConfig = (WeChatJsConfig)memcachedClient.get(key_web_js_config + url);
//	    if(tempWXJSConfig != null){
//	    	return	tempWXJSConfig;
//	    }
	    String	tempJSTicket = getJSTicket();
		 WeChatJsConfig tempWXJSConfig	=	WeChatSignatureUtil.jsSignature(url, tempJSTicket);
//		memcachedClient.set(key_web_js_config + url, sessionExpire, tempWXJSConfig);
		return	tempWXJSConfig;
	}
    
    /**
     * 获得该账号的access_token
     * @param --appid
     * @param --appSecret
     * @return
     */
    protected String getAccessToken() {
//        String token = (String) memcachedClient.get(key_access_token);
//        if(StringUtil.isNotBlank(token)){
//            return token;
//        }
        //获得accessToken，需要存到缓存里，至少512个字符，有效时间两小时
        WeChatAccessToken access_token = WeChatUtil.getAccessToken(WeChatConst.WECHAT_APPID,WeChatConst.WECHAT_APPSECRET);
//        memcachedClient.set(key_access_token, sessionExpire, access_token.getToken());
        return access_token.getToken();
    }
    
    protected WeChatWebAccessToken getWebAccessToken(String code) {
//		WeChatWebAccessToken webToken = (WeChatWebAccessToken)memcachedClient.get(key_web_access_token);
//		if(webToken != null){
//			return webToken;
//		}
		WeChatWebAccessToken webToken = WeChatUtil.getWebAccessToken(code);
//		memcachedClient.set(key_web_access_token, sessionExpire, webToken);
		return webToken;
	}

	protected  String 	getJSTicket() {		
//		String	tempJSTicket = (String)memcachedClient.get(key_web_js_ticket);
//		if (tempJSTicket != null){
//			return	tempJSTicket;
//		}
		String tempAccessToken = getAccessToken();
		String tempJSTicket = WeChatUtil.getJsTicket(tempAccessToken);
//		memcachedClient.set(key_web_js_ticket, sessionExpire, tempJSTicket);
		return	tempJSTicket;
	}
	
	public String getRemoteIP(HttpServletRequest request){
		
		String ip = request.getHeader("x-forwarded-for");  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("Proxy-Client-IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("WL-Proxy-Client-IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("HTTP_CLIENT_IP");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");  
        }  
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
            ip = request.getRemoteAddr();  
        }  
        return ip;
	}
	
    //cookie
	protected void addCookie(HttpServletResponse resp, String name, String value, int maxAge, String domain) {
		Cookie cookie = new Cookie(name, value);
		cookie.setPath("/");
		if (maxAge > 0) {
			cookie.setMaxAge(maxAge);
		}
		if (StringUtil.isNotBlank(domain)) {
			cookie.setDomain(domain);
		}
		resp.addCookie(cookie);
	}

	protected void delCookie(HttpServletResponse resp, String name, String value) {
		Cookie cookie = new Cookie(name, value);
		cookie.setMaxAge(0);
		cookie.setPath("/");
		resp.addCookie(cookie);
	}
	protected Cookie getCookie(HttpServletRequest request, String name) {
		Cookie[] allCookie	=	request.getCookies(); 
		for (int i = 0; i < allCookie.length; i++) {
			if(allCookie[i].equals(name)){
				return	allCookie[i];
			}
		}
		return	null;
	}
}
