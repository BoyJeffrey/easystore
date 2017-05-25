package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.easystore.Easy_company_purchaseaccount;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
@IocBean(args = {"refer:dao"})
public class EasyCompanyPurchaseaccountService extends Service<Easy_company_purchaseaccount> {
	private static final Log log = Logs.get();

    public EasyCompanyPurchaseaccountService(Dao dao) {
    	super(dao);
    }
}

