package cn.usually.modules.models.frontapi.result;

/**
 * @desc 用户扫描货柜二维码后所显示产品详细信息
 * @author
 * @Copyright: (c) 2017年5月15日 下午2:45:12
 * @company: 便利店
 */
public class ProductInfo {

    private long product_id; // 产品Id

    private String product_name; // 产品名称

    private String image_url; // 产品图片URL

    private double price_public; // 产品市场价格

    private double price_empolyee; // 产品该公司员工价格

    private int num; // 公司货架上该产品存货量


    // 额外参数
    private String title;
    private long category_id;
    private String product_category_name;

    public long getProduct_id() {
        return product_id;
    }

    public void setProduct_id(long product_id) {
        this.product_id = product_id;
    }

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public double getPrice_public() {
        return price_public;
    }

    public void setPrice_public(double price_public) {
        this.price_public = price_public;
    }

    public double getPrice_empolyee() {
        return price_empolyee;
    }

    public void setPrice_empolyee(double price_empolyee) {
        this.price_empolyee = price_empolyee;
    }

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

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
}