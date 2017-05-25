package cn.usually.common.util;

import java.util.List;
import java.util.Map;

/**
 * String相关工具类
 * @author fengpro@163.com
 * Copyright:(c) 2016年3月23日 下午1:39:00
 * company:民生在线
 */
public class Strings {
	
	public static boolean isNullOrEmpty(String source){
		if(source == null || "".equals(source.trim())){
			return true;
		}
		return false;
	}
	
	public static boolean isNotNullOrEmpty(String source){
		if(source == null || "".equals(source.trim())){
			return false;
		}
		return true;
	}
	
	/**
	 * 获取String值
	 * @return
	 */
	public static String toStringValue(Object o) {
		if(o == null)
			return "";
		else
			return String.valueOf(o).trim();
	}
	
	/***
	 * 截取字符串后四位，不足四位直接返回 
	 * 为空时 返回【0000】
	 * @param source
	 * @return
	 */
	public static String subStringParam(String source,int num){
		if(isNotNullOrEmpty(source)){
			if(source.length() <= num){
				return source;
			}else{
				return source.substring(source.length()-num, source.length());
			}
		}else{
			return "0000";
		}
	}

	/**
	 * list非空
	 * @param list
	 * @return
	 */
	public static boolean listNotEmpty(List<?> list) {
		if(list != null && list.size() > 0)
			return true;
		else
			return  false;
	}

	/**
	 * map非空
	 * @param map
	 * @return
	 */
	public static boolean mapNotEmpty(Map map) {
		if(map != null && map.size() > 0)
			return true;
		else
			return  false;
	}
}
