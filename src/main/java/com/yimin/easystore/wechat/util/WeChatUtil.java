package com.yimin.easystore.wechat.util;

import com.yimin.easystore.wechat.constant.WeChatConst;
import com.yimin.easystore.wechat.pojo.WeChatAccessToken;
import com.yimin.easystore.wechat.pojo.WeChatMenu;
import com.yimin.easystore.wechat.pojo.WeChatUserInfo;
import com.yimin.easystore.wechat.pojo.WeChatWebAccessToken;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import java.io.*;
import java.net.ConnectException;
import java.net.URL;

/**
 * Created by Administrator on 2014/12/14.
 */
public class WeChatUtil {

    // 获取access_token的接口地址（GET） 限200（次/天）
    public final static String access_token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";

    public final static String userInfo_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";
    
    // 菜单创建（POST） 限100（次/天）
    public final static String menu_create_url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
    public final static String menu_del_url = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=ACCESS_TOKEN";

    public final static String openid_code_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=APPSECRET&code=CODE&grant_type=authorization_code";
    
    //为了取userinfo使用的授权url
    public final static String auth_request_url	=	"https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    //只是为了取openid使用的授权url
    public final static String auth_request_base__url	=	"https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
    
    public final static String get_web_access_token_url	=	"https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=APPSECRET&code=CODE&grant_type=authorization_code";
    public final static String get_user_info_from_web_access	=	"https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID";
    
    public final static String refresh_token_url	=	"https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN"; 
    
    //js ticket
    public final static String js_ticket_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi";
    
    public final static String wechat_pay_url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    
    /**
     * 获取access_token
     *
     * @param appid 凭证
     * @param appsecret 密钥
     * @return
     */
    public static WeChatAccessToken getAccessToken(String appid, String appsecret) {
        WeChatAccessToken accessToken = null;

        String requestUrl = access_token_url.replace("APPID", appid).replace("APPSECRET", appsecret);

        JSONObject jsonObject = httpRequest(requestUrl, "GET", null);
        // 如果请求成功
        if (null != jsonObject) {
            try {
                accessToken = new WeChatAccessToken();
                accessToken.setToken(jsonObject.getString("access_token"));
                accessToken.setExpiresIn(jsonObject.getInt("expires_in"));
            } catch (JSONException e) {
                accessToken = null;
                // 获取token失败
            }
        }
        return accessToken;
    }

    /**
     * 获取用户信息
     *
     * @param access_token 凭证
     * @param openId 用户id
     * @return
     */
    public static WeChatUserInfo getUserInfo(String access_token, String openId) {
        WeChatUserInfo userInfo = null;

        String requestUrl = userInfo_url.replace("ACCESS_TOKEN", access_token).replace("OPENID", openId);
        
        JSONObject jsonObject = httpRequest(requestUrl, "GET", null);
        // 如果请求成功
        if (null != jsonObject) {
            try {
                userInfo = new WeChatUserInfo();
                userInfo.setSubscribe(jsonObject.getInt("subscribe"));
                userInfo.setOpenid(jsonObject.getString("openid"));
                userInfo.setNickname(EmojiFilter.filterEmoji(jsonObject.getString("nickname")));
                userInfo.setSex(jsonObject.getInt("sex"));
                userInfo.setLanguage(jsonObject.getString("language"));
                userInfo.setCity(jsonObject.getString("city"));
                userInfo.setProvince(jsonObject.getString("province"));
                userInfo.setCountry(jsonObject.getString("country"));
                userInfo.setHeadimgurl(jsonObject.getString("headimgurl"));
                userInfo.setSubscribe_time(jsonObject.getLong("subscribe_time"));
                //unionId有问题
                userInfo.setUnionid(jsonObject.getString("openid"));
            } catch (JSONException e) {
                userInfo = null;
                // 获取token失败
            }
        }
        return userInfo;
    }
    /**
     * 根据code获取用户OPENID
     *
     * @param appid
     * @param appsecret
     * @param code 用户code
     * @return
     */
    public static String getUserOpenId(String appid, String appsecret, String code) {
        String requestUrl = openid_code_url.replace("APPID", appid).replace("APPSECRET", appsecret).replace("CODE", code);

        JSONObject jsonObject = httpRequest(requestUrl, "GET", null);
        String openId="";
        // 如果请求成功
        if (null != jsonObject) {
            try {
                openId = jsonObject.getString("openid");
            } catch (JSONException e) {
                // 获取token失败
            }
        }
        return openId;
    }

