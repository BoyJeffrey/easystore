package cn.usually.modules.services.frontweb;

import cn.usually.common.base.Service;
import com.yimin.easystore.dto.UserInfo;
import com.yimin.easystore.wechat.pojo.WeChatUserInfo;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;

@IocBean(args = {"refer:dao"})
public class WeChatUserService extends Service {

	public WeChatUserService(Dao dao) {
		super(dao);
	}

	public int insert(WeChatUserInfo  wechatUserInfo) {
		UserInfo userinfo = new UserInfo();
		userinfo.setOpenid(wechatUserInfo.getOpenid());
    	userinfo.setCountry(wechatUserInfo.getCountry());
    	userinfo.setCity(wechatUserInfo.getCity());
    	userinfo.setIssubscribe(1);
    	userinfo.setLanguage(wechatUserInfo.getLanguage());
    	userinfo.setMobilephone(null);
    	userinfo.setProvince(wechatUserInfo.getProvince());
    	userinfo.setRealname(wechatUserInfo.getNickname());
    	userinfo.setSex(wechatUserInfo.getSex()+"");
    	
    	//写入数据库
		return 1;
	}

	public UserInfo selectByOpenId(String openid) {
		// TODO Auto-generated method stub
		//根据openid,查询数据库中数据
		return new UserInfo();
	}

	public int deleteByOpenId(String openid) {
		// TODO Auto-generated method stub
		//根据openid,查询数据库中数据
		return 1;
	}

	public int updateByUserInfo(UserInfo userinfo) {
		// TODO Auto-generated method stub
		//根据openid,更新数据库中数据
		return 1;
	}
}
