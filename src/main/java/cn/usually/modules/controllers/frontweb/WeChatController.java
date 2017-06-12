package cn.usually.modules.controllers.frontweb;

import cn.usually.modules.services.frontweb.WeChatMenuService;
import cn.usually.modules.services.frontweb.WeChatUserService;
import com.yimin.easystore.dto.UserInfo;
import com.yimin.easystore.wechat.constant.WeChatConst;
import com.yimin.easystore.wechat.pojo.WeChatMessageType;
import com.yimin.easystore.wechat.pojo.WeChatReceiveXmlEntity;
import com.yimin.easystore.wechat.pojo.WeChatTextMessage;
import com.yimin.easystore.wechat.pojo.WeChatUserInfo;
import com.yimin.easystore.wechat.util.WeChatFormatXmlProcess;
import com.yimin.easystore.wechat.util.WeChatReceiveXmlProcess;
import com.yimin.easystore.wechat.util.WeChatSignatureUtil;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.GET;
import org.nutz.mvc.annotation.POST;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;

@IocBean
@At("/wechat")
public class WeChatController extends WeChatBaseController {

	@Inject
	private WeChatUserService userService;
	
	@Inject
	private WeChatMenuService menuService;
	
    @At("/check")
    @GET
	public void checkWeChatSignature(HttpServletRequest request, HttpServletResponse response){
		// 微信加密签名
        String signature = request.getParameter("signature");
        // 时间戳
        String timestamp = request.getParameter("timestamp");
        // 随机数
        String nonce = request.getParameter("nonce");
        // 随机字符串
        String echostr = request.getParameter("echostr");

        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 通过检验signature对请求进行校验，若校验成功则原样返回echostr，表示接入成功，否则接入失败
        if (WeChatSignatureUtil.checkSubscribeSignature(signature, timestamp, nonce, WeChatConst.WECHAT_TOKEN)) {
            out.print(echostr);
        }
        out.close();
        out = null;
	}
	
	/**
	 * 解析处理xml、获取智能回复结果（通过图灵机器人api接口）
	 * @return	最终的解析结果（xml格式数据）
	 * @throws IOException 
	 */
    @At("/check")
    @POST
    public void processWeChatMessage(HttpServletRequest request, HttpServletResponse response) throws IOException{
    	
    	// 将请求、响应的编码均设置为UTF-8（防止中文乱码）
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        
        /** 解析xml数据 */
		WeChatReceiveXmlEntity xmlEntity = (new WeChatReceiveXmlProcess()).getMsgEntity(request);
		
		String openid = xmlEntity.getFromUserName();
		
		//事件推送
		if(WeChatMessageType.REQ_MESSAGE_TYPE_EVENT.equals(xmlEntity.getMsgType())){
			//关注事件
            if(WeChatMessageType.EVENT_TYPE_SUBSCRIBE.equals(xmlEntity.getEvent())) {
            	
            	UserInfo userinfo = userService.selectByOpenId(openid);
            	if(null == userinfo){
                	WeChatUserInfo wechatUserInfo = getUserInfoFromWeixin(openid);
            		userService.insert(wechatUserInfo);
            	}else{
            		userinfo.setIssubscribe(1);
            		userService.updateByUserInfo(userinfo);
            	}
           
            	WeChatTextMessage text = new WeChatTextMessage();
                text.setToUserName(openid);
                text.setFromUserName(xmlEntity.getToUserName());
                text.setMsgType(WeChatMessageType.RESP_MESSAGE_TYPE_TEXT);
                text.setCreateTime(new Date().getTime());
                text.setFuncFlag(0);
                text.setContent("欢迎关注易民新便利，易民新便利-专注于企业智能自助便利店的新零售业务领域，旨在为企业文化和团队建设舔砖加瓦，为员工提供更加便捷的生活服务。"
                		+ "我们的目标：让工作更快乐，让生活更开心！");
                String result = WeChatFormatXmlProcess.textMessageToXml(text);
                // 响应消息
                PrintWriter out = response.getWriter();
                out.print(result);
                out.close();
            }
            //取消关注
            else if (WeChatMessageType.EVENT_TYPE_UNSUBSCRIBE.equals(xmlEntity.getEvent())) {
            	//删除掉数据库中的账户数据
            	userService.deleteByOpenId(openid);
            }
            //菜单click
            else if (WeChatMessageType.EVENT_TYPE_CLICK.equals(xmlEntity.getEvent())) {
				String	contentString = menuService.onMenuClick(xmlEntity.getEventKey(), xmlEntity.getFromUserName(), xmlEntity.getToUserName());
				// 响应消息
                PrintWriter out = response.getWriter();
                out.print(contentString);
                out.close();
			}
            //菜单view
            else if(WeChatMessageType.EVENT_TYPE_VIEW.equals(xmlEntity.getEvent())){
            	
            }
		}else {//输入消息回复
			
			WeChatTextMessage text = new WeChatTextMessage();
            text.setToUserName(openid);
            text.setFromUserName(xmlEntity.getToUserName());
            text.setMsgType(WeChatMessageType.RESP_MESSAGE_TYPE_TEXT);
            text.setCreateTime(new Date().getTime());
            text.setFuncFlag(0);
            text.setContent("客服MM会尽快给您回复,请耐心等待！");
            String result = WeChatFormatXmlProcess.textMessageToXml(text);
            // 响应消息
            PrintWriter out = response.getWriter();
            out.print(result);
            out.close();
		}
    }
}