    /**
     * 创建菜单
     *
     * @param menu 菜单实例
     * @param accessToken 有效的access_token
     * @return 0表示成功，其他值表示失败
     */
    public static JSONObject createMenu(WeChatMenu menu, String accessToken) {
        // 拼装创建菜单的url
        String url = menu_create_url.replace("ACCESS_TOKEN", accessToken);
        // 将菜单对象转换成json字符串
        String jsonMenu = JSONObject.fromObject(menu).toString();
        // 调用接口创建菜单
        JSONObject jsonObject = httpRequest(url, "POST", jsonMenu);
        return jsonObject;
    }
    /**
     * 删除菜单
     *
     * @param accessToken 有效的access_token
     * @return 0表示成功，其他值表示失败
     */
    public static JSONObject deleteMenu(String accessToken) {
        // 拼装创建菜单的url
        String url = menu_del_url.replace("ACCESS_TOKEN", accessToken);
        // 调用接口创建菜单
        JSONObject jsonObject = httpRequest(url, "GET", null);
        return jsonObject;
    }

    /**
     * 获取jsticket
     *
     * @param accessToken 有效的access_token
     * @return 0表示成功，其他值表示失败
     */
    public static String getJsTicket(String accessToken) {
        String result = null;
        String url = js_ticket_url.replace("ACCESS_TOKEN", accessToken);
        JSONObject jsonObject = httpRequest(url, "GET", null);
        // 如果请求成功
        if (null != jsonObject) {
            try {
                result=jsonObject.getString("ticket");
            } catch (JSONException e) {
                // 获取token失败
            }
        }
        return result;
    }

