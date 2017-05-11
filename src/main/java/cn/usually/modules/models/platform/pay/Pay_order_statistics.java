package cn.usually.modules.models.platform.pay;

import java.io.Serializable;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.EL;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Prev;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

import cn.usually.common.base.Model;
import cn.usually.common.util.UuidUtil;

/**
 * @desc 
 * @author 
 * @Copyright: (c) 2016年12月5日 下午2:23:34
 * @company: 
 */
@Table("pay_order_statistics")
@TableIndexes({@Index(name = "INDEX_ORDERSTATISTICS_OUTTRADENO", fields = {"out_trade_no"}, unique = true)})
public class Pay_order_statistics extends Model implements Serializable {
	private static final long serialVersionUID = 1342544027091961758L;
	
	@Column
    @Name
    @Comment("ID")
    @ColDefine(type = ColType.VARCHAR, width = 32)
    @Prev(els = {@EL("$me.genID()")})
    private String id;

    @Column
    @Comment("商户订单号")
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String out_trade_no;
    
    @Column
    @Comment("第三方返回订单号")
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String trade_no_third;
    
    @Column
    @Comment("支付方名称")
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String payer_name;
    
    @Column
    @Comment("收款方名称")
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String payee_name;
    
    @Column
    @Comment("金额:元")
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double amount;
    
    @Column
    @Comment("订单创建时间")
    @ColDefine(type = ColType.DATETIME)
    private String createtime;
    
    @Column
    @Comment("订单支付时间")
    @ColDefine(type = ColType.DATETIME)
    private String paytime;
    
    @Column
    @Comment("订单退款时间")
    @ColDefine(type = ColType.DATETIME)
    private String refund_time;
    
    @Column
    @Comment("订单状态【1未支付 2处理中 3支付成功 4支付失败 5已取消 6退款中 7已退款】")
    @ColDefine(type = ColType.INT)
    private Integer order_status;
    
    @Column
    @Comment("订单状态【1支付宝 2网银 3微信支付】")
    @ColDefine(type = ColType.INT)
    private Integer payment;
    
    @Column
    @Comment("前端同步返回url")
    @ColDefine(type = ColType.VARCHAR, width = 255)
    private String front_url;
    
    @Column
    @Comment("后端异步回调url")
    @ColDefine(type = ColType.VARCHAR, width = 255)
    private String notify_url;
    
    @Column
    @Default(value = "0")
    @Comment("异步通知次数")
    @ColDefine(type = ColType.INT)
    private Integer notify_num;
    
    @Column
    @Default(value = "0")
    @Comment("推送成功标志:0回调推送未返回信息;1 回调推送成功")
    @ColDefine(type = ColType.INT)
    private Integer flag_backsuccess;
    
    @Column
    @Comment("订单来源【1惠缘包】")
    @ColDefine(type = ColType.INT)
    private Integer source_entrance;
    
    @Column
    @Comment("备注")
    @ColDefine(type = ColType.VARCHAR, width = 255)
    private String remark;
    
    @Column
    @Comment("订单描述")
    @ColDefine(type = ColType.VARCHAR, width = 255)
    private String subject_name;
    
    public String genID() {
    	return UuidUtil.getTablePk();
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getOut_trade_no() {
		return out_trade_no;
	}

	public void setOut_trade_no(String out_trade_no) {
		this.out_trade_no = out_trade_no;
	}

	public String getTrade_no_third() {
		return trade_no_third;
	}

	public void setTrade_no_third(String trade_no_third) {
		this.trade_no_third = trade_no_third;
	}

	public String getPayer_name() {
		return payer_name;
	}

	public void setPayer_name(String payer_name) {
		this.payer_name = payer_name;
	}

	public String getPayee_name() {
		return payee_name;
	}

	public void setPayee_name(String payee_name) {
		this.payee_name = payee_name;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}

	public String getPaytime() {
		return paytime;
	}

	public void setPaytime(String paytime) {
		this.paytime = paytime;
	}

	public String getRefund_time() {
		return refund_time;
	}

	public void setRefund_time(String refund_time) {
		this.refund_time = refund_time;
	}

	public Integer getOrder_status() {
		return order_status;
	}

	public void setOrder_status(Integer order_status) {
		this.order_status = order_status;
	}

	public Integer getPayment() {
		return payment;
	}

	public void setPayment(Integer payment) {
		this.payment = payment;
	}

	public String getFront_url() {
		return front_url;
	}

	public void setFront_url(String front_url) {
		this.front_url = front_url;
	}

	public String getNotify_url() {
		return notify_url;
	}

	public void setNotify_url(String notify_url) {
		this.notify_url = notify_url;
	}

	public Integer getNotify_num() {
		return notify_num;
	}

	public void setNotify_num(Integer notify_num) {
		this.notify_num = notify_num;
	}

	public Integer getFlag_backsuccess() {
		return flag_backsuccess;
	}

	public void setFlag_backsuccess(Integer flag_backsuccess) {
		this.flag_backsuccess = flag_backsuccess;
	}

	public Integer getSource_entrance() {
		return source_entrance;
	}

	public void setSource_entrance(Integer source_entrance) {
		this.source_entrance = source_entrance;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getSubject_name() {
		return subject_name;
	}

	public void setSubject_name(String subject_name) {
		this.subject_name = subject_name;
	}
	
}
