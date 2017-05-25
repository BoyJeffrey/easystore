package cn.usually.modules.services.platform.sys;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.sys.Sys_log;

/**
 * Created on 2016/6/29.
 */
@IocBean(args = {"refer:dao"})
public class SysLogService extends Service<Sys_log> {
    public SysLogService(Dao dao) {
        super(dao);
    }
}
