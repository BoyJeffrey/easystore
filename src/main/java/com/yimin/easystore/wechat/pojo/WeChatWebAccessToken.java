package com.yimin.easystore.wechat.pojo;

import java.io.Serializable;

public class WeChatWebAccessToken implements Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 6039478430823094033L;
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	private	String	accessToken;
	private int		expires_in;
	private String	refreshToken;
	private String	openid;
	private String	scope;
	
	public String getAccessToken() {
		return accessToken;
	}
	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}
	
	public int getExpires_in() {
		return expires_in;
	}
	public void setExpires_in(int expires_in) {
		this.expires_in = expires_in;
	}
	
	public String getRefreshToken() {
		return refreshToken;
	}
	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}
	
	public String getOpenid() {
		return openid;
	}
	public void setOpenid(String openid) {
		this.openid = openid;
	}
	
	public String getScope() {
		return scope;
	}
	public void setScope(String scope) {
		this.scope = scope;
	}
}
