package cn.usually.common.pay.paymanager;

/**
 * @desc redirect post
 * @author BoyJeffrey
 * @Copyright: (c) 2016年12月8日 上午9:51:17
 * @company: 
 */
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

public class PayManagerClient {
	
	private HttpServletResponse response;
	private String url;
	Map<String, String> paramMap = new HashMap<String, String>(); // 待提交入参

	public PayManagerClient(HttpServletResponse response, String url, Map<String, String> paramMap) {
		this.response = response;
		this.url = url;
		this.paramMap = paramMap;
	}
	
	/**
	 * 获取redirect post对象
	 * @param response
	 * @param payManagerParam
	 * @return
	 */
	public static PayManagerClient getPayManagerClient(HttpServletResponse response, String url, Map<String, String> paramMap) {
		return new PayManagerClient(response, url, paramMap);
	}

	/**
	 * post 方式重定向
	 * @param url
	 * @return false 失败
	 * @throws IOException
	 */
	public boolean redirectByPost() {
		// 参数是否已填写校验
		if(paramMap == null || (paramMap != null && paramMap.size() == 0))
			return false;
		// 组装参数进行提交
		this.response.setContentType("text/html");
		PrintWriter out;
		try {
			out = this.response.getWriter();
			out.println("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">");
			out.println("<HTML>");
			out.println(" <HEAD><TITLE>支付服务中心</TITLE></HEAD>");
			out.println(" <BODY>");
			out.println("<form name=\"submitForm\" action=\"" + url + "\" method=\"post\">");
			Iterator<String> it = paramMap.keySet().iterator();
			while (it.hasNext()) {
				String key = it.next();
				out.println("<input type=\"hidden\" name=\"" + key + "\" value=\"" + paramMap.get(key) + "\"/>");
			}
			out.println("</from>");
			out.println("<script>window.document.submitForm.submit();</script> ");
			out.println("</BODY>");
			out.println("</HTML>");
			out.flush();
			out.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
}
