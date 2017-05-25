package cn.usually.modules.models.frontapi.result;

import java.util.List;

/**
 * @desc 用户扫描货柜二维码后所显示产品信息
 * @author
 * @Copyright: (c) 2017年5月15日 下午2:45:12
 * @company: 便利店
 */
public class CompanyProducts {

    private String title; // 标题:如xxx自助便利店

    private List<ProductCategoryInfo> categoryList; // 产品类型信息列表

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<ProductCategoryInfo> getCategoryList() {
        return categoryList;
    }

    public void setCategoryList(List<ProductCategoryInfo> categoryList) {
        this.categoryList = categoryList;
    }
}