    /**
     * 发起https请求并获取结果
     *
     * @param requestUrl 请求地址
     * @param requestMethod 请求方式（GET、POST）
     * @param outputStr 提交的数据
     * @return JSONObject(通过JSONObject.get(key)的方式获取json对象的属性值)
     */
    public static JSONObject httpRequest(String requestUrl, String requestMethod, String outputStr) {
        JSONObject jsonObject = null;
        StringBuffer buffer = new StringBuffer();
        try {
            // 创建SSLContext对象，并使用我们指定的信任管理器初始化
            TrustManager[] tm = { new MyX509TrustManager() };
            SSLContext sslContext = SSLContext.getInstance("SSL", "SunJSSE");
            sslContext.init(null, tm, new java.security.SecureRandom());
            // 从上述SSLContext对象中得到SSLSocketFactory对象
            SSLSocketFactory ssf = sslContext.getSocketFactory();

            URL url = new URL(requestUrl);
            HttpsURLConnection httpUrlConn = (HttpsURLConnection) url.openConnection();
            httpUrlConn.setSSLSocketFactory(ssf);

            httpUrlConn.setDoOutput(true);
            httpUrlConn.setDoInput(true);
            httpUrlConn.setUseCaches(false);
            // 设置请求方式（GET/POST）
            httpUrlConn.setRequestMethod(requestMethod);

            if ("GET".equalsIgnoreCase(requestMethod))
                httpUrlConn.connect();

            // 当有数据需要提交时
            if (null != outputStr) {
                OutputStream outputStream = httpUrlConn.getOutputStream();
                // 注意编码格式，防止中文乱码
                outputStream.write(outputStr.getBytes("UTF-8"));
                outputStream.close();
            }

            // 将返回的输入流转换成字符串
            InputStream inputStream = httpUrlConn.getInputStream();
            InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "utf-8");
            BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

            String str = null;
            while ((str = bufferedReader.readLine()) != null) {
                buffer.append(str);
            }
            bufferedReader.close();
            inputStreamReader.close();
            // 释放资源
            inputStream.close();
            inputStream = null;
            httpUrlConn.disconnect();
            jsonObject = JSONObject.fromObject(buffer.toString());
        } catch (ConnectException ce) {
        	
        } catch (Exception e) {
        	
        }
        return jsonObject;
    }
    
    public static WeChatWebAccessToken getWebAccessToken(String code) {
		
    	WeChatWebAccessToken	resultAccessToken	=	null;
    	String requestURL	=	get_web_access_token_url.replace("APPID", WeChatConst.WECHAT_APPID).replace("APPSECRET", WeChatConst.WECHAT_APPSECRET).replace("CODE", code);
    	JSONObject	jsonObject	=	httpRequest(requestURL, "GET", null);
    	// 如果请求成功
        if (null != jsonObject) {
            try {	
            	resultAccessToken	=	new	WeChatWebAccessToken();
            	String	tempAccessTokenString	=	(String)(jsonObject.getString("access_token"));
            	int		tempExpireIn			=	(int)(jsonObject.getInt("expires_in"));
            	String	tempRefreshTokenString	=	(String)(jsonObject.getString("refresh_token"));
                String	tempOpenIDString		=	(String)(jsonObject.getString("openid"));
                String	tempScope				=	(String)(jsonObject.getString("scope"));
                resultAccessToken.setAccessToken(tempAccessTokenString);
                resultAccessToken.setExpires_in(tempExpireIn);
                resultAccessToken.setRefreshToken(tempRefreshTokenString);
                resultAccessToken.setOpenid(tempOpenIDString);
                resultAccessToken.setScope(tempScope);
            } catch (JSONException e) {
            	resultAccessToken	=	null;
            }
        }
    	return	resultAccessToken;
	}
    
    public static WeChatUserInfo	getUserInfoFromWeb(String webAccessToken, String openID){

    	WeChatUserInfo resultUserInfo	=	null;    	
    	String requestURL	=	get_user_info_from_web_access.replace("ACCESS_TOKEN", webAccessToken).replace("OPENID", openID); 	
    	JSONObject jsonObject	=	httpRequest(requestURL, "GET", null);
    	if(jsonObject	!=	null){
    		try {
    			resultUserInfo	=	new	WeChatUserInfo();
    			String	tempOpenID		=	(String)(jsonObject.getString("openid"));
            	String	tempNickName	=	(String)(jsonObject.getString("nickname"));
            	int		tempSex			=	(int)(jsonObject.getInt("sex"));
                String	tempLanguage	=	(String)(jsonObject.getString("language"));
                String	tempCity		=	(String)(jsonObject.getString("city"));
                String	tempProvince	=	(String)(jsonObject.getString("province"));
                String	tempCountry		=	(String)(jsonObject.getString("country"));
                String	tempHeadImageURL=	(String)(jsonObject.getString("headimgurl"));
                
                resultUserInfo.setOpenid(tempOpenID);
                resultUserInfo.setNickname(tempNickName);
                resultUserInfo.setSex(tempSex);
                resultUserInfo.setLanguage(tempLanguage);
                resultUserInfo.setCity(tempCity);
                resultUserInfo.setProvince(tempProvince);
                resultUserInfo.setCountry(tempCountry);
                resultUserInfo.setHeadimgurl(tempHeadImageURL);
				
			} catch (JSONException e) {
				
				resultUserInfo	=	null;
			}
    	}
    			
    	return	resultUserInfo;
    }
   
    /**
     * 可以处理中文乱码，
     */
    public static String postXml(String url, String xml) {
        StringBuilder sb = new StringBuilder();
        HttpPost httpPost = new HttpPost(url);
        HttpEntity entity = null;

        httpPost.setHeader(HTTP.CONTENT_TYPE, "application/x-www-form-urlencoded");
        try {

            HttpClient client = new DefaultHttpClient();
            StringEntity payload = new StringEntity(xml, "UTF-8");
            httpPost.setEntity(payload);
            HttpResponse response = client.execute(httpPost);
            entity = response.getEntity();
            String text;
            if (entity != null) {
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(entity.getContent()));
                while ((text = bufferedReader.readLine()) != null) {
                    sb.append(text);
                }

            }
        } catch (Exception e) {
        } finally {
            try {
                EntityUtils.consume(entity);
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
        return sb.toString();
    }
}
