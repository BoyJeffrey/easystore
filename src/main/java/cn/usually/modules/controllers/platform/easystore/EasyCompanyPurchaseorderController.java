package cn.usually.modules.controllers.platform.easystore;

import cn.usually.common.annotation.SLog;
import cn.usually.common.base.Result;
import cn.usually.common.constant.ConstantEasystoreOrder;
import cn.usually.common.constant.ConstantSys;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.common.util.CheckUtil;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_company_product;
import cn.usually.modules.models.platform.easystore.Easy_company_purchaseorder;
import cn.usually.modules.models.platform.easystore.Easy_company_purchaseorderdetail;
import cn.usually.modules.models.platform.easystore.Easy_product_category;
import cn.usually.modules.services.platform.easystore.*;
import cn.usually.modules.services.platform.sys.SysRoleService;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.nutz.dao.Cnd;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 后台 - 采购管理
 */
@IocBean
@At("/platform/purchaseorder")
@Filters({@By(type = PrivateFilter.class)})
public class EasyCompanyPurchaseorderController {
	private static final Log log = Logs.get();
	@Inject
	private EasyCompanyPurchaseorderService easyCompanyPurchaseorderService;

	@Inject
	private EasyCompanyService easyCompanyService;

	@Inject
	private EasyProductService easyProductService;

	@Inject
	private EasyProductCategoryService easyProductCategoryService;

	@Inject
	private SysRoleService roleService;

	@Inject
	private EasyDeliverymanService deliverymanService;

	@At("/showcompany")
	@Ok("beetl:/platform/easystore/purchaseorder/showCompany.html")
	@RequiresAuthentication
	public void showCompany() {

	}

	/**
	 * 管理员查看全部公司;送货员查看其所关联公司:前提创建用户时送货员只有送货员角色
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
	public Object showCompanyData(@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		Cnd cnd = Cnd.NEW();
		boolean flag_role_delivery = roleService.includeTargetRolecodeByCurrentLoginUser(ConstantSys.SYSROLE_DELIVERY); // 是否包含送货员角色
		if(flag_role_delivery) {
			// 查询送货员所有关联公司Ids
			Long[] ids = deliverymanService.getDeliverymanAssociateCompanyIdsByCurrentLoginDeliveryman();
			if(ids != null)
				cnd.and("id","in",ids);
			else
				cnd.and("1","=","2");
		}
		return easyCompanyService.data(length, start, draw, order, columns, cnd, null);
	}

	@At("/purchaseCompanyProduct/?")
	@Ok("beetl:/platform/easystore/purchaseorder/purchaseCompanyProduct.html")
	@RequiresAuthentication
	public void purchaseCompanyProduct(long company_id, HttpServletRequest req) {
		// 查询所有正常上架的产品类别中的正常上架的产品
		List<Easy_product_category> productCategoryList = easyCompanyPurchaseorderService.queryNormalProductCategoryList();
		req.setAttribute("company_id" ,company_id);
		req.setAttribute("productCategoryList" ,productCategoryList);

	}

	/**
	 * 采购产品
	 * @param company_id
	 * @param orderitem_datas
	 * @param req
	 * @return
	 */
	@At("/purchaseCompanyProductDo")
	@Ok("json")
	@SLog(tag = "公司采购产品订单", msg = "purchaseCompanyProductDo")
	public Object purchaseCompanyProductDo(@Param("company_id") long company_id, @Param("orderitem_datas") String orderitem_datas, HttpServletRequest req) {
		try {
			// 根据公司ID和所采购产品信息采购产品订单
			List<Easy_company_purchaseorderdetail> purchaseorderdetailList = Json.fromJsonAsList(Easy_company_purchaseorderdetail.class,orderitem_datas);
			CheckInfo checkInfo = CheckUtil.getDefaultSuccessCheckInfo();
			easyCompanyPurchaseorderService.purchaseCompanyProduct(company_id,purchaseorderdetailList, checkInfo);
			if(! checkInfo.getFlag()) {
				log.errorf("purchaseCompanyProductDo error:" + checkInfo.getMsg());
				return Result.error("system.error");
			}
			return Result.success("system.success");
		} catch (Exception e) {
			e.printStackTrace();
			return Result.error("system.error");
		}
	}

	/**
	 * 采购单主页面:管理员查看所有;送货员则查看其关联公司;某个公司
	 * @param company_id
	 * @param req
	 */
	@At({"/info","/info/?"})
	@Ok("beetl:/platform/easystore/purchaseorder/index.html")
	@RequiresAuthentication
	public void index(long company_id, HttpServletRequest req) {
		req.setAttribute("company_id", company_id);
	}

	@At("/info/data")
	@Ok("json:full")
	@RequiresAuthentication
	public Object data(@Param("company_id") long company_id, @Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		Cnd cnd = Cnd.NEW();
		if(company_id > 0) // 某个公司
			cnd.and("company_id", "=", company_id);
		else {
			boolean flag_role_delivery = roleService.includeTargetRolecodeByCurrentLoginUser(ConstantSys.SYSROLE_DELIVERY); // 是否包含送货员角色
			if(flag_role_delivery) { // 登录人员为采购员时所关联公司
				// 查询送货员所有关联公司Ids
				Long[] ids = deliverymanService.getDeliverymanAssociateCompanyIdsByCurrentLoginDeliveryman();
				if(ids != null)
					cnd.and("company_id","in",ids);
				else
					cnd.and("1","=","2");
			}
		}
    	return easyCompanyPurchaseorderService.data(length, start, draw, order, columns, cnd, "company");
    }

