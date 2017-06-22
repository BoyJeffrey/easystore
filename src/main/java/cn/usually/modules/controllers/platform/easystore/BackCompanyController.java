package cn.usually.modules.controllers.platform.easystore;

import cn.usually.common.constant.ConstantEasystoreOrder;
import cn.usually.common.constant.ConstantSys;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.modules.models.platform.easystore.Easy_company_product;
import cn.usually.modules.models.platform.easystore.Easy_company_purchaseaccount;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_orderdetail;
import cn.usually.modules.models.platform.sys.Sys_user;
import cn.usually.modules.services.platform.easystore.*;
import cn.usually.modules.services.platform.sys.SysRoleService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
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

/**
 * 每个公司后台人员登录处理Controller:目前采购员角色即为企业后台登录人员
 */
@IocBean
@At("/platform/backcompany")
@Filters({@By(type = PrivateFilter.class)})
public class BackCompanyController {
	private static final Log log = Logs.get();

    @Inject
    BackCompanyService backCompanyService;
    @Inject
    SysRoleService roleService;
    @Inject
    private EasyCompanyService easyCompanyService;
    @Inject
    private EasyCompanyPurchaseaccountService easyCompanyPurchaseaccountService;
    @Inject
    private EasyCompanyPurchaseorderService easyCompanyPurchaseorderService;
    @Inject
    private EasyEmpolyeeOrderService easyEmpolyeeOrderService;
    @Inject
    private EasyEmpolyeeOrderdetailService easyEmpolyeeOrderdetailService;

    /**
     * 企业基本信息
     * @param req
     * @return
     */
    @At
    @Ok("beetl:/platform/easystore/backcompany/companyinfo.html")
    @RequiresAuthentication
    public Object companyinfo(HttpServletRequest req) {
        boolean flag_role_purchase = roleService.includeTargetRolecodeByCurrentLoginUser(ConstantSys.SYSROLE_PURCHASE); // 是否为采购员角色
        if(flag_role_purchase) {
            req.setAttribute("isRolePurchase", true);
            Sys_user user = (Sys_user) SecurityUtils.getSubject().getPrincipal();
            Easy_company_purchaseaccount purchaseaccount = easyCompanyPurchaseaccountService.fetch(Cnd.where("userId", "=", user.getId()));
            return easyCompanyService.fetch(purchaseaccount.getCompany_id());
        }else {
            req.setAttribute("isRolePurchase", false);
            return null;
        }
    }

    /**
     * 货架状况一览
     * @param req
     * @return
     */
    @At
    @Ok("beetl:/platform/easystore/backcompany/companyproduct.html")
    @RequiresAuthentication
    public Object companyproduct(HttpServletRequest req) {
        boolean flag_role_purchase = roleService.includeTargetRolecodeByCurrentLoginUser(ConstantSys.SYSROLE_PURCHASE); // 是否为采购员角色
        if(flag_role_purchase) {
            req.setAttribute("isRolePurchase", true);
            Sys_user user = (Sys_user) SecurityUtils.getSubject().getPrincipal();
            Easy_company_purchaseaccount purchaseaccount = easyCompanyPurchaseaccountService.fetch(Cnd.where("userId", "=", user.getId()));
            // 查询公司货架上所有信息
            List<Easy_company_product> companyProductList = easyCompanyPurchaseorderService.queryCompanyProduct(purchaseaccount.getCompany_id());
            req.setAttribute("companyProductList" ,companyProductList);
            return easyCompanyService.fetch(purchaseaccount.getCompany_id());
        }else {
            req.setAttribute("isRolePurchase", false);
            return null;
        }
    }

    @At
    @Ok("beetl:/platform/easystore/backcompany/consumemonth.html")
    @RequiresAuthentication
    public void consumemonth(HttpServletRequest req) {
        boolean flag_role_purchase = roleService.includeTargetRolecodeByCurrentLoginUser(ConstantSys.SYSROLE_PURCHASE); // 是否为采购员角色
        if(flag_role_purchase) {
            req.setAttribute("isRolePurchase", true);
        }else {
            req.setAttribute("isRolePurchase", false);
        }
    }

