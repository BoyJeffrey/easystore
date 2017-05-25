package cn.usually.modules.controllers.platform.easystore;

import cn.usually.common.annotation.SLog;
import cn.usually.common.base.Result;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.modules.models.platform.easystore.Easy_deliveryman;
import cn.usually.modules.models.platform.sys.Sys_role;
import cn.usually.modules.services.platform.easystore.EasyDeliverymanService;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.nutz.dao.Cnd;
import org.nutz.dao.Sqls;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.Strings;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@IocBean
@At("/platform/deliveryman/info")
@Filters({@By(type = PrivateFilter.class)})
public class EasyDeliverymanController {
	private static final Log log = Logs.get();
	@Inject
	private EasyDeliverymanService easyDeliverymanService;

	@At("")
	@Ok("beetl:/platform/easystore/deliveryman/info/index.html")
	@RequiresAuthentication
	public void index() {

	}

	@At
	@Ok("json:full")
	@RequiresAuthentication
	public Object data(@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		String sql = "SELECT d.id,u.loginname,d.deliveryman_name,u.nickname,d.deliveryman_phone,d.status from easy_deliveryman d inner join sys_user u on u.id = d.userId ";
		String s = sql;
		if (order != null && order.size() > 0) {
			for (DataTableOrder o : order) {
				DataTableColumn col = columns.get(o.getColumn());
				s += " order by " + Sqls.escapeSqlFieldValue(col.getData()).toString() + " " + o.getDir();
			}
		}
		return easyDeliverymanService.data(length, start, draw, Sqls.create(sql), Sqls.create(s));
    }

//    @At
//    @Ok("beetl:/platform/easystore/deliveryman/info/add.html")
//    @RequiresAuthentication
//    public void add() {
//
//    }
//
//    @At
//    @Ok("json")
//    @SLog(tag = "新建送货员管理", msg = "")
//    public Object addDo(@Param("..") Easy_deliveryman easyDeliveryman, HttpServletRequest req) {
//		try {
//			easyDeliverymanService.insert(easyDeliveryman);
//			return Result.success("system.success");
//		} catch (Exception e) {
//			return Result.error("system.error");
//		}
//    }

    @At("/edit/?")
    @Ok("beetl:/platform/easystore/deliveryman/info/edit.html")
    @RequiresAuthentication
    public Object edit(long id) {
		return easyDeliverymanService.fetchLinks(easyDeliverymanService.fetch(id), "sys_user");
    }

