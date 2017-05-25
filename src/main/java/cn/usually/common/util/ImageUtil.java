package cn.usually.common.util;

import cn.usually.common.base.Globals;

/**
 * Image工具类
 * Created by Administrator on 2017/5/12 0012.
 */
public class ImageUtil {

    public static String getDefaultProductImageUrl() {
        return "/" + Globals.AppShrotName + Globals.AppUploadPath + Globals.UploadProductImagePath + "/default.jpg";
    }
}
