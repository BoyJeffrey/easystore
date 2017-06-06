package com.yimin.easystore.wechat.util;

import java.util.Random;


/**
 * 
 * 生成随机验证码
 * */
public class IdentifyCode {
	
	static Random r = new Random();
    static String ssource = "0123456789";
    static char[] src = ssource.toCharArray();

    /**
     * 产生随机字符串
     * 
     * @param length
     * @return
     */
    public static String getCode(int length)
    {
        char[] buf = new char[length];
        int rnd;
        for (int i = 0; i < length; i++)
        {
            rnd = Math.abs(r.nextInt()) % src.length;

            buf[i] = src[rnd];
        }
        return new String(buf);
    }

}
