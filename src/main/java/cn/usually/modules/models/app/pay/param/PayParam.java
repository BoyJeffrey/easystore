package cn.usually.modules.models.app.pay.param;


/**
 * @desc 支付入参
 * @author
 * @Copyright: (c) 2016年12月2日 下午4:06:11
 * @company:
 */
public class PayParam {

	private String out_trade_no; // 原支付请求的商户订单号
	private String merchant_name; // 商户名称
	private String subject_name; // 商品名称
	private double amount; // 金额(元)
	private Integer paytype; // 支付类型:1支付宝;2微信;3银联
	private String front_url; // 支付宝-银联:前端同步返回地址;微信:回调客户端url,用于跳转至客户端JS页面
	private String notify_url; // 后端异步回调地址
	private Integer source_entrance; // 订单来源【1 惠缘包】

	public String getOut_trade_no() {
		return out_trade_no;
	}

	public void setOut_trade_no(String out_trade_no) {
		this.out_trade_no = out_trade_no;
	}

	public String getMerchant_name() {
		return merchant_name;
	}

	public void setMerchant_name(String merchant_name) {
		this.merchant_name = merchant_name;
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

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public Integer getPaytype() {
		return paytype;
	}

	public void setPaytype(Integer paytype) {
		this.paytype = paytype;
	}

	public Integer getSource_entrance() {
		return source_entrance;
	}

	public void setSource_entrance(Integer source_entrance) {
		this.source_entrance = source_entrance;
	}

	public String getSubject_name() {
		return subject_name;
	}

	public void setSubject_name(String subject_name) {
		this.subject_name = subject_name;
	}

}
