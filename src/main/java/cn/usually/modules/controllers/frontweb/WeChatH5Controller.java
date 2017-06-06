package cn.usually.modules.controllers.frontweb;

import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.mvc.annotation.At;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@IocBean
@At("/h5")
public class WeChatH5Controller extends WeChatBaseController {
	
	//便利店
    @At("/easystore.do")
	public ModelAndView	easyStore(HttpServletRequest reqeust, HttpServletResponse response){
		
		//return getAuthRequestURL("/h5/myinvest.do", "1", false);
		ModelAndView resultView	= new ModelAndView();
		
		resultView.setViewName("");
		
		return resultView;
	}
	
	//后台管理
    @At("/manager.do")
	public ModelAndView verifyLogin(HttpServletRequest request, HttpServletResponse response){
		
		ModelAndView resultView	= new ModelAndView();
		resultView.setViewName("");
		
		return resultView;
		
	}
	
	/*@ResponseBody
	@RequestMapping(value = "/weixinpay.do")
	public String weixinPay(HttpServletRequest req, HttpServletResponse resp){
		
		String 	openId 		= "";
		String	notifyUrl 	= "";
		int		totalFee	= 1;
		String  outTradeNo	= "";
		
		WeChatPayOrderParam param = new WeChatPayOrderParam();
        // 基本信息
        param.setAppid(WeChatConst.WECHAT_APPID);
        param.setMchId(WeChatConst.WECHAT_MERCHATID);
        
        param.setTradeType("JSAPI"); // 公众号支付
        param.setOpenid(openId); // openId!!
        param.setSpbillCreateIp(getRemoteIP(req));
        //param.setLimitPay("no_credit"); // 禁止用信用卡

        param.setNotifyUrl(notifyUrl); // 支付成功回调url

        // 业务相关参数
        //JSONObject atach = new JSONObject();
        //atach.put("order_id", 11);
        //param.setAttach(atach.toString());
        param.setBody("支付测试订单");
        param.setTotalFee(totalFee);
        param.setOutTradeNo(outTradeNo); // 客户订单号

        //签名
        param.setNonceStr(EncryptUtil.random());
        Map<String, Object> data = BeanUtil.object2Map(param); // 参数列表
        param.setSign(SignUtil.sign(data, WeChatConst.WECHAT_JSKEY)); // 计算sign
        data.put(PayOrderField.SIGN.getField(), param.getSign()); // sign放到map中，为后续转xml

        // 校验参数是否齐全
        try {
            ValidateUtil.validate(PayOrderField.values(), data);
        } catch (Exception e) {
            return JsonUtil.getJson(1, e.getMessage()).toString();
        }

        // 转成xml格式
        String xml = XmlUtil.toXml(data);
        // 发送支付请求
        String resultStr = WeChatUtil.postXml(WeChatConst.WECHAT_PAY_URL, xml);

        // 校验返回结果 签名
        Map<String, Object> resultMap = XmlUtil.parseXml(resultStr);
        String resultSign = SignUtil.sign(resultMap, WeChatConst.WECHAT_JSKEY);
        if (resultMap.get("sign") == null || !resultMap.get("sign").equals(resultSign)) {
            throw new RuntimeException("签名校验不通过");
        }

        PayOrderResult result = BeanUtil.map2Object(PayOrderResult.class, resultMap);

        PayResult payResult = new PayResult();
        if (ResultCode.SUCCESS.getCode().equals(result.getReturnCode())
                && ResultCode.SUCCESS.getCode().equals(result.getResultCode())) {
            payResult.setResultCode(ResultCode.SUCCESS.getCode());
        } else {
            payResult.setResultCode(ResultCode.FAIL.getCode());
        }
        payResult.setMessage(result.getReturnMsg());
        payResult.setErrCode(result.getErrCode());
        payResult.setErrorMessage(result.getErrCodeDes());
        payResult.setPrepayId(result.getPrepayId());
        payResult.setCodeUrl(result.getCodeUrl());

        JSONObject ret = JsonUtil.getOkJson();
        ret.put("reslt", payResult);
        ret.put("param", genJsParam(payResult));
        return ret.toString();
	}
	
	private JSONObject genJsParam(PayResult payResult) {
        long timestamp = System.currentTimeMillis() / 1000;
        String nonceStr = EncryptUtil.random();

        Map<String, Object> data = new HashMap<String, Object>();
        data.put("appId", WeChatConst.WECHAT_APPID);
        data.put("timeStamp", timestamp);
        data.put("nonceStr", nonceStr);
        data.put("package", "prepay_id=" + payResult.getPrepayId());
        data.put("signType", "MD5");

        data.put("paySign", SignUtil.sign(data, WeChatConst.WECHAT_JSKEY)); // 计算sign

        JSONObject ret = JSONObject.parseObject(JSON.toJSONString(data));
        return ret;
    }*/
}
