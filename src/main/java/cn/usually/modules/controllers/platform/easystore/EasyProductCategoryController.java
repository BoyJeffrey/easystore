package cn.usually.modules.controllers.platform.easystore;

import cn.usually.common.annotation.SLog;
import cn.usually.common.base.Result;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.modules.models.platform.easystore.Easy_product_category;
import cn.usually.modules.services.platform.easystore.EasyProductCategoryService;
import cn.usually.modules.services.platform.easystore.EasyProductService;
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
 * 后台 - 商品分类管理
 */
@IocBean
@At("/platform/product/category")
@Filters({@By(type = PrivateFilter.class)})
public class EasyProductCategoryController {
	private static final Log log = Logs.get();
	@Inject
	private EasyProductCategoryService easyProductCategoryService;

	@Inject
	private EasyProductService easyProductService;

	@At("")
	@Ok("beetl:/platform/easystore/product/category/index.html")
	@RequiresAuthentication
	public void index() {

	}

	@At
	@Ok("json:full")
	@RequiresAuthentication
	public Object data(@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		Cnd cnd = Cnd.NEW();
    	return easyProductCategoryService.data(length, start, draw, order, columns, cnd, null);
    }

    @At
    @Ok("beetl:/platform/easystore/product/category/add.html")
    @RequiresAuthentication
    public void add() {

    }

    @At
    @Ok("json")
    @SLog(tag = "新建产品分类", msg = "")
    public Object addDo(@Param("..") Easy_product_category easyProductCategory, HttpServletRequest req) {
		try {
			easyProductCategoryService.insert(easyProductCategory);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }

    @At("/edit/?")
    @Ok("beetl:/platform/easystore/product/category/edit.html")
    @RequiresAuthentication
    public Object edit(long id) {
		return easyProductCategoryService.fetch(id);
    }

    @At
    @Ok("json")
    @SLog(tag = "修改产品分类", msg = "ID:${args[0].id}")
    public Object editDo(@Param("..") Easy_product_category easyProductCategory, HttpServletRequest req) {
		try {

			easyProductCategory.setOpAt((int) (System.currentTimeMillis() / 1000));
			easyProductCategoryService.updateIgnoreNull(easyProductCategory);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }


    @At({"/delete","/delete/?"})
    @Ok("json")
    @SLog(tag = "删除产品分类", msg = "ID:${args[2].getAttribute('id')}")
    public Object delete(long id, @Param("ids") Long[] ids ,HttpServletRequest req) {
		try {
			if(ids!=null&&ids.length>0){
				if(checkCanDelete(ids)) {
					easyProductCategoryService.delete(ids);
					req.setAttribute("id", org.apache.shiro.util.StringUtils.toString(ids));
				}else
					return Result.error("无法删除了，待删除产品类型中存在关联产品");
			}else{
				if(checkCanDelete(id)) {
					easyProductCategoryService.delete(id);
					req.setAttribute("id", id);
				}else
					return Result.error("无法删除了，该产品类型下存在关联产品");
			}
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }

	/**
	 * 是否可以刪除多个产品类型
	 * @param ids
	 * @return
	 */
	private boolean checkCanDelete(Long[] ids) {
		for (long id : ids) {
			if(! checkCanDelete(id)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 是否可以刪除单个产品类型:先查找待删除的产品类型下商品数量,>0则返回true;否则返回false
	 * @param id
	 * @return
	 */
	private boolean checkCanDelete(long id) {
		long count = easyProductService.count(Cnd.where("category_id","=",id));
		return count > 0 ? false : true;
	}


	@At("/detail/?")
    @Ok("beetl:/platform/easystore/product/category/detail.html")
    @RequiresAuthentication
	public Object detail(long id) {
		if (id > 0) {
			return easyProductCategoryService.fetch(id);

		}
		return null;
    }

}
