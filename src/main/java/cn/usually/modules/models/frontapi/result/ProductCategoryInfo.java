package cn.usually.modules.models.frontapi.result;

import java.util.List;

/**
 * @desc 用户扫描货柜二维码后所显示产品类型信息
 * @author
 * @Copyright: (c) 2017年5月15日 下午2:45:12
 * @company: 便利店
 */
public class ProductCategoryInfo {

    private long category_id; // 产品分类Id

    private String product_category_name; // 产品分类名称

    private List<ProductInfo> productInfoList; // 产品信息列表

    public long getCategory_id() {
        return category_id;
    }

    public void setCategory_id(long category_id) {
        this.category_id = category_id;
    }

    public String getProduct_category_name() {
        return product_category_name;
    }

    public void setProduct_category_name(String product_category_name) {
        this.product_category_name = product_category_name;
    }

    public List<ProductInfo> getProductInfoList() {
        return productInfoList;
    }

    public void setProductInfoList(List<ProductInfo> productInfoList) {
        this.productInfoList = productInfoList;
    }
}