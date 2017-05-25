package cn.usually.common.util;

import cn.usually.modules.models.check.CheckInfo;

/**
 * @desc 校验常量
 * @author 
 * @Copyright: (c) 2016年12月6日 上午9:18:21
 * @company: 
 */
public class CheckUtil {
	
	/**
	 * 获取默认验证成功的对象
	 * @return
	 */
	public static CheckInfo getDefaultSuccessCheckInfo() {
		CheckInfo checkInfo = new CheckInfo();
		checkInfo.setFlag(true);
		checkInfo.setMsg("");
		return checkInfo;
	}
	
	/**
	 * 获取默认验证失败的对象
	 * @return
	 */
	public static CheckInfo getDefaultFalseCheckInfo() {
		CheckInfo checkInfo = new CheckInfo();
		checkInfo.setFlag(false);
		checkInfo.setMsg("");
		return checkInfo;
	}
	
	/**
	 * 清空校验对象
	 * @param checkInfo
	 */
	public static void emptyCheckInfo(CheckInfo checkInfo) {
		checkInfo.setFlag(false);
		checkInfo.setMsg("");
	}

}
