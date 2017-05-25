package cn.usually.modules.models.platform.easystore;

import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.*;

import java.io.Serializable;

/**
 * Created on 2017/5/10.
 */
@Table("easy_empolyee_order")
@Comment("员工购买零食订单")
@TableIndexes({@Index(name = "INDEX_EASYEMPOLYEEEORDER_COMPANYID", fields = {"company_id"}, unique = false)})
public class Easy_empolyee_order implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;
    
    @Column
    @Comment("员工购买ID,openid + time")
	@Name
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 150)
    private String buy_order_id;

    @Column
    @Comment("公司ID，对应表easy_company中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long company_id;

    @Column
    @Comment("员工微信公众号ID:openid")
    @ColDefine(type = ColType.VARCHAR, width = 150)
    private String openid;
    
    @Column
	@Comment("员工购买创建时间")
	@NotNull
	@ColDefine(type = ColType.DATETIME)
	private String create_time;
    
    @Column
    @Comment("此次订单应付金额:元")
    @NotNull
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double total_price;
    
    @Column
    @Comment("第三方支付系统中支付订单号")
    @Default(value = "")
    @ColDefine(type = ColType.VARCHAR, width = 150)
    private String thirdpay_order_id;

	@Column
	@Comment("支付完成时间")
	@ColDefine(type = ColType.DATETIME)
	private String pay_time;
    
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

	public long getCompany_id() {
		return company_id;
	}

	public void setCompany_id(long company_id) {
		this.company_id = company_id;
	}

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
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

	public String getThirdpay_order_id() {
		return thirdpay_order_id;
	}

	public void setThirdpay_order_id(String thirdpay_order_id) {
		this.thirdpay_order_id = thirdpay_order_id;
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
}
