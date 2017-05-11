package cn.usually.modules.services.platform.alipay;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.alipay.Alipay_config;

/**
 * Created on 2016/12/2.
 */
@IocBean(args = {"refer:dao"})
public class AlipayConfigService extends Service<Alipay_config> {
    public AlipayConfigService(Dao dao) {
        super(dao);
    }

}
