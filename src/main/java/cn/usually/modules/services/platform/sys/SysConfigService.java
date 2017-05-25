package cn.usually.modules.services.platform.sys;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.sys.Sys_config;

/**
 * Created on 2016/6/22.
 */
@IocBean(args = {"refer:dao"})
public class SysConfigService extends Service<Sys_config> {
    public SysConfigService(Dao dao) {
        super(dao);
    }

}
