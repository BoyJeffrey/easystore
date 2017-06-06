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
		
		//便利店
		WeChatViewButton easystoreButton = new WeChatViewButton();
		easystoreButton.setName("便利店");
		easystoreButton.setType("view");
		easystoreButton.setUrl(WeChatConst.SERVER_DOMAIN_ROOT + "/frontweb/employee/scan_guide");
		
    	//后台管理
		WeChatViewButton managerButton = new WeChatViewButton();
		managerButton.setName("后台管理");
		managerButton.setType("view");
//		managerButton.setUrl(WeChatConst.SERVER_DOMAIN_ROOT + "/h5/manager.do");
		managerButton.setUrl(WeChatConst.SERVER_DOMAIN_ROOT + "/frontweb/welcome.html");

    	//更多
    	WeChatComplexButton moreButton = new WeChatComplexButton();
    	moreButton.setName("了解易民");
    	
    		//申请开店
    		WeChatViewButton applyButton = new WeChatViewButton();
    		applyButton.setName("申请开店");
    		applyButton.setType("view");
    		applyButton.setUrl(WeChatConst.SERVER_DOMAIN_ROOT + "/frontweb/apply.html");
    		//联系客服
    		WeChatCommonButton contactButton =	new	WeChatCommonButton();
    		contactButton.setName("联系客服");
    		contactButton.setType("click");
    		contactButton.setKey(WeChatMessageType.MENU_CLICK_KEY_CONTACT);
    		//关于我们
    		WeChatViewButton aboutusButton =	new	WeChatViewButton();
    		aboutusButton.setName("关于我们");
    		aboutusButton.setType("view");
    		aboutusButton.setUrl(WeChatConst.SERVER_DOMAIN_ROOT + "/frontweb/aboutus.html");
    	WeChatBaseButton[] moreButtonGroup = new WeChatBaseButton[]{applyButton, contactButton,aboutusButton};
    	moreButton.setSub_button(moreButtonGroup);  
    	
    	//组装到菜单中
    	WeChatBaseButton[] menuGroup = new WeChatBaseButton[]{easystoreButton, managerButton, moreButton};
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
            text.setContent("1.请直接拨打客服热线13858068101! \n" +
                         	"2.请留言，客服MM会第一时间联系您。");
            result = WeChatFormatXmlProcess.textMessageToXml(text);	
		}
		return result;
	}
}
