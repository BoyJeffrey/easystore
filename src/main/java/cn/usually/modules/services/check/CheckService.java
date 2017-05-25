package cn.usually.modules.services.check;

import cn.usually.modules.models.frontapi.param.FrontApiParam;
import org.nutz.ioc.loader.annotation.IocBean;

import cn.usually.common.util.MoneyUtil;
import cn.usually.common.util.Strings;
import cn.usually.modules.models.app.pay.param.PayParam;
import cn.usually.modules.models.check.CheckInfo;


/**
 * Created on 2016/12/2.
 */
@IocBean
public class CheckService {
	
    /**
     * 校验支付参数
     * @param payParam
     * @param checkInfo
     */
	public void checkPayparam(PayParam payParam, CheckInfo checkInfo) {
		checkInfo.setFlag(false); // 默认校验不通过
		if(payParam != null) {
			if(Strings.isNullOrEmpty(payParam.getOut_trade_no())) {
				checkInfo.setMsg("商户订单号缺失");
				return;
			}
			if(Strings.isNullOrEmpty(payParam.getMerchant_name())) {
				checkInfo.setMsg("商户名称缺失");
				return;
			}
			if(payParam.getPaytype() == null || (payParam.getPaytype() != null && payParam.getPaytype() != 1 && payParam.getPaytype() != 2 && payParam.getPaytype() != 3)) {
				checkInfo.setMsg("支付类型有误");
				return;
			}
			if(! MoneyUtil.isMoneyMorethanZero(payParam.getAmount())) {
				checkInfo.setMsg("金额有误");
				return;
			}
			if(Strings.isNullOrEmpty(payParam.getFront_url())) {
				checkInfo.setMsg("前端返回url缺失");
				return;
			}
			if(Strings.isNullOrEmpty(payParam.getNotify_url())) {
				checkInfo.setMsg("后端回调url缺失");
				return;
			}
			if(payParam.getSource_entrance() == null || (payParam.getSource_entrance() != null && payParam.getSource_entrance() <= 0)) {
				checkInfo.setMsg("订单来源有误");
				return;
			}
			checkInfo.setFlag(true);
		}
	}

	/**
	 * 校验展示某公司货架商品参数
	 * @param param
	 * @param checkInfo
	 */
    public void checkShowProductsParam(FrontApiParam param, CheckInfo checkInfo) {
		checkInfo.setFlag(false); // 默认校验不通过
		if(param != null) {
			if(param.getCompany_id() == 0) {
				checkInfo.setMsg("公司ID缺失");
				return;
			}
			checkInfo.setFlag(true);
		}
    }
}
