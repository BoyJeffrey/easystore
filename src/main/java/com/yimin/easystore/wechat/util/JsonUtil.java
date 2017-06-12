package com.yimin.easystore.wechat.util;

import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
/**
 * 通过fastjson对bean进行操作的类
 * 
 * */
public class JsonUtil{
	

	public static final int JSON_CODE_OK = 0;
    public static final int JSON_CODE_ERROR = -1;
    
	/**
	 * 将前台传来的json通过 fastjson转成list
	 * @return List
	 * */
	public static <T> List<T> jsonToList(String json,Class<T> clazz){
		System.out.println(clazz);
		
		return JSON.parseArray(json, clazz);
	}
	
	/**
	 * 将list转变为json
	 */
	public static String ListToJson(List<?> list){
		return JSON.toJSONString(list);
	}
	
	public static JSONArray toJsonStr(String str){
		return JSON.parseArray(str);
	}
	
	
	//other

    public static JSONObject getJson(int code, String msg) {
        JSONObject json = new JSONObject();
        json.put("code", code + "");
        json.put("msg", msg);
        return json;
    }

    public static JSONObject getJson(int code, int left) {
        JSONObject json = new JSONObject();
        json.put("code", code);
        json.put("left", left);
        return json;
    }

    public static JSONObject getJson(JSONObject obj, int code, String msg) {
        obj.put("code", code);
        obj.put("msg", msg);
        return obj;
    }

    public static JSONObject getOkJson(String msg) {
        JSONObject json = new JSONObject();
        json.put("code", JSON_CODE_OK);
        json.put("msg", msg);
        return json;
    }

    public static JSONObject getOkJson() {
        return getOkJson("OK");
    }


    public static JSONObject getOkJsonResult(Object value) {
        JSONObject obj = getOkJson();
        obj.put("data", value);
        return obj;
    }

    public static JSONObject getOkJsonResult(String msg, Object obj) {
        JSONObject json = new JSONObject();
        json.put("code", 0);
        json.put("msg", msg);
        json.put("data", obj);
        return json;
    }

    public static JSONObject getJsonObject(String key, String value) {
        JSONObject json = new JSONObject();
        json.put(key, value);
        return json;
    }


    public static JSONObject getJson(String code, String message) {
        JSONObject json = new JSONObject();
        json.put("code", code);
        json.put("msg", message);
        return json;
    }

}
