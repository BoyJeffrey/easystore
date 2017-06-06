package cn.usually.modules.controllers.frontweb;

import cn.usually.modules.services.frontweb.WeChatMenuService;
import com.yimin.easystore.wechat.pojo.WeChatMenu;
import com.yimin.easystore.wechat.util.WeChatUtil;
import net.sf.json.JSONObject;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Ok;

import javax.servlet.http.HttpServletRequest;

@IocBean
@At("/menu")
public class WeChatMenuController extends WeChatBaseController {
	
	@Inject
	WeChatMenuService menuService;
	
	/*
	 * 删除菜单请求
	 */
	@At("/deletemenu")
	@Ok("beetl:/frontweb/wechat/result.html")
	public void deleteMenu(HttpServletRequest request) {

		String accessToken = getAccessToken();
		JSONObject requestResult = WeChatUtil.deleteMenu(accessToken);
		if(requestResult != null){
			request.setAttribute("code", requestResult.getInt("errcode"));
			request.setAttribute("codestring", requestResult.getString("errmsg"));
		}else {
			request.setAttribute("code", 67);
			request.setAttribute("codestring", "jsonobject为空");
		}
	}
	
	/*
	 * 建立菜单请求
	 */
	@At("/createmenu")
	@Ok("beetl:/frontweb/wechat/result.html")
	public void createMenu(HttpServletRequest request){
		WeChatMenu newMenu = menuService.createWeChatMenu();
		String accessToken = getAccessToken();
		JSONObject requestResult = WeChatUtil.createMenu(newMenu, accessToken);
		if(requestResult != null){
			request.setAttribute("code", requestResult.getInt("errcode"));
			request.setAttribute("codestring", requestResult.getString("errmsg"));
		}else {
			request.setAttribute("code", 67);
			request.setAttribute("codestring", "jsonobject为空");
		}
		
	}
	
	/*
	 * 重建菜单请求
	 * 步骤：
	 * 1.删除菜单
	 * 2.建立菜单
	 */
	@At("/rebuildmenu")
	@Ok("beetl:/frontweb/wechat/result.html")
	public void rebuildMenu(HttpServletRequest request){
		String accessToken = getAccessToken();
		JSONObject	deleteReqeustResult = WeChatUtil.deleteMenu(accessToken);
		if(deleteReqeustResult == null){
			request.setAttribute("code", 67);
			request.setAttribute("codestring", "删除菜单jsonobject为空");
			return;
		}else if(deleteReqeustResult.getInt("errcode") != 0){
			request.setAttribute("code", deleteReqeustResult.getInt("errcode"));
			request.setAttribute("codestring", "删除菜单返回结果： " + deleteReqeustResult.getString("errmsg"));
			return;
		}
		
		WeChatMenu newMenu = menuService.createWeChatMenu();
		JSONObject createRequestResult = WeChatUtil.createMenu(newMenu, accessToken);
		if(createRequestResult != null){
			request.setAttribute("code", createRequestResult.getInt("errcode"));
			request.setAttribute("codestring", "建立菜单返回结果： " + createRequestResult.getString("errmsg"));
		}else {
			request.setAttribute("code", 67);
			request.setAttribute("codestring", "建立菜单返回结果： " + "jsonobject为空");
		}
	}
}
