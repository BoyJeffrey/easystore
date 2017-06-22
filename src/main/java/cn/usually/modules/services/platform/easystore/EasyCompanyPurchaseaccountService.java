package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.common.constant.ConstantSys;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_company_purchaseaccount;
import cn.usually.modules.models.platform.sys.Sys_user;
import cn.usually.modules.services.platform.sys.SysRoleService;
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

    /**
     * 根据送货员的用户Ids依次查询其是否关联采购员角色
     * @param roleService
     * @param userIds
     * @param checkInfo
     */
    public void searchPurchaseaccountByUserids(SysRoleService roleService, String[] userIds, CheckInfo checkInfo) {
        for(String userId : userIds) {
            // 检查是否为送货员
            boolean flag_role_purchase = roleService.includeTargetRolecodeByUserid(userId, ConstantSys.SYSROLE_PURCHASE);
            if(flag_role_purchase) {
                checkInfo.setFlag(false);
                // 查询该用户信息
                Sys_user user = dao().fetch(Sys_user.class, userId);
                checkInfo.setMsg("待删除用户中用户【" + user.getLoginname() + "】角色为采购员,请先至【公司信息管理】---【操作】---【管理采购员】中对采购员进行相关删除操作！");
                return;
            }

        }
    }
}

