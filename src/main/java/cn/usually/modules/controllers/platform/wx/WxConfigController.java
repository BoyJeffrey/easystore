package cn.usually.modules.controllers.platform.wx;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.nutz.dao.Cnd;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.By;
import org.nutz.mvc.annotation.Filters;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.annotation.Param;

import cn.usually.common.annotation.SLog;
import cn.usually.common.base.Result;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.modules.models.platform.wx.Wx_config;
import cn.usually.modules.services.platform.wx.WxConfigService;

/**
 * Created on 2016/7/3.
 */
@IocBean
@At("/platform/wx/conf/account")
@Filters({@By(type = PrivateFilter.class)})
public class WxConfigController {
    private static final Log log = Logs.get();
    @Inject
    WxConfigService wxConfigService;


    @At("")
    @Ok("beetl:/platform/wx/account/index.html")
    @RequiresAuthentication
    public void index() {

    }

    @At
    @Ok("beetl:/platform/wx/account/add.html")
    @RequiresAuthentication
    public void add() {

    }

    @At
    @Ok("json")
    @RequiresPermissions("wx.conf.account.add")
    @SLog(tag = "添加帐号", msg = "帐号名称:${args[0].appname}")
    public Object addDo(@Param("..") Wx_config conf, HttpServletRequest req) {
        try {
            wxConfigService.insert(conf);
            return Result.success("system.success");
        } catch (Exception e) {
            return Result.error("system.error");
        }
    }

    @At("/edit/?")
    @Ok("beetl:/platform/wx/account/edit.html")
    @RequiresAuthentication
    public Object edit(String id) {
        return wxConfigService.fetch(id);
    }

    @At
    @Ok("json")
    @RequiresPermissions("wx.conf.account.edit")
    @SLog(tag = "修改帐号", msg = "帐号名称:${args[0].appname}")
    public Object editDo(@Param("..") Wx_config conf, HttpServletRequest req) {
        try {
            wxConfigService.updateIgnoreNull(conf);
            return Result.success("system.success");
        } catch (Exception e) {
            return Result.error("system.error");
        }
    }

    @At("/delete/?")
    @Ok("json")
    @RequiresPermissions("wx.conf.account.delete")
    @SLog(tag = "删除帐号", msg = "帐号名称:${args[1].getAttribute('appname')}")
    public Object delete(String id, HttpServletRequest req) {
        try {
            req.setAttribute("appname", wxConfigService.fetch(id).getAppname());
            wxConfigService.delete(id);
            return Result.success("system.success");
        } catch (Exception e) {
            return Result.error("system.error");
        }
    }

    @At
    @Ok("json:full")
    @RequiresAuthentication
    public Object data(@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
        Cnd cnd = Cnd.NEW();
        return wxConfigService.data(length, start, draw, order, columns, cnd, null);
    }
}
