package cn.usually.modules.models.app.pay.result;

/**
 * @desc 异步通知信息
 * @author
 * @Copyright: (c) 2016年12月7日 下午4:09:48
 * @company: 民生在线
 */
public class NotifyInfo {

	private String out_trade_no; // 原支付请求的商户订单号
	private String amount; // 金额(元)
	private String trade_status; // 交易状态:支付成功 PAYSUCCESS;支付失败 PAYFAIL;支付中 PAYING

	public String getOut_trade_no() {
		return out_trade_no;
	}

	public void setOut_trade_no(String out_trade_no) {
		this.out_trade_no = out_trade_no;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getTrade_status() {
		return trade_status;
	}

	public void setTrade_status(String trade_status) {
		this.trade_status = trade_status;
	}

}
