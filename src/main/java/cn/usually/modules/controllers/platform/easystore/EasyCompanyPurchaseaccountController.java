package cn.usually.modules.controllers.platform.easystore;

import cn.usually.common.annotation.SLog;
import cn.usually.common.base.Result;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.modules.models.platform.easystore.Easy_company_purchaseaccount;
import cn.usually.modules.services.platform.easystore.EasyCompanyPurchaseaccountService;
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

@IocBean
@At("/platform/company/purchaseaccount")
@Filters({@By(type = PrivateFilter.class)})
public class EasyCompanyPurchaseaccountController {
	private static final Log log = Logs.get();
	@Inject
	private EasyCompanyPurchaseaccountService easyCompanyPurchaseaccountService;

	@Inject
	private EasyCompanyService easyCompanyService;

	@At("/editPurchaseaccount/?")
	@Ok("beetl:/platform/easystore/company/purchaseaccount/index.html")
	@RequiresAuthentication
	public Object editPurchaseaccount(long company_id) {
		return easyCompanyService.fetch(company_id);
	}

	@At
	@Ok("json:full")
	@RequiresAuthentication
	public Object data(@Param("company_id") long company_id,@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		Cnd cnd = Cnd.NEW();
		if(company_id > 0)
			cnd.and("company_id", "=",company_id);
		return easyCompanyPurchaseaccountService.data(length, start, draw, order, columns, cnd, null);
    }

    @At("/add/?")
    @Ok("beetl:/platform/easystore/company/purchaseaccount/add.html")
    @RequiresAuthentication
    public void add(@Param("company_id") long company_id, HttpServletRequest req) {
		req.setAttribute("company_id", company_id);
    }

    @At
    @Ok("json")
    @SLog(tag = "新建公司采购人员信息", msg = "")
    public Object addDo(@Param("..") Easy_company_purchaseaccount easyCompanyPurchaseaccount, HttpServletRequest req) {
		try {
			easyCompanyPurchaseaccountService.insert(easyCompanyPurchaseaccount);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }

    @At("/edit/?")
    @Ok("beetl:/platform/easystore/company/purchaseaccount/edit.html")
    @RequiresAuthentication
    public Object edit(long id) {
		return easyCompanyPurchaseaccountService.fetch(id);
    }

    @At
    @Ok("json")
    @SLog(tag = "修改公司采购人员信息", msg = "ID:${args[0].id}")
    public Object editDo(@Param("..") Easy_company_purchaseaccount easyCompanyPurchaseaccount, HttpServletRequest req) {
		try {

			easyCompanyPurchaseaccount.setOpAt((int) (System.currentTimeMillis() / 1000));
			easyCompanyPurchaseaccountService.updateIgnoreNull(easyCompanyPurchaseaccount);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }


    @At({"/delete","/delete/?"})
    @Ok("json")
    @SLog(tag = "删除公司采购人员信息", msg = "ID:${args[2].getAttribute('id')}")
    public Object delete(long id, @Param("ids") Long[] ids ,HttpServletRequest req) {
		try {
			if(ids!=null&&ids.length>0){
				easyCompanyPurchaseaccountService.delete(ids);
    			req.setAttribute("id", org.apache.shiro.util.StringUtils.toString(ids));
			}else{
				easyCompanyPurchaseaccountService.delete(id);
    			req.setAttribute("id", id);
			}
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }


    @At("/detail/?")
    @Ok("beetl:/platform/easystore/company/purchaseaccount/detail.html")
    @RequiresAuthentication
	public Object detail(long id) {
		if (id > 0) {
			return easyCompanyPurchaseaccountService.fetch(id);

		}
		return null;
    }

}
