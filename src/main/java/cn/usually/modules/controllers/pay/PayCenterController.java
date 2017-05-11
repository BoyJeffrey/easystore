package cn.usually.modules.controllers.pay;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.lang.util.NutMap;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.annotation.Param;

import cn.usually.common.constant.ConstantPay;
import cn.usually.common.util.CheckUtil;
import cn.usually.modules.models.app.pay.param.PayParam;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.services.check.CheckService;
import cn.usually.modules.services.pay.AlipayService;
import cn.usually.modules.services.pay.CommonPayService;
import cn.usually.modules.services.pay.UnionService;
import cn.usually.modules.services.pay.WxService;

/**
 * Created on 2016/8/11.
 */
@IocBean
@At("/post/paycenter")
public class PayCenterController {
    private static final Log log = Logs.get();
    @Inject
    private AlipayService alipayService;
    @Inject
    private WxService wxService;
    @Inject
    private UnionService unionService;
    @Inject
    private CommonPayService commonPayService;
    @Inject
    private CheckService checkService;

    /**
     * 第三方支付接口
     */
    @At
    public void pay(@Param("..") NutMap map, HttpServletResponse res) {
        try {
            log.debug("map参数打印:" + Json.toJson(map));
            CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象
            PayParam payParamEncode = Json.fromJson(PayParam.class, Json.toJson(map)); // 转换对象
            PayParam payParam = (PayParam) commonPayService.decodeParamObject(payParamEncode); // 解码对象
            log.info(payParam.getMerchant_name());
            // 校验参数
            checkService.checkPayparam(payParam, checkInfo);
            if(! checkInfo.getFlag())
            	return;
            // 检查该笔订单是不是已经支付成功
            CheckUtil.emptyCheckInfo(checkInfo);
            commonPayService.validateIsOrderSuccess(payParam, checkInfo);
            if(checkInfo.getFlag()) // 支付成功
            	return;
            CheckUtil.emptyCheckInfo(checkInfo);
            // 根据支付类型进行支付操作
            if(ConstantPay.PAYTYPE_ALIPAY == payParam.getPaytype()) { // 支付宝
            	alipayService.pay(payParam, res, checkInfo);
            }else if(ConstantPay.PAYTYPE_WECHAT == payParam.getPaytype()) { // 微信
            	wxService.redirectUrlWx(payParam, res, checkInfo);
            }else if(ConstantPay.PAYTYPE_UNION == payParam.getPaytype()) { // 银联
            	unionService.pay(payParam, res, checkInfo);
            }
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
    public void redirect_wechat(@Param("..") NutMap map, HttpServletRequest req, HttpServletResponse res) {
		log.debug("微信redirect_url中参数转换为map信息:" + Json.toJson(map));
		CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象
		PayParam payParamEncode = Json.fromJson(PayParam.class, Json.toJson(map)); // 转换对象
        PayParam payParam = (PayParam) commonPayService.decodeParamObject(payParamEncode); // 解码对象
		wxService.dealRedirect(payParam, req, res, checkInfo);
    }
}
