package cn.usually.modules.models.app.pay.result;

/**
 * @desc 微信JSAPI支付前信息
 * @author
 * @Copyright: (c) 2016年12月6日 下午7:27:07
 * @company:
 */
public class WechatPageInfo {

	private String appid; // 服务号的应用号
	private String timeStamp; // 时间戳
	private String nonceStr; // 随机数
	private String packageStr; // appid拼接
	private String sign; // 签名处理后信息
	private String prepay_id; // 微信支付所需prepay_id

	public String getAppid() {
		return appid;
	}

	public void setAppid(String appid) {
		this.appid = appid;
	}

	public String getTimeStamp() {
		return timeStamp;
	}

	public void setTimeStamp(String timeStamp) {
		this.timeStamp = timeStamp;
	}

	public String getNonceStr() {
		return nonceStr;
	}

	public void setNonceStr(String nonceStr) {
		this.nonceStr = nonceStr;
	}

	public String getPackageStr() {
		return packageStr;
	}

	public void setPackageStr(String packageStr) {
		this.packageStr = packageStr;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public String getPrepay_id() {
		return prepay_id;
	}

	public void setPrepay_id(String prepay_id) {
		this.prepay_id = prepay_id;
	}

}
