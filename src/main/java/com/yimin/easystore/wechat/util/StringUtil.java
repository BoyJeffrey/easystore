package com.yimin.easystore.wechat.util;

/**
 * string util
 * @author MichaelZhou
 *
 */
public class StringUtil {
	/**
	 * 去除字符串中的空格
	 * 
	 * @param value
	 * @return 去掉空格后的字符串
	 */
	public static String removeBlank(String value) {
		return value.replaceAll(" ", "");
	}
	/**
	 * 判断字符串是否空.
	 * 
	 * @param value
	 * @return true:是, false:否
	 */
	
	public static boolean isBlank(String value) {
		if (null == value || "".equals(value)) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * 判断字符串不为空
	 * 
	 * @return
	 */
	public static boolean isNotBlank(String value) {
		return !isBlank(value);
	}
	
	/**
	 * 判断字符串是否none.
	 * 
	 * @param value
	 * @return true:是none, false:none
	 */
	public static boolean isNone(String value) {
		if ( "none"== value || "none".equals(value)) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 判断字符串是否0.
	 * 
	 * @param value
	 * @return true:是0, false:不是0
	 */
	public static boolean isZero(String value) {
		if ( "0"== value || "0".equals(value)) {
			return true;
		} else {
			return false;
		}
	}
}
