package cn.usually.modules.controllers.platform.easystore;

import cn.usually.common.annotation.SLog;
import cn.usually.common.base.Result;
import cn.usually.common.filter.PrivateFilter;
import cn.usually.common.page.DataTableColumn;
import cn.usually.common.page.DataTableOrder;
import cn.usually.common.util.CheckUtil;
import cn.usually.common.util.ImageUtil;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_product;
import cn.usually.modules.models.platform.easystore.Easy_product_category;
import cn.usually.modules.services.platform.easystore.EasyProductCategoryService;
import cn.usually.modules.services.platform.easystore.EasyProductService;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.nutz.dao.Cnd;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.Strings;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.WhaleAdaptor;
import org.nutz.mvc.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 后台 - 商品管理
 */
@IocBean
@At("/platform/product/info")
@Filters({@By(type = PrivateFilter.class)})
public class EasyProductController {
	private static final Log log = Logs.get();
	@Inject
	private EasyProductService easyProductService;

	@Inject
	private EasyProductCategoryService easyProductCategoryService;

	@At("")
	@Ok("beetl:/platform/easystore/product/info/index.html")
	@RequiresAuthentication
	public void index() {

	}

	@At
	@Ok("json:full")
	@RequiresAuthentication
	public Object data(@Param("length") int length, @Param("start") int start, @Param("draw") int draw, @Param("::order") List<DataTableOrder> order, @Param("::columns") List<DataTableColumn> columns) {
		Cnd cnd = Cnd.NEW();
		return easyProductService.data(length, start, draw, order, columns, cnd, "productCategory");
    }

    @At
    @Ok("beetl:/platform/easystore/product/info/add.html")
    @RequiresAuthentication
    public void add(HttpServletRequest req) {
		// 产品类别获取
		List<Easy_product_category> category_list = easyProductCategoryService.query(Cnd.NEW());
		req.setAttribute("category_list", category_list);
    }

    @At
    @Ok("json")
    @SLog(tag = "新建产品", msg = "")
	@AdaptBy(type = WhaleAdaptor.class)
    public Object addDo(@Param("..") Easy_product easyProduct, HttpServletRequest req) {
		try {
			// 无图片则插入默认图片
			String image_url = easyProduct.getImage_url();
			if(Strings.isBlank(image_url))
				easyProduct.setImage_url(ImageUtil.getDefaultProductImageUrl());
			easyProductService.insert(easyProduct);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }

    @At("/edit/?")
    @Ok("beetl:/platform/easystore/product/info/edit.html")
    @RequiresAuthentication
    public Object edit(long id, HttpServletRequest req) {
		// 产品类别获取
		List<Easy_product_category> category_list = easyProductCategoryService.query(Cnd.NEW());
		req.setAttribute("category_list", category_list);
		Easy_product easy_product = easyProductService.fetch(id);
		req.setAttribute("categoryId", easy_product.getCategory_id());
		return easy_product;
    }

    @At
    @Ok("json")
    @SLog(tag = "修改产品", msg = "ID:${args[0].id}")
	@AdaptBy(type = WhaleAdaptor.class)
    public Object editDo(@Param("..") Easy_product easyProduct, HttpServletRequest req) {
		try {
			// 无图片则插入默认图片
			String image_url = easyProduct.getImage_url();
			if(Strings.isBlank(image_url))
				easyProduct.setImage_url(ImageUtil.getDefaultProductImageUrl());
			easyProduct.setOpAt((int) (System.currentTimeMillis() / 1000));
			easyProductService.updateIgnoreNull(easyProduct);
			return Result.success("system.success");
		} catch (Exception e) {
			return Result.error("system.error");
		}
    }


    @At({"/delete","/delete/?"})
    @Ok("json")
    @SLog(tag = "删除产品", msg = "ID:${args[2].getAttribute('id')}")
    public Object delete(long id, @Param("ids") Long[] ids ,HttpServletRequest req) {
		try {
			CheckInfo checkInfo = CheckUtil.getDefaultSuccessCheckInfo();
			if(ids!=null&&ids.length>0){
				// 如果存在产品被采购过,则不予以删除
				easyProductService.canDeleteProduct(ids, checkInfo);
				if(checkInfo.getFlag()) {
					easyProductService.delete(ids);
				} else
					return Result.error(checkInfo.getMsg());
    			req.setAttribute("id", org.apache.shiro.util.StringUtils.toString(ids));
			}else{
				// 如果产品被采购过,不予删除
				easyProductService.canDeleteProduct(id, checkInfo);
				if(checkInfo.getFlag()) {
					easyProductService.delete(id);
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
    @Ok("beetl:/platform/easystore/product/info/detail.html")
    @RequiresAuthentication
	public Object detail(long id) {
		if (id > 0) {
			return easyProductService.fetch(id);

		}
		return null;
    }

}
