package cn.usually.modules.services.platform.union;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.union.Union_config;

/**
 * Created on 2016/12/2.
 */
@IocBean(args = {"refer:dao"})
public class UnionConfigService extends Service<Union_config> {
    public UnionConfigService(Dao dao) {
        super(dao);
    }

}
