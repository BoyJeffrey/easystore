package cn.usually.modules.services.platform.sys;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.sys.Sys_menu;
import cn.usually.modules.models.platform.sys.Sys_role;
import cn.usually.modules.models.platform.sys.Sys_user;
import org.apache.shiro.SecurityUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.entity.Entity;
import org.nutz.dao.sql.Sql;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.Strings;

import java.util.ArrayList;
import java.util.List;

/**
 * Created on 2016/6/22.
 */
@IocBean(args = {"refer:dao"})
public class SysRoleService extends Service<Sys_role> {
    public SysRoleService(Dao dao) {
        super(dao);
    }

    public List<Sys_menu> getMenusAndButtons(String roleId) {
        Sql sql = Sqls.create("select distinct a.* from sys_menu a,sys_role_menu b where a.id=b.menuId and" +
                " b.roleId=@roleId and a.disabled=0 order by a.location ASC,a.path asc");
        sql.params().set("roleId", roleId);
        Entity<Sys_menu> entity = dao().getEntity(Sys_menu.class);
        sql.setEntity(entity);
        sql.setCallback(Sqls.callback.entities());
        dao().execute(sql);
        return sql.getList(Sys_menu.class);
    }

    public List<Sys_menu> getDatas(String roleId) {
        Sql sql = Sqls.create("select distinct a.* from sys_menu a,sys_role_menu b where a.id=b.menuId and" +
                " b.roleId=@roleId and a.type='data' and a.disabled=0 order by a.location ASC,a.path asc");
        sql.params().set("roleId", roleId);
        Entity<Sys_menu> entity = dao().getEntity(Sys_menu.class);
        sql.setEntity(entity);
        sql.setCallback(Sqls.callback.entities());
        dao().execute(sql);
        return sql.getList(Sys_menu.class);
    }

    public List<Sys_menu> getDatas() {
        Sql sql = Sqls.create("select distinct a.* from sys_menu a,sys_role_menu b where a.id=b.menuId and a.type='data' order by a.location ASC,a.path asc");
        Entity<Sys_menu> entity = dao().getEntity(Sys_menu.class);
        sql.setEntity(entity);
        sql.setCallback(Sqls.callback.entities());
        dao().execute(sql);
        return sql.getList(Sys_menu.class);
    }

    /**
     * 查询权限
     *
     * @param role
     * @return
     */
    public List<String> getPermissionNameList(Sys_role role) {
        dao().fetchLinks(role, "menus");
        List<String> list = new ArrayList<String>();
        for (Sys_menu menu : role.getMenus()) {
            if (!Strings.isEmpty(menu.getPermission())) {
                list.add(menu.getPermission());
            }
        }
        return list;
    }

    /**
     *
     * 当前登录的用户角色中是否包含制定角色
     * @param role_code
     * @return
     */
    public boolean includeTargetRolecodeByCurrentLoginUser(String role_code) {
        boolean flag = false;
        // 查找指定的角色
        Sys_role sys_role = dao().fetch(Sys_role.class, Cnd.where("code","=",role_code));
        if(sys_role != null) {
            Sys_user user = (Sys_user) SecurityUtils.getSubject().getPrincipal();
            if(user != null && user.getId() != null) {
                int count = dao().count("sys_user_role", Cnd.where("roleId","=",sys_role.getId()).and("userId","=",user.getId()));
                if(count == 1) // 匹配成功
                    flag = true;
            }
        }

        return flag;
    }

    /**
     * 根据userId查询是否用户角色中是否包含制定角色
     * @param userId
     * @param role_code
     */
    public boolean includeTargetRolecodeByUserid(String userId, String role_code) {
        boolean flag = false;
        // 查找指定的角色
        Sys_role sys_role = dao().fetch(Sys_role.class, Cnd.where("code","=",role_code));
        if(sys_role != null) {
            int count = dao().count("sys_user_role", Cnd.where("roleId","=",sys_role.getId()).and("userId","=", userId));
            if(count == 1) // 匹配成功
                flag = true;
        }
        return flag;
    }
}
