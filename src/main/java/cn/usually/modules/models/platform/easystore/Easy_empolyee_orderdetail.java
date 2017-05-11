package cn.usually.modules.models.platform.easystore;

import java.io.Serializable;

import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

/**
 * Created on 2017/5/10.
 */
@Table("easy_empolyee_orderdetail")
@Comment("员工购买零食订单详情")
@TableIndexes({@Index(name = "INDEX_EASYEMPOLYEEORDERDETAIL_BUYORDERID", fields = {"buy_order_id"}, unique = false),
	   @Index(name = "INDEX_EASYEMPOLYEEORDERDETAIL_PRODUCTID", fields = {"product_id"}, unique = false),
	   @Index(name = "INDEX_EASYEMPOLYEEORDERDETAIL_PRODUCTNAME", fields = {"product_name"}, unique = false)})
public class Easy_empolyee_orderdetail implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;
    
    @Column
    @Comment("所属员工购买订单号，对应表easy_empolyee_order中buy_order_id")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 150)
    private String buy_order_id;

    @Column
    @Comment("当前订单里的产品ID，对应表company_product中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long product_id;
    
    @Column
    @Comment("当前订单里的产品名称，对应表company_product中product_name")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String product_name;
    
    @Column
    @Comment("当前订单里的产品员工实际支付单价，根据福利类型计算所得")
    @NotNull
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double price_empolyee;
    
    @Column
    @Comment("当前订单里的产品数量:product_num>0")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long product_num;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getBuy_order_id() {
		return buy_order_id;
	}

	public void setBuy_order_id(String buy_order_id) {
		this.buy_order_id = buy_order_id;
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

	public Double getPrice_empolyee() {
		return price_empolyee;
	}

	public void setPrice_empolyee(Double price_empolyee) {
		this.price_empolyee = price_empolyee;
	}

	public long getProduct_num() {
		return product_num;
	}

	public void setProduct_num(long product_num) {
		this.product_num = product_num;
	}

}
