package cn.usually.modules.models.platform.easystore;

import java.io.Serializable;

import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.*;

/**
 * Created on 2017/5/10.
 */
@Table("easy_company_purchaseorderdetail")
@Comment("公司采购订单详情")
@TableIndexes({@Index(name = "INDEX_EASYCOMPANYPURCHASEORDERDETAIL_ORDERID", fields = {"order_id"}, unique = false),
			   @Index(name = "INDEX_EASYCOMPANYPURCHASEORDERDETAIL_PRODUCTID", fields = {"product_id"}, unique = false),
			   @Index(name = "INDEX_EASYCOMPANYPURCHASEORDERDETAIL_PRODUCTNAME", fields = {"product_name"}, unique = false)})
public class Easy_company_purchaseorderdetail implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;
    
    @Column
    @Comment("所属采购订单号，对应表company_purchase_order中order_id")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 150)
    private String order_id;
    
    @Column
    @Comment("采购订单里的产品ID，对应表company_product中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long product_id;
    
    @Column
    @Comment("采购订单里的产品名称，对应表company_product中product_name")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String product_name;
    
    @Column
    @Comment("采购订单里的产品供给公司的单价，对应表company_product中price_company")
    @NotNull
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double price_company;
    
    @Column
    @Comment("采购订单里的产品数量:product_num>0")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long product_num;

    @One(target = Easy_product.class, field = "product_id")
    private Easy_product product;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getOrder_id() {
		return order_id;
	}

	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}

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

	public Double getPrice_company() {
		return price_company;
	}

	public void setPrice_company(Double price_company) {
		this.price_company = price_company;
	}

	public long getProduct_num() {
		return product_num;
	}

	public void setProduct_num(long product_num) {
		this.product_num = product_num;
	}

	public Easy_product getProduct() {
		return product;
	}

	public void setProduct(Easy_product product) {
		this.product = product;
	}
}
