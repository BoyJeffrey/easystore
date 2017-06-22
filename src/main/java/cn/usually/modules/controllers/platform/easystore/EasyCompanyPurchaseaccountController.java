package cn.usually.modules.controllers.platform.easystore;

import cn.usually.common.annotation.SLog;
import cn.usually.common.base.Result;
import cn.usually.common.constant.ConstantSys;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.modules.models.platform.easystore.Easy_company_purchaseaccount;
import cn.usually.modules.models.platform.sys.Sys_role;
import cn.usually.modules.models.platform.sys.Sys_user;
import cn.usually.modules.services.platform.easystore.EasyCompanyPurchaseaccountService;
import cn.usually.modules.services.platform.easystore.EasyCompanyService;
import cn.usually.modules.services.platform.sys.SysRoleService;
import cn.usually.modules.services.platform.sys.SysUserService;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.crypto.RandomNumberGenerator;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.nutz.dao.Cnd;
import org.nutz.dao.Sqls;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.Strings;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@IocBean
@At("/platform/company/purchaseaccount")
@Filters({@By(type = PrivateFilter.class)})
public class EasyCompanyPurchaseaccountController {
	private static final Log log = Logs.get();
	@Inject
	private EasyCompanyPurchaseaccountService easyCompanyPurchaseaccountService;

	@Inject
	private SysRoleService roleService;

	@Inject
	private SysUserService userService;

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
		String sql = "SELECT p.id,p.userId as user_id,u.loginname,u.nickname,p.company_purchasephone,u.disabled from easy_company_purchaseaccount p inner join sys_user u on u.id = p.userId";
		// 带上公司Id
		if(company_id > 0)
			sql += " where p.company_id = " + company_id;
		String s = sql;
		if (order != null && order.size() > 0) {
			for (DataTableOrder o : order) {
				DataTableColumn col = columns.get(o.getColumn());
				s += " order by " + Sqls.escapeSqlFieldValue(col.getData()).toString() + " " + o.getDir();
			}
		}
		return easyCompanyPurchaseaccountService.data(length, start, draw, Sqls.create(sql), Sqls.create(s));
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
    public Object addDo(@Param("..") Easy_company_purchaseaccount easyCompanyPurchaseaccount, @Param("..") Sys_user user, HttpServletRequest req) {
		try {
			// 新建用户
			Sys_user u = userService.fetch(Cnd.where("loginname", "=", user.getLoginname()));
			if (u != null)
				return Result.error("用户名已存在");
			RandomNumberGenerator rng = new SecureRandomNumberGenerator();
			String salt = rng.nextBytes().toBase64();
			String hashedPasswordBase64 = new Sha256Hash(user.getPassword(), salt, 1024).toBase64();
			user.setSalt(salt);
			user.setPassword(hashedPasswordBase64);
			user.setLoginPjax(true);
			user.setLoginCount(0);
			user.setLoginAt(0);
			Sys_user db_user = userService.insert(user);
			// 默认该用户为采购员角色
			Sys_role sys_role = roleService.fetch(Cnd.where("code", "=", ConstantSys.SYSROLE_PURCHASE));
			roleService.insert("sys_user_role", org.nutz.dao.Chain.make("roleId", sys_role.getId()).add("userId", db_user.getId()));
			// 获取新增的用户Id,保存至公司采购员表中
			easyCompanyPurchaseaccount.setUserId(db_user.getId());
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
		return easyCompanyPurchaseaccountService.fetchLinks(easyCompanyPurchaseaccountService.fetch(id), "sys_user");
    }

    @At
    @Ok("json")
    @SLog(tag = "修改公司采购人员信息", msg = "ID:${args[0].id}")
    public Object editDo(@Param("..") Easy_company_purchaseaccount easyCompanyPurchaseaccount, @Param("..") Sys_user user, @Param("oldLoginname") String oldLoginname, HttpServletRequest req) {
		try {
			int opAt = (int) (System.currentTimeMillis() / 1000);
			// 修改用户
			if (!Strings.sBlank(oldLoginname).equals(user.getLoginname())) {
				Sys_user u = userService.fetch(Cnd.where("loginname", "=", user.getLoginname()));
				if (u != null)
					return Result.error("用户名已存在");
			}
			user.setOpBy(Strings.sNull(req.getAttribute("uid")));
			user.setOpAt(opAt);
			user.setId(easyCompanyPurchaseaccount.getUserId()); // 获取当前所对应用户Id
			userService.updateIgnoreNull(user);
			// 修改公司采购员
			easyCompanyPurchaseaccount.setOpBy(Strings.sNull(req.getAttribute("uid")));
			easyCompanyPurchaseaccount.setOpAt(opAt);
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
				// 找出所有对应的用户Ids
				List<Easy_company_purchaseaccount> purchaseaccountList = easyCompanyPurchaseaccountService.query(Cnd.where("id", "in", ids));
				List<String> userIds = new ArrayList<>();
				for(Easy_company_purchaseaccount purchaseaccount : purchaseaccountList)
					userIds.add(purchaseaccount.getUserId());
				// 删除用户
				userService.deleteByIds(userIds.toArray(new String[purchaseaccountList.size()]));
				// 删除公司采购员
				easyCompanyPurchaseaccountService.delete(ids);
    			req.setAttribute("id", org.apache.shiro.util.StringUtils.toString(ids));
			}else{
				Easy_company_purchaseaccount purchaseaccount = easyCompanyPurchaseaccountService.fetch(id);
				// 删除用户
				userService.deleteById(purchaseaccount.getUserId());
				// 删除公司采购员
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
