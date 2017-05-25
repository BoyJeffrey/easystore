package cn.usually.modules.services.pay;

import cn.usually.common.base.Service;
import cn.usually.common.constant.ConstantEasystoreOrder;
import cn.usually.common.util.DateUtil;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_order;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;

/**
 * Created on 2017-05-23.
 */
@SuppressWarnings("rawtypes")
@IocBean(args = {"refer:dao"})
public class EasystorePayService extends Service {
	
	private static final Log log = Logs.get();

	public EasystorePayService(Dao dao) {
		super(dao);
	}


    /**
     * 校验用户订单
     * @param buy_order_id
     * @param checkInfo
     */
    public Easy_empolyee_order validateEmployeeOrderUnpay(String buy_order_id, CheckInfo checkInfo) {
        // 获取用户订单
        Easy_empolyee_order empolyee_order = dao().fetch(Easy_empolyee_order.class, buy_order_id);
        if(empolyee_order != null) {
            // 校验是否为未支付状态
            if(ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_UNPAY == empolyee_order.getPay_status()) {
                checkInfo.setFlag(true);
                return empolyee_order;
            }

        }
        return null;
    }

    /**
     * 更新用户订单
     * @param out_trade_no
     * @param openid
     * @param transaction_id
     */
    public void updateEmlpoyeeOrderSuccess(String out_trade_no, String openid, String transaction_id, String pay_time) {
        // 获取用户订单
        Easy_empolyee_order empolyee_order = dao().fetch(Easy_empolyee_order.class, out_trade_no);
        empolyee_order.setOpenid(openid);
        empolyee_order.setThirdpay_order_id(transaction_id);
        empolyee_order.setPay_status(ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_PAYSUCCESS);
        empolyee_order.setPay_way(ConstantEasystoreOrder.PURCHASEORDER_PAYWAY_WECHAR);
        empolyee_order.setPay_time(DateUtil.dateToStrLong(DateUtil.strToDateLong(pay_time)));
        dao().update(empolyee_order);
    }
}
