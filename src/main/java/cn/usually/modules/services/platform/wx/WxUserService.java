package cn.usually.modules.services.platform.wx;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.wx.Wx_user;

/**
 * Created on 2016/7/3.
 */
@IocBean(args = {"refer:dao"})
public class WxUserService extends Service<Wx_user> {
    public WxUserService(Dao dao) {
        super(dao);
    }
}
