package cn.usually.modules.services.platform.sys;

import org.nutz.aop.interceptor.ioc.TransAop;
import org.nutz.dao.Chain;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.ioc.aop.Aop;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.Strings;

import cn.usually.common.base.Service;
import cn.usually.modules.models.platform.sys.Sys_menu;

/**
 * Created on 2016/6/24.
 */
@IocBean(args = {"refer:dao"})
public class SysMenuService extends Service<Sys_menu> {
    public SysMenuService(Dao dao) {
        super(dao);
    }

    /**
     * 新增菜单
     *
     * @param menu
     * @param pid
     */
    @Aop(TransAop.READ_COMMITTED)
    public void save(Sys_menu menu, String pid) {
        String path = "";
        if (!Strings.isEmpty(pid)) {
            Sys_menu pp = this.fetch(pid);
            path = pp.getPath();
        } else pid = "";
        menu.setPath(getSubPath("sys_menu", "path", path));
        menu.setParentId(pid);
        dao().insert(menu);
        if (!Strings.isEmpty(pid) && "menu".equals(menu.getType())) {
            this.update(Chain.make("hasChildren", true), Cnd.where("id", "=", pid));
        }
    }

    /**
     * 级联删除菜单
     *
     * @param unit
     */
    @Aop(TransAop.READ_COMMITTED)
    public void deleteAndChild(Sys_menu unit) {
        // 先删除菜单相关信息
        dao().execute(Sqls.create("delete from sys_role_menu where menuId=@id or menuId in(SELECT id FROM sys_menu WHERE path like @path)").setParam("id", unit.getId()).setParam("path", unit.getPath() + "%"));
        // 最后再删除菜信息
        dao().execute(Sqls.create("delete from sys_menu where path like @path").setParam("path", unit.getPath() + "%"));
        if (!Strings.isEmpty(unit.getParentId())) {
            int count = count(Cnd.where("parentId", "=", unit.getParentId()));
            if (count < 1) {
                dao().execute(Sqls.create("update sys_menu set hasChildren=0 where id=@pid").setParam("pid", unit.getParentId()));
            }
        }
    }
}