    @At
    @Ok("json")
    @SLog(tag = "修改送货员管理", msg = "ID:${args[0].id}")
    public Object editDo(@Param("..") Easy_deliveryman easyDeliveryman, HttpServletRequest req) {
		try {

			easyDeliveryman.setOpAt((int) (System.currentTimeMillis() / 1000));
			easyDeliverymanService.updateIgnoreNull(easyDeliveryman);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }


//    @At({"/delete","/delete/?"})
//	@Ok("json")
//	@SLog(tag = "删除送货员管理", msg = "ID:${args[2].getAttribute('id')}")
//	public Object delete(long id, @Param("ids") Long[] ids ,HttpServletRequest req) {
//		try {
//			if(ids!=null&&ids.length>0){
//				easyDeliverymanService.delete(ids);
//				req.setAttribute("id", org.apache.shiro.util.StringUtils.toString(ids));
//			}else{
//				easyDeliverymanService.delete(id);
//				req.setAttribute("id", id);
//			}
//			return Result.success("system.success");
//		} catch (Exception e) {
//			return Result.error("system.error");
//		}
//	}
//
//
	@At("/detail/?")
	@Ok("beetl:/platform/easystore/deliveryman/info/detail.html")
	@RequiresAuthentication
	public Object detail(long id) {
		if (id > 0) {
			return easyDeliverymanService.fetchLinks(easyDeliverymanService.fetch(id), "sys_user");

		}
		return null;
	}

	@At("/associateCompany/?")
	@Ok("beetl:/platform/easystore/deliveryman/info/associateCompany.html")
	@RequiresAuthentication
	public Object associateCompany(long deliveryman_id) {
		return easyDeliverymanService.fetch(deliveryman_id);
	}

	@At
	@Ok("json:full")
	@RequiresAuthentication
	public Object associateCompanyData(@Param("deliveryman_id") long deliveryman_id, @Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		String sql = "SELECT a.* FROM easy_company a,easy_deliveryman_associatecompany b WHERE a.id=b.company_id ";
		if (deliveryman_id > 0) {
			sql += " and b.deliveryman_id=" + deliveryman_id;
		}
		String s = sql;
		if (order != null && order.size() > 0) {
			for (DataTableOrder o : order) {
				DataTableColumn col = columns.get(o.getColumn());
				s += " order by a." + Sqls.escapeSqlFieldValue(col.getData()).toString() + " " + o.getDir();
			}
		}
		return easyDeliverymanService.data(length, start, draw, Sqls.create(sql), Sqls.create(s));
	}

	@At
	@Ok("beetl:/platform/easystore/deliveryman/info/selectCompany.html")
	@RequiresAuthentication
	public void selectCompany(HttpServletRequest req) {

	}

	@At
	@Ok("json:full")
	@RequiresAuthentication
	public Object selectCompanyData(@Param("deliveryman_id") long deliveryman_id, @Param("company_name") String company_name, @Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		String sql = "SELECT a.* FROM easy_company a WHERE 1=1 ";
		if (deliveryman_id > 0) {
			sql += " and a.id NOT IN(SELECT b.company_id FROM easy_deliveryman_associatecompany b WHERE b.deliveryman_id=" + deliveryman_id + ")";
		}
		if(StringUtils.isNotBlank(company_name)) {
			sql += " and a.company_name like '%" + company_name + "%'";
		}
		String s = sql;
		if (order != null && order.size() > 0) {
			for (DataTableOrder o : order) {
				DataTableColumn col = columns.get(o.getColumn());
				s += " order by a." + Sqls.escapeSqlFieldValue(col.getData()).toString() + " " + o.getDir();
			}
		}
		return easyDeliverymanService.data(length, start, draw, Sqls.create(sql), Sqls.create(s));
	}

	@At
	@Ok("json")
	@SLog(tag = "从送货员关联公司中删除公司", msg = "送货员名称:${args[2].getAttribute('deliveryman_name')},公司ID:${args[0]}")
	public Object delCompany(@Param("companyIds") Long[] companyIds, @Param("deliveryman_id") long deliveryman_id, HttpServletRequest req) {
		try {
			easyDeliverymanService.dao().clear("easy_deliveryman_associatecompany", Cnd.where("company_id", "in", companyIds).and("deliveryman_id", "=", deliveryman_id));
			Easy_deliveryman easy_deliveryman = easyDeliverymanService.fetch(deliveryman_id);
			req.setAttribute("name", easy_deliveryman.getDeliveryman_name());
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
	}

	@At
	@Ok("json")
	@SLog(tag = "关联公司到相关送货员", msg = "送货员名称:${args[2].getAttribute('deliveryman_name')},公司ID:${args[0]}")
	public Object pushCompany(@Param("companyIds") Long[] companyIds, @Param("deliveryman_id") long deliveryman_id, HttpServletRequest req) {
		try {
			for (long companyId : companyIds) {
				if (companyId > 0) {
					easyDeliverymanService.insert("easy_deliveryman_associatecompany", org.nutz.dao.Chain.make("deliveryman_id", deliveryman_id).add("company_id", companyId));
				}
			}
			Easy_deliveryman easy_deliveryman = easyDeliverymanService.fetch(deliveryman_id);
			req.setAttribute("name", easy_deliveryman.getDeliveryman_name());
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
	}

}
