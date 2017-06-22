package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

@IocBean(args = {"refer:dao"})
public class BackCompanyService extends Service {
	private static final Log log = Logs.get();

    public BackCompanyService(Dao dao) {
    	super(dao);
    }
}

