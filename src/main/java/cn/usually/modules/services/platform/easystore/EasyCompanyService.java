package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.common.util.Strings;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.*;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import java.util.List;

@IocBean(args = {"refer:dao"})
public class EasyCompanyService extends Service<Easy_company> {
	private static final Log log = Logs.get();

    public EasyCompanyService(Dao dao) {
    	super(dao);
    }

    /**
     * 是否可以删除公司
     * @param company_id
     * @param checkInfo
     */
    public void canDeleteCompany(long company_id, CheckInfo checkInfo) {
        // 查询公司信息
        Easy_company company = dao().fetch(Easy_company.class, company_id);
        // 查找公司是采购过产品
        List<Easy_company_purchaseorder> purchaseorderList =
                dao().query(Easy_company_purchaseorder.class, Cnd.where("company_id", "=", company_id), dao().createPager(1,1));
        if(Strings.listNotEmpty(purchaseorderList)) {
            checkInfo.setFlag(false);
            checkInfo.setMsg("无法删除公司，检查到公司【" + company.getCompany_name() + "】已采购过产品");
            return;
        }
        // 查找公司是否关联送货员
        List<Easy_deliveryman_associatecompany> deliveryman_associatecompanyList =
                dao().query(Easy_deliveryman_associatecompany.class, Cnd.where("company_id", "=", company_id), dao().createPager(1,1));
        if(Strings.listNotEmpty(deliveryman_associatecompanyList)) {
            checkInfo.setFlag(false);
            checkInfo.setMsg("无法删除公司，检查到公司【" + company.getCompany_name() + "】已关联送货员");
            return;
        }
        // 查找公司是否关联采购员
        List<Easy_company_purchaseaccount> purchaseaccountList =
                dao().query(Easy_company_purchaseaccount.class, Cnd.where("company_id","=",company_id), dao().createPager(1,1));
        if(Strings.listNotEmpty(purchaseaccountList)) {
            checkInfo.setFlag(false);
            checkInfo.setMsg("无法删除公司，检查到公司【" + company.getCompany_name() + "】已关联采购员");
            return;
        }
    }

    /**
     * 待删除的公司,是否都可以删除
     * @param company_ids
     * @param checkInfo
     */
    public void canDeleteCompany(Long[] company_ids, CheckInfo checkInfo) {
        for(long company_id : company_ids) {
            canDeleteCompany(company_id, checkInfo);
            if(! checkInfo.getFlag()) // 存在不可删除的公司了
                return;
        }
    }
}

