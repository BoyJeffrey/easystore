package com.yimin.easystore.wechat.pojo;

/**
 * view类型的菜单
 * Created by Administrator on 2014/12/21.
 */
public class WeChatViewButton extends WeChatBaseButton {
    private String type;
    private String url;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}