package cn.usually.modules.services.pay;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

import cn.usually.common.base.Service;
import cn.usually.common.pay.alipay.config.AlipayConfig;
import cn.usually.common.pay.alipay.util.AlipaySubmit;
import cn.usually.common.util.Strings;
import cn.usually.modules.models.app.pay.param.PayParam;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.alipay.Alipay_config;

/**
 * Created on 2016/12/2.
 */
@SuppressWarnings("rawtypes")
@IocBean(args = {"refer:dao"})
public class AlipayService extends Service {
	
	private static final Log log = Logs.get();
	
	@Inject
	private CommonPayService commonPayService;
	
	public AlipayService(Dao dao) {
		super(dao);
	}

    /**
     * 使用支付宝进行支付
     * @param payParam
     * @param res 
     * @param checkInfo 
     */
	public void pay(PayParam payParam, HttpServletResponse res, CheckInfo checkInfo) {
		// 查询支付宝配置信息
		Alipay_config alipayConfig = dao().fetch(Alipay_config.class);
        if(alipayConfig != null) {
        	if(Strings.isNullOrEmpty(alipayConfig.getPartner()) || Strings.isNullOrEmpty(alipayConfig.getSeller_id())
        			|| Strings.isNullOrEmpty(alipayConfig.getNotify_url())) {
        		checkInfo.setFlag(false);
        		checkInfo.setMsg("支付宝账户配置有误");
        		return;
        	}else {
        		AlipayConfig.setPartner(alipayConfig.getPartner());
        		AlipayConfig.setPrivate_key(alipayConfig.getPrivate_key());
        		AlipayConfig.setAli_public_key(alipayConfig.getAli_public_key());
        	}
        }else {
        	checkInfo.setFlag(false);
        	checkInfo.setMsg("支付宝账户配置有误");
        	return;
        }
		// 把请求参数打包成数组
		Map<String, String> sParaTemp = new HashMap<String, String>();
		sParaTemp.put("service", AlipayConfig.service);
		sParaTemp.put("partner", alipayConfig.getPartner());
		sParaTemp.put("seller_id", alipayConfig.getSeller_id());
		sParaTemp.put("_input_charset", AlipayConfig.input_charset);
		sParaTemp.put("payment_type", AlipayConfig.payment_type);
		sParaTemp.put("notify_url", alipayConfig.getNotify_url());
		sParaTemp.put("return_url", payParam.getFront_url());
		sParaTemp.put("out_trade_no", payParam.getOut_trade_no());
		sParaTemp.put("subject", payParam.getSubject_name());
		sParaTemp.put("total_fee", String.valueOf(payParam.getAmount()));
		sParaTemp.put("show_url", "");
		sParaTemp.put("body", "body");
		// 建立请求
		String sHtmlText = AlipaySubmit.buildRequest(sParaTemp, "get", "确认");
		try {
			res.setHeader("Pragma", "No-cache");
			res.setHeader("Cache-Control", "no-cache");
			res.setContentType("text/html; charset=utf-8");
			res.getWriter().write(sHtmlText);
			// 保存该笔订单至本地数据库
			commonPayService.addPayOrder(payParam, checkInfo);
			res.getWriter().close();
		} catch (IOException e) {
			e.printStackTrace();
			checkInfo.setFlag(false);
        	checkInfo.setMsg("与支付宝服务交互有误");
        	return;
		}
	}
}
