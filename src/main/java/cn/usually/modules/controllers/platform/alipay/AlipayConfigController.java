package cn.usually.modules.controllers.platform.alipay;

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
import cn.usually.modules.models.platform.alipay.Alipay_config;
import cn.usually.modules.services.platform.alipay.AlipayConfigService;

/**
 * Created on 2016/7/3.
 */
@IocBean
@At("/platform/alipay/conf/account")
@Filters({@By(type = PrivateFilter.class)})
public class AlipayConfigController {
    private static final Log log = Logs.get();
    @Inject
    AlipayConfigService alipayConfigService;


    @At("")
    @Ok("beetl:/platform/alipay/account/index.html")
    @RequiresAuthentication
    public void index() {

    }

    @At
    @Ok("beetl:/platform/alipay/account/add.html")
    @RequiresAuthentication
    public void add() {

    }

    @At
    @Ok("json")
    @RequiresPermissions("alipay.conf.account.add")
    @SLog(tag = "添加帐号", msg = "帐号名称:${args[0].appname}")
    public Object addDo(@Param("..") Alipay_config conf, HttpServletRequest req) {
        try {
            alipayConfigService.insert(conf);
            return Result.success("system.success");
        } catch (Exception e) {
            return Result.error("system.error");
        }
    }

    @At("/edit/?")
    @Ok("beetl:/platform/alipay/account/edit.html")
    @RequiresAuthentication
    public Object edit(String id) {
        return alipayConfigService.fetch(id);
    }

    @At
    @Ok("json")
    @RequiresPermissions("alipay.conf.account.edit")
    @SLog(tag = "修改帐号", msg = "帐号名称:${args[0].partner_name}")
    public Object editDo(@Param("..") Alipay_config conf, HttpServletRequest req) {
        try {
            alipayConfigService.updateIgnoreNull(conf);
            return Result.success("system.success");
        } catch (Exception e) {
            return Result.error("system.error");
        }
    }

    @At("/delete/?")
    @Ok("json")
    @RequiresPermissions("alipay.conf.account.delete")
    @SLog(tag = "删除帐号", msg = "帐号名称:${args[1].getAttribute('partner_name')}")
    public Object delete(String id, HttpServletRequest req) {
        try {
            req.setAttribute("appname", alipayConfigService.fetch(id).getPartner_name());
            alipayConfigService.delete(id);
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
        return alipayConfigService.data(length, start, draw, order, columns, cnd, null);
    }
}
