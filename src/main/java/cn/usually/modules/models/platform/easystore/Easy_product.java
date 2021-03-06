package cn.usually.modules.models.platform.easystore;

import cn.usually.common.base.Model;
import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.*;

import java.io.Serializable;

/**
 * Created on 2017/5/10.
 */
@Table("easy_product")
@Comment("产品")
@TableIndexes({@Index(name = "INDEX_EASYPRODUCT_CATEGORYID", fields = {"category_id"}, unique = false)})
public class Easy_product extends Model implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;

    @Column
    @Comment("产品名称")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String product_name;
    
    @Column
    @Comment("产品图片URL")
	@NotNull
    @Default(value="")
    @ColDefine(type = ColType.VARCHAR, width = 200)
    private String image_url;
    
    @Column
    @Comment("产品市面价格:元")
    @NotNull
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double price_public;
    
    @Column
    @Comment("产品供给公司的价格:元")
    @NotNull
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double price_company;
    
    @Column
    @Comment("产品类别ID,对应表easy_product_category中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long category_id;
    
    @Column
    @Comment("产品状态:0正常;1下架")
    @NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int status;
    
    @Column
    @Comment("产品库存")
    @NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int stock;

	@One(field = "category_id" , target = Easy_product_category.class)
	private Easy_product_category productCategory;

	// 其它临时参数
	private int product_num; // 产品库存信息

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public Double getPrice_public() {
		return price_public;
	}

	public void setPrice_public(Double price_public) {
		this.price_public = price_public;
	}

	public Double getPrice_company() {
		return price_company;
	}

	public void setPrice_company(Double price_company) {
		this.price_company = price_company;
	}

	public long getCategory_id() {
		return category_id;
	}

	public void setCategory_id(long category_id) {
		this.category_id = category_id;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public Easy_product_category getProductCategory() {
		return productCategory;
	}

	public void setProductCategory(Easy_product_category productCategory) {
		this.productCategory = productCategory;
	}

	public int getProduct_num() {
		return product_num;
	}

	public void setProduct_num(int product_num) {
		this.product_num = product_num;
	}
}
