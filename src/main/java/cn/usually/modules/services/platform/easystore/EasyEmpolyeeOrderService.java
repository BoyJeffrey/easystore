package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_order;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
@IocBean(args = {"refer:dao"})
public class EasyEmpolyeeOrderService extends Service<Easy_empolyee_order> {
	private static final Log log = Logs.get();

    public EasyEmpolyeeOrderService(Dao dao) {
    	super(dao);
    }
}

