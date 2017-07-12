package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_orderdetail;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
@IocBean(args = {"refer:dao"})
public class EasyEmpolyeeOrderdetailService extends Service<Easy_empolyee_orderdetail> {
	private static final Log log = Logs.get();

    public EasyEmpolyeeOrderdetailService(Dao dao) {
    	super(dao);
    }
}

