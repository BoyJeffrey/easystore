package cn.usually.modules.services.platform.sys;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.sys.Sys_route;

/**
 * Created on 2016/7/31.
 */
@IocBean(args = {"refer:dao"})
public class SysRouteService extends Service<Sys_route> {
    private static final Log log = Logs.get();

    public SysRouteService(Dao dao) {
        super(dao);
    }
}
