package cn.usually.modules.services.platform.wx;

import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.weixin.impl.WxApi2Impl;
import org.nutz.weixin.spi.WxApi2;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.wx.Wx_config;

/**
 * Created on 2016/7/2.
 */
@IocBean(args = {"refer:dao"})
public class WxConfigService extends Service<Wx_config> {
    public WxConfigService(Dao dao) {
        super(dao);
    }

    public WxApi2 getWxApi2(String wxid) {
        Wx_config appInfo = this.fetch(Cnd.where("id", "=", wxid));
        WxApi2Impl wxApi2 = new WxApi2Impl();
        wxApi2.setAppid(appInfo.getAppid());
        wxApi2.setAppsecret(appInfo.getAppsecret());
        wxApi2.setEncodingAesKey(appInfo.getEncodingAESKey());
        wxApi2.setToken(appInfo.getToken());
        return wxApi2;
    }
}
