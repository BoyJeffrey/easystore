package com.yimin.easystore.wechat.pojo;

import java.io.Serializable;

public class WeChatJsConfig implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -1448894829713529162L;
	
	public String url;
    public String jsapi_ticket;
    public String nonceStr;
    public String timestamp;
    public String signature;
    
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getJsapi_ticket() {
		return jsapi_ticket;
	}
	public void setJsapi_ticket(String jsapi_ticket) {
		this.jsapi_ticket = jsapi_ticket;
	}
	public String getNonceStr() {
		return nonceStr;
	}
	public void setNonceStr(String nonceStr) {
		this.nonceStr = nonceStr;
	}
	public String getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}
	public String getSignature() {
		return signature;
	}
	public void setSignature(String signature) {
		this.signature = signature;
	}
	
	@Override
    public String toString() {
        return "WwChatJsConfig{" +
                "url='" + url + '\'' +
                ", jsapi_ticket='" + jsapi_ticket + '\'' +
                ", nonceStr='" + nonceStr + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", signature='" + signature + '\'' +
                '}';
    }
}
