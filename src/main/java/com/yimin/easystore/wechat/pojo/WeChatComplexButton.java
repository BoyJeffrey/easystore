package com.yimin.easystore.wechat.pojo;

/**
 * 复杂按钮（父按钮）
 *
 */
public class WeChatComplexButton extends WeChatBaseButton {
    private WeChatBaseButton[] sub_button;

    public WeChatBaseButton[] getSub_button() {
        return sub_button;
    }

    public void setSub_button(WeChatBaseButton[] sub_button) {
        this.sub_button = sub_button;
    }
}
