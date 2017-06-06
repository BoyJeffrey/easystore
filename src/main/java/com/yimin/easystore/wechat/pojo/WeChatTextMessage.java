package com.yimin.easystore.wechat.pojo;

/**
 * 消息文字
 * @author MichaelZhou.
 */
public class WeChatTextMessage extends WeChatBaseMessage{
    // 回复的消息内容
    private String Content;

    public String getContent() {
        return Content;
    }

    public void setContent(String content) {
        Content = content;
    }
}
