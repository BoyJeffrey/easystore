package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.common.util.Strings;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_company_purchaseorderdetail;
import cn.usually.modules.models.platform.easystore.Easy_product;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import java.util.List;

@IocBean(args = {"refer:dao"})
public class EasyProductService extends Service<Easy_product> {
	private static final Log log = Logs.get();

    public EasyProductService(Dao dao) {
    	super(dao);
    }

    /**
     * 检查该产品是否可以删除
     * @param product_id
     * @param checkInfo
     */
    public void canDeleteProduct(long product_id, CheckInfo checkInfo) {
        // 查找采购单中是否出现过该产品
        List<Easy_company_purchaseorderdetail> purchaseorderdetailList = dao().query(Easy_company_purchaseorderdetail.class, Cnd.where("product_id", "=", product_id), dao().createPager(1,1));
        if(Strings.listNotEmpty(purchaseorderdetailList)) {
            checkInfo.setFlag(false);
            checkInfo.setMsg("无法删除该产品,检查到产品已被采购过");
        }

    }

    /**
     * 检查所有产品是否可以删除
     * @param product_ids
     * @param checkInfo
     */
    public void canDeleteProduct(Long[] product_ids, CheckInfo checkInfo) {
        for(long product_id : product_ids) {
            canDeleteProduct(product_id, checkInfo);
            if(! checkInfo.getFlag()) { // 存在不可删除产品了
                // 查询该产品信息
                Easy_product product = dao().fetch(Easy_product.class, product_id);
                checkInfo.setMsg("无法批量删除产品，检查到产品【" + product.getProduct_name() + "】已被采购过");
            }
        }

    }
}

