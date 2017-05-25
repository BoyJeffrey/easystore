package cn.usually.modules.models.check;

/**
 * @desc 校验信息
 * @author
 * @Copyright: (c) 2016年12月5日 下午5:10:54
 * @company: 民生在线
 */
public class CheckInfo {

	private boolean flag; // 是否校验通过
	private String check_result_code; // 校验结果代码
	private String msg; // 信息

	public boolean getFlag() {
		return flag;
	}

	public void setFlag(boolean flag) {
		this.flag = flag;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public String getCheck_result_code() {
		return check_result_code;
	}

	public void setCheck_result_code(String check_result_code) {
		this.check_result_code = check_result_code;
	}

}