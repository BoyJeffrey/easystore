package cn.usually.modules.controllers.platform.easystore;

import cn.usually.common.annotation.SLog;
import cn.usually.common.base.Result;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.common.util.CheckUtil;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_company;
import cn.usually.modules.services.platform.easystore.EasyCompanyService;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.nutz.dao.Cnd;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 后台 - 公司信息管理
 */
@IocBean
@At("/platform/company/info")
@Filters({@By(type = PrivateFilter.class)})
public class EasyCompanyController {
	private static final Log log = Logs.get();
	@Inject
	private EasyCompanyService easyCompanyService;

	@At("")
	@Ok("beetl:/platform/easystore/company/info/index.html")
	@RequiresAuthentication
	public void index() {

	}

	@At
	@Ok("json:full")
	@RequiresAuthentication
	public Object data(@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		Cnd cnd = Cnd.NEW();
    	return easyCompanyService.data(length, start, draw, order, columns, cnd, null);
    }

    @At
    @Ok("beetl:/platform/easystore/company/info/add.html")
    @RequiresAuthentication
    public void add() {

    }

    @At
    @Ok("json")
    @SLog(tag = "新建采购公司---平台上提供员工福利的公司", msg = "")
    public Object addDo(@Param("..") Easy_company easyCompany, HttpServletRequest req) {
		try {
			easyCompanyService.insert(easyCompany);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }

    @At("/edit/?")
    @Ok("beetl:/platform/easystore/company/info/edit.html")
    @RequiresAuthentication
    public Object edit(long id) {
		Easy_company easy_company = easyCompanyService.fetch(id);
		return easy_company;
	}

    @At
    @Ok("json")
    @SLog(tag = "修改采购公司---平台上提供员工福利的公司", msg = "ID:${args[0].id}")
    public Object editDo(@Param("..") Easy_company easyCompany, HttpServletRequest req) {
		try {

			easyCompany.setOpAt((int) (System.currentTimeMillis() / 1000));
			easyCompanyService.updateIgnoreNull(easyCompany);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }


    @At({"/delete","/delete/?"})
    @Ok("json")
    @SLog(tag = "删除采购公司---平台上提供员工福利的公司", msg = "ID:${args[2].getAttribute('id')}")
    public Object delete(long id, @Param("ids") Long[] ids ,HttpServletRequest req) {
		try {
			CheckInfo checkInfo = CheckUtil.getDefaultSuccessCheckInfo();
			if(ids!=null&&ids.length>0){
				// 校验公司是否可以被删除
				easyCompanyService.canDeleteCompany(ids, checkInfo);
				if(checkInfo.getFlag()) {
					easyCompanyService.delete(ids);
				} else
					return Result.error(checkInfo.getMsg());
    			req.setAttribute("id", org.apache.shiro.util.StringUtils.toString(ids));
			}else{
				// 校验公司是否可以被删除
				easyCompanyService.canDeleteCompany(id, checkInfo);
				if(checkInfo.getFlag()) {
					easyCompanyService.delete(id);
				} else
					return Result.error(checkInfo.getMsg());
    			req.setAttribute("id", id);
			}
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }


    @At("/detail/?")
    @Ok("beetl:/platform/easystore/company/info/detail.html")
    @RequiresAuthentication
	public Object detail(long id) {
		if (id > 0) {
			return easyCompanyService.fetch(id);

		}
		return null;
    }

}