    @At("/info/editMain/?/?")
    @Ok("beetl:/platform/easystore/purchaseorder/editMain.html")
    @RequiresAuthentication
    public Object editMain(long id, long company_id, HttpServletRequest req) {
		// 查询当前采购订单主信息
		Easy_company_purchaseorder purchaseorder = easyCompanyPurchaseorderService.fetchLinks(easyCompanyPurchaseorderService.fetch(id), "company");
		req.setAttribute("company_id", company_id);
		return purchaseorder;
    }

    @At("/info/editMainDo")
    @Ok("json")
    @SLog(tag = "修改公司采购订单主信息", msg = "ID:${args[0].id}")
    public Object editMainDo(@Param("..") Easy_company_purchaseorder easyCompanyPurchaseorder, HttpServletRequest req) {
		try {
			easyCompanyPurchaseorderService.updatePrchaseorderMain(easyCompanyPurchaseorder, true);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }

	@At("/info/editDetail/?/?")
	@Ok("beetl:/platform/easystore/purchaseorder/editDetail.html")
	@RequiresAuthentication
	public Object editDetail(long id, long company_id, HttpServletRequest req) {
		// 查询所有正常上架的产品类别中的正常上架的产品
		List<Easy_product_category> productCategoryList = easyCompanyPurchaseorderService.queryNormalProductCategoryList();
		// 查询当前采购订单主信息
		Easy_company_purchaseorder purchaseorder = easyCompanyPurchaseorderService.fetch(id);
		// 将订单详情中产品量融入默认采购产品为0的正常上架产品
		easyCompanyPurchaseorderService.convertPurchaseorderdetailToProductCategoryList(purchaseorder, productCategoryList);
		req.setAttribute("productCategoryList", productCategoryList);
		req.setAttribute("company_id", company_id);
		return purchaseorder;
	}

	@At("/info/editDetailDo")
	@Ok("json")
	@SLog(tag = "修改公司采购订单详细信息", msg = "")
	public Object editDetailDo(@Param("id") long id, @Param("orderitem_datas") String orderitem_datas) {
		try {
			// 查询当前主订单信息
			Easy_company_purchaseorder purchaseorder = easyCompanyPurchaseorderService.fetch(id);
			if(purchaseorder != null && purchaseorder.getGoods_status() == ConstantEasystoreOrder.PURCHASEORDER_GOODSSTATUS_DEALING) { // 只有处理状态下的采购单才可以修改
				// 转换为修改后采购详情
				List<Easy_company_purchaseorderdetail> purchaseorderdetailList = Json.fromJsonAsList(Easy_company_purchaseorderdetail.class,orderitem_datas);
				CheckInfo checkInfo = CheckUtil.getDefaultSuccessCheckInfo();
				// 根据主订单id和修改后的采购单详细信息进行修改工作
				easyCompanyPurchaseorderService.updatePurchaseorderdetail(purchaseorder, purchaseorderdetailList, checkInfo);
			} else
				return Result.error("只有处理状态下的采购单才可以修改");
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
	}


    @At({"/info/delete","/info/delete/?"})
    @Ok("json")
	@RequiresPermissions("sys.purchaseorder.info.delete")
    @SLog(tag = "删除公司采购订单", msg = "ID:${args[2].getAttribute('id')}")
    public Object delete(long id, @Param("ids") Long[] ids ,HttpServletRequest req) {
		try {
			CheckInfo checkInfo = CheckUtil.getDefaultSuccessCheckInfo();
			if(ids!=null&&ids.length>0){
				// 校验采购订单是否可以被删除
				easyCompanyPurchaseorderService.canDeleteCompanyPurchaseorder(ids, checkInfo);
				if(checkInfo.getFlag()) {
					easyCompanyPurchaseorderService.deletePurchaseorder(ids);
				}else
					return Result.error(checkInfo.getMsg());
    			req.setAttribute("id", org.apache.shiro.util.StringUtils.toString(ids));
			}else{
				// 校验采购订单是否可以被删除
				easyCompanyPurchaseorderService.canDeleteCompanyPurchaseorder(id, checkInfo);
				if(checkInfo.getFlag()) {
					easyCompanyPurchaseorderService.deletePurchaseorder(id);
				}else
					return Result.error(checkInfo.getMsg());
    			req.setAttribute("id", id);
			}
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }


    @At("/info/detail/?")
    @Ok("beetl:/platform/easystore/purchaseorder/detail.html")
    @RequiresAuthentication
	public Object detail(long id, HttpServletRequest req) {
		if (id > 0) {
			// 采购订单主信息
			Easy_company_purchaseorder company_purchaseorder = easyCompanyPurchaseorderService.fetchLinks(easyCompanyPurchaseorderService.fetch(id), "company");
			// 获取采购订单详细信息,并转换为产品类型信息列表
			List<Easy_product_category> productCategoryList = easyCompanyPurchaseorderService.getPurchaseorderdetailAsProductCategoryList(company_purchaseorder.getOrder_id());
			req.setAttribute("productCategoryList", productCategoryList);
			return company_purchaseorder;
		}
		return null;
    }

	@At("/showCompanyProduct/?")
	@Ok("beetl:/platform/easystore/purchaseorder/showCompanyProduct.html")
	@RequiresAuthentication
	public Object showCompanyProduct(long company_id, HttpServletRequest req) {
		// 查询公司货架上所有信息
		List<Easy_company_product> companyProductList = easyCompanyPurchaseorderService.queryCompanyProduct(company_id);
		req.setAttribute("companyProductList" ,companyProductList);
		return easyCompanyService.fetch(company_id);
	}

}
