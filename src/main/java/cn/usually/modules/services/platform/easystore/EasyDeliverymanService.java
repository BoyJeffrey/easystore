package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.common.constant.ConstantSys;
import cn.usually.common.util.Strings;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_deliveryman;
import cn.usually.modules.models.platform.easystore.Easy_deliveryman_associatecompany;
import cn.usually.modules.models.platform.sys.Sys_user;
import cn.usually.modules.services.platform.sys.SysRoleService;
import org.apache.shiro.SecurityUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import java.util.ArrayList;
import java.util.List;

@IocBean(args = {"refer:dao"})
public class EasyDeliverymanService extends Service<Easy_deliveryman> {
	private static final Log log = Logs.get();

    public EasyDeliverymanService(Dao dao) {
    	super(dao);
    }

    /**
     * 如果当前登录用户为送货员,获取其所关联的公司Ids
     * @return
     */
    public Long[] getDeliverymanAssociateCompanyIdsByCurrentLoginDeliveryman() {
        Long[] ids = null;
        Sys_user login_user = (Sys_user) SecurityUtils.getSubject().getPrincipal();
        if(login_user != null && login_user.getId() != null) {
            Easy_deliveryman deliveryman = dao().fetch(Easy_deliveryman.class, Cnd.where("userId","=",login_user.getId()));
            if(deliveryman != null) {
                List<Easy_deliveryman_associatecompany> deliveryman_associatecompanyList =
                        dao().query(Easy_deliveryman_associatecompany.class,Cnd.where("deliveryman_id","=", deliveryman.getId()));
                if(Strings.listNotEmpty(deliveryman_associatecompanyList)) {
                    int count = 0;
                    ids = new Long[deliveryman_associatecompanyList.size()];
                    for(Easy_deliveryman_associatecompany associatecompany : deliveryman_associatecompanyList)
                        ids[count++] = associatecompany.getCompany_id();
                }
            }
        }
        return ids;
    }

    /**
     * 根据送货员的用户Id查询其所关联的公司
     * @param userId
     * @return
     */
    public List<Easy_deliveryman_associatecompany> searchDeliverymanAssociatecompanyByUserid(String userId) {
        List<Easy_deliveryman_associatecompany> deliveryman_associatecompanyList = new ArrayList<>();
        Easy_deliveryman deliveryman = dao().fetch(Easy_deliveryman.class, Cnd.where("userId","=",userId));
        if(deliveryman != null) {
            deliveryman_associatecompanyList =
                    dao().query(Easy_deliveryman_associatecompany.class,Cnd.where("deliveryman_id","=", deliveryman.getId()));
        }
        return deliveryman_associatecompanyList;
    }

    /**
     * 根据送货员的用户Ids依次查询其所关联的公司
     * @param roleService
     * @param userIds
     * @param checkInfo
     */
    public void searchDeliverymanAssociatecompanyByUserids(SysRoleService roleService, String[] userIds, CheckInfo checkInfo) {
        for(String userId : userIds) {
            // 检查是否为送货员
            boolean flag_role_delivery = roleService.includeTargetRolecodeByUserid(userId, ConstantSys.SYSROLE_DELIVERY);
            if(flag_role_delivery) {
                List<Easy_deliveryman_associatecompany> deliveryman_associatecompanyList = searchDeliverymanAssociatecompanyByUserid(userId);
                if(Strings.listNotEmpty(deliveryman_associatecompanyList)) {
                    checkInfo.setFlag(false);
                    // 查询该用户信息
                    Sys_user user = dao().fetch(Sys_user.class, userId);
                    checkInfo.setMsg("待删除用户中用户【" + user.getLoginname() + "】角色为送货员,其下存在关联公司,请至【送货员管理】中解除关联关系后,才予以删除！");
                    return;
                }
            }

        }
    }
}