    /**
     * 员工消费一览主页面:按月统计该公司消费数据
     * @param length
     * @param start
     * @param draw
     * @param order
     * @param columns
     * @return
     */
    @At
    @Ok("json:full")
    @RequiresAuthentication
    public Object consumemonthData(@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
        // 获取登录用户相关公司信息
        Sys_user user = (Sys_user) SecurityUtils.getSubject().getPrincipal();
        Easy_company_purchaseaccount purchaseaccount = easyCompanyPurchaseaccountService.fetch(Cnd.where("userId", "=", user.getId()));
        // 按年-月统计用户消费和商品实际金额
        String sql = "select A.date_month, consume_employee_sum, consume_employee_amount,consume_product_amount, consume_product_amount - consume_employee_amount as consume_company_amount" +
                " from (select DATE_FORMAT(ordermain.pay_time, '%Y-%m') as date_month, count(ordermain.id) as consume_employee_sum, sum(ordermain.total_price) as consume_employee_amount" +
                                " from easy_empolyee_order ordermain" +
                                " where ordermain.company_id=" + purchaseaccount.getCompany_id() + " and ordermain.pay_status=" + ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_PAYSUCCESS + " GROUP BY DATE_FORMAT(ordermain.pay_time, '%Y-%m')) A" +
                " inner join (select DATE_FORMAT(ordermain.pay_time, '%Y-%m') as date_month, sum(product.price_company * orderdetail.product_num) as consume_product_amount" +
                                " from easy_empolyee_order ordermain inner join easy_empolyee_orderdetail orderdetail on orderdetail.buy_order_id = ordermain.buy_order_id" +
                                " inner join easy_product product on product.id = orderdetail.product_id " +
                                " where ordermain.company_id=" + purchaseaccount.getCompany_id() + " and ordermain.pay_status=" + ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_PAYSUCCESS + " GROUP BY DATE_FORMAT(ordermain.pay_time, '%Y-%m')) B on A.date_month = B.date_month";
        String s = sql;
        if (order != null && order.size() > 0) {
            for (DataTableOrder o : order) {
                DataTableColumn col = columns.get(o.getColumn());
                s += " order by " + Sqls.escapeSqlFieldValue(col.getData()).toString() + " " + o.getDir();
            }
        }
        return backCompanyService.data(length, start, draw, Sqls.create(sql), Sqls.create(s));
    }

    @At
    @Ok("beetl:/platform/easystore/backcompany/consumeemployee.html")
    @RequiresAuthentication
    public void consumeemployee(HttpServletRequest req) {

    }

    /**
     * 员工购买列表
     * @param length
     * @param start
     * @param draw
     * @param order
     * @param columns
     * @return
     */
    @At
    @Ok("json:full")
    @RequiresAuthentication
    public Object consumeemployeeData(@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
        // 获取登录用户相关公司信息
        Sys_user user = (Sys_user) SecurityUtils.getSubject().getPrincipal();
        Easy_company_purchaseaccount purchaseaccount = easyCompanyPurchaseaccountService.fetch(Cnd.where("userId", "=", user.getId()));
        Cnd cnd = Cnd.NEW();
        cnd.and("company_id", "=", purchaseaccount.getCompany_id()).and("pay_status","=", ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_PAYSUCCESS);
        return easyEmpolyeeOrderService.data(length, start, draw, order, columns, cnd, "company");
    }

    @At("/consumedetail/?")
    @Ok("beetl:/platform/easystore/backcompany/consumedetail.html")
    @RequiresAuthentication
    public void consumedetail(String buy_order_id, HttpServletRequest req) {
        List<Easy_empolyee_orderdetail> orderdetailList = new ArrayList<>();
        if (!Strings.isBlank(buy_order_id)) {
            orderdetailList = easyEmpolyeeOrderdetailService.query(Cnd.where("buy_order_id", "=", buy_order_id));
        }
        req.setAttribute("orderdetailList", orderdetailList);
    }

}
