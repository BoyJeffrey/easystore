package cn.usually.modules.services.frontweb;

import cn.usually.common.base.Service;
import com.yimin.easystore.wechat.constant.WeChatConst;
import com.yimin.easystore.wechat.pojo.*;
import com.yimin.easystore.wechat.util.WeChatFormatXmlProcess;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;

import java.util.Date;

@IocBean(args = {"refer:dao"})
public class WeChatMenuService extends Service {

	public WeChatMenuService(Dao dao) {
		super(dao);
	}

	//create menu object
	public WeChatMenu	createWeChatMenu(){

		WeChatMenu	weChatMenu = new WeChatMenu();

		//进入店铺
		WeChatViewButton easystoreButton = new WeChatViewButton();
		easystoreButton.setName("进入店铺");
		easystoreButton.setType("view");
		easystoreButton.setUrl(WeChatConst.SERVER_DOMAIN_ROOT + "/frontweb/employee/scan_guide");

		//工作平台
		WeChatViewButton managerButton = new WeChatViewButton();
		managerButton.setName("工作平台");
		managerButton.setType("view");
		managerButton.setUrl(WeChatConst.SERVER_DOMAIN_ROOT + "/frontweb/apply.html");

		//关于我们
		WeChatViewButton aboutUsButton = new WeChatViewButton();
		aboutUsButton.setName("关于我们");
		aboutUsButton.setType("view");
		aboutUsButton.setUrl(WeChatConst.SERVER_DOMAIN_ROOT + "/frontweb/aboutus.html");

		//组装到菜单中
		WeChatBaseButton[] menuGroup = new WeChatBaseButton[]{easystoreButton, managerButton, aboutUsButton};
		weChatMenu.setButton(menuGroup);

		return	weChatMenu;
		
	}
	
	
	//菜单点击事件：（1.联系客服 ）
	public String	onMenuClick(String menuKey, String toUserOpenId, String fromUserOpenId){
		String	result	= "";
		if(WeChatMessageType.MENU_CLICK_KEY_CONTACT.equals(menuKey)){//联系客服
			WeChatTextMessage text = new WeChatTextMessage();
            text.setToUserName(toUserOpenId);
            text.setFromUserName(fromUserOpenId);
            text.setMsgType(WeChatMessageType.RESP_MESSAGE_TYPE_TEXT);
            text.setCreateTime(new Date().getTime());
            text.setFuncFlag(0);
			text.setContent("1.请直接拨打客服热线0571-56532888! \n" +
							"2.请留言，客服MM会第一时间联系您。");
            result = WeChatFormatXmlProcess.textMessageToXml(text);	
		}
		return result;
	}
}
