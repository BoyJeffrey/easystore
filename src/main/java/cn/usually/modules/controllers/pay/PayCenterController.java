package cn.usually.modules.controllers.pay;

import cn.usually.common.util.CheckUtil;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_order;
import cn.usually.modules.services.check.CheckService;
import cn.usually.modules.services.pay.EasystorePayService;
import cn.usually.modules.services.pay.WxService;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.annotation.Param;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created on 2017/5/23.
 */
@IocBean
@At("/post/paycenter")
public class PayCenterController {
    private static final Log log = Logs.get();
    @Inject
    private WxService wxService;
    @Inject
    private EasystorePayService easystorePayService;
    @Inject
    private CheckService checkService;

    /**
     * 第三方支付接口
     */
    @At
//    @AdaptBy(type = JsonAdaptor.class)
    public void pay(@Param("buy_order_id") String buy_order_id, HttpServletResponse res) {
        try {
            CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象
            // 检查该笔订单是否存在,且是否已经支付成功
            CheckUtil.emptyCheckInfo(checkInfo);
            Easy_empolyee_order empolyee_order = easystorePayService.validateEmployeeOrderUnpay(buy_order_id, checkInfo);
            if(! checkInfo.getFlag()) //
            	return;
            CheckUtil.emptyCheckInfo(checkInfo);
            // 微信支付
            wxService.redirectUrlWx(empolyee_order, res, checkInfo);
        } catch (Exception e) {
        	e.printStackTrace();
        	log.debug("支付服务中心请求第三方支付异常！");
        }
    }
    
    /**
     * 微信跳转url
     */
    @At
    @Ok("jsp:views.frontapp.wechat.jspage")
    public void redirect_wechat(@Param("buy_order_id") String buy_order_id, HttpServletRequest req, HttpServletResponse res) {
//		log.debug("微信redirect_url中参数转换为map信息:" + Json.toJson(map));
		CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象
//		PayParam payParamEncode = Json.fromJson(PayParam.class, Json.toJson(map)); // 转换对象
		wxService.dealRedirect(buy_order_id, req, res, checkInfo);
    }
}
