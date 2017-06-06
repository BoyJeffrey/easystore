package com.yimin.easystore.wechat.pojo;


/**
 * 音乐model
 * Created by Administrator on 2014/12/21.
 */

public class WeChatMusicMessage extends WeChatBaseMessage {
    // 音乐
    private WeChatMusic Music;

    public WeChatMusic getMusic() {
        return Music;
    }

    public void setMusic(WeChatMusic music) {
        Music = music;
    }
}
