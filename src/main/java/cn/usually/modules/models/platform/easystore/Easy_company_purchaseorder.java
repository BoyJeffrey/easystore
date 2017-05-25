package cn.usually.modules.models.platform.easystore;

import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.*;

import java.io.Serializable;
import java.util.List;

/**
 * Created on 2017/5/10.
 */
@Table("easy_company_purchaseorder")
@Comment("公司采购订单")
@TableIndexes({@Index(name = "INDEX_EASYCOMPANYPURCHASEORDER_COMPANYID", fields = {"company_id"}, unique = false),
			   @Index(name = "INDEX_EASYCOMPANYPURCHASEORDER_ORDERID", fields = {"order_id"}, unique = true)})
public class Easy_company_purchaseorder implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;

    @Column
    @Comment("公司ID，对应表easy_company中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long company_id;
    
    @Column
    @Comment("订单ID,唯一account_id+时间戳")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 150)
    private String order_id;
    
    @Column
    @Comment("订单创建时间")
    @NotNull
    @ColDefine(type = ColType.DATETIME)
    private String create_time;
    
    @Column
    @Comment("此次订单总金额:元")
    @NotNull
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double total_price;
    
    @Column
    @Comment("供货状态:0处理中;1采购员确认货到;2已取消")
    @NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int goods_status;
    
    @Column
    @Comment("支付状态:0未支付;1处理中;2支付成功")
    @NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int pay_status;
    
    @Column
    @Comment("支付方式:0未知;1现金;2微信支付")
    @NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int pay_way;

	@Column
	@Comment("订单支付时间")
	@NotNull
	@ColDefine(type = ColType.DATETIME)
	private String pay_time;
    
    @Column
    @Comment("第三方系统中付款订单号")
    @Default(value = "")
    @ColDefine(type = ColType.VARCHAR, width = 150)
    private String thirdpay_order_id;

    @One(target = Easy_company.class, field = "company_id")
    private Easy_company company;

	/**
	 * 详细订单信息
	 */
	private List<Easy_company_purchaseorderdetail> purchaseorderdetailList;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getCompany_id() {
		return company_id;
	}

	public void setCompany_id(long company_id) {
		this.company_id = company_id;
	}

	public String getOrder_id() {
		return order_id;
	}

	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}

	public String getCreate_time() {
		return create_time;
	}

	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}

	public Double getTotal_price() {
		return total_price;
	}

	public void setTotal_price(Double total_price) {
		this.total_price = total_price;
	}

	public int getGoods_status() {
		return goods_status;
	}

	public void setGoods_status(int goods_status) {
		this.goods_status = goods_status;
	}

	public int getPay_status() {
		return pay_status;
	}

	public void setPay_status(int pay_status) {
		this.pay_status = pay_status;
	}

	public int getPay_way() {
		return pay_way;
	}

	public void setPay_way(int pay_way) {
		this.pay_way = pay_way;
	}

	public String getPay_time() {
		return pay_time;
	}

	public void setPay_time(String pay_time) {
		this.pay_time = pay_time;
	}

	public String getThirdpay_order_id() {
		return thirdpay_order_id;
	}

	public void setThirdpay_order_id(String thirdpay_order_id) {
		this.thirdpay_order_id = thirdpay_order_id;
	}

	public List<Easy_company_purchaseorderdetail> getPurchaseorderdetailList() {
		return purchaseorderdetailList;
	}

	public void setPurchaseorderdetailList(List<Easy_company_purchaseorderdetail> purchaseorderdetailList) {
		this.purchaseorderdetailList = purchaseorderdetailList;
	}

	public Easy_company getCompany() {
		return company;
	}

	public void setCompany(Easy_company company) {
		this.company = company;
	}
}
