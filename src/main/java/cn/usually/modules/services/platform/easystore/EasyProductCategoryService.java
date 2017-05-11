package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.easystore.Easy_product_category;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
@IocBean(args = {"refer:dao"})
public class EasyProductCategoryService extends Service<Easy_product_category> {
	private static final Log log = Logs.get();

    public EasyProductCategoryService(Dao dao) {
    	super(dao);
    }
}

