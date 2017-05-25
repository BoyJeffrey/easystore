package cn.usually.common.base;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;

import cn.usually.modules.models.platform.sys.Sys_config;
import cn.usually.modules.models.platform.sys.Sys_route;

/**
 * Created on 2016/6/22.
 */
public class Globals {
    //项目路径
    public static String AppRoot = "";
    //项目目录
    public static String AppBase = "";
    //项目名称
    public static String AppName = "便利店服务";
    //项目短名称
    public static String AppShrotName = "easystore";
    //项目域名
    public static String AppDomain = "127.0.0.1";
    //文件上传路径
    public static String AppUploadPath = "/upload";

    //产品上传所在文件路径
    public static String UploadProductImagePath = "/image/product";
    
    /**
	 * 默认最大异步通知客户端次数:10
	 */
    public static Integer NotifyOrderMaxnum = 10;
    //系统自定义参数
    public static Map<String, String> MyConfig;
    //自定义路由
    public static Map<String, Sys_route> RouteMap;

    public static void init(Dao dao) {
        if (Globals.MyConfig == null) {
            Globals.MyConfig = new HashMap<>();
        } else Globals.MyConfig.clear();
        List<Sys_config> configList = dao.query(Sys_config.class, Cnd.NEW());
        for (Sys_config sysConfig : configList) {
            switch (sysConfig.getConfigKey()) {
                case "AppName":
                    Globals.AppName = sysConfig.getConfigValue();
                    break;
                case "AppShrotName":
                    Globals.AppShrotName = sysConfig.getConfigValue();
                    break;
                case "AppDomain":
                    Globals.AppDomain = sysConfig.getConfigValue();
                    break;
                case "AppUploadPath":
                    Globals.AppUploadPath = sysConfig.getConfigValue();
                    break;
                default:
                    Globals.MyConfig.put(sysConfig.getConfigKey(), sysConfig.getConfigValue());
                    break;
            }
        }
    }

    public static void initRoute(Dao dao) {
        if (Globals.RouteMap == null) {
            Globals.RouteMap = new HashMap<>();
        } else Globals.RouteMap.clear();
        List<Sys_route> routeList = dao.query(Sys_route.class, Cnd.where("disabled", "=", 0));
        for (Sys_route route : routeList) {
            RouteMap.put(route.getUrl(), route);
        }
    }
}
