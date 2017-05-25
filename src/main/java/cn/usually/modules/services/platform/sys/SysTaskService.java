package cn.usually.modules.services.platform.sys;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.sys.Sys_task;
@IocBean(args = {"refer:dao"})
public class SysTaskService extends Service<Sys_task> {
	private static final Log log = Logs.get();

    public SysTaskService(Dao dao) {
    	super(dao);
    }
}

