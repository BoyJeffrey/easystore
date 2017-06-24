package cn.usually.modules.services.pay;

import cn.usually.common.base.Service;
import cn.usually.common.constant.ConstantEasystoreOrder;
import cn.usually.common.util.DateUtil;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.Easy_company_product;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_order;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_orderdetail;
import org.nutz.dao.Chain;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;

import java.sql.Connection;
import java.util.List;

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
        Trans.exec(Connection.TRANSACTION_REPEATABLE_READ, new Atom() {
            @Override
            public void run() {
                // 根据员工订单号,减少公司货架相应商品的库存信息
                reduceCompanyProductByEmlpoyeeOrder(empolyee_order);
                dao().update(empolyee_order);
            }
        });
    }

    /**
     * 根据员工订单号,减少公司货架相应商品的库存信息
     * @param empolyee_order
     */
    private void reduceCompanyProductByEmlpoyeeOrder(Easy_empolyee_order empolyee_order) {
        // 获取员工购买产品详情
        List<Easy_empolyee_orderdetail> empolyee_orderdetail_list = dao().query(Easy_empolyee_orderdetail.class, Cnd.where("buy_order_id", "=", empolyee_order.getBuy_order_id()));
        // 获取公司货架库存信息
        List<Easy_company_product> company_product_list = dao().query(Easy_company_product.class,Cnd.where("company_id", "=", empolyee_order.getCompany_id()));
        // 从公司库存中取出已购买产品数量
        for(Easy_empolyee_orderdetail empolyee_orderdetail : empolyee_orderdetail_list) {
            // 购买产品与货架库存中产品进行匹配
            boolean flag_companyproduct_exist = false;
            for(Easy_company_product company_product : company_product_list) {
                if(company_product.getProduct_id() == empolyee_orderdetail.getProduct_id()) { // 匹配成功
                    flag_companyproduct_exist = true;
                    long order_product_num = empolyee_orderdetail.getProduct_num(); // 员工购买产品数量
                    long company_product_num = company_product.getNum(); // 货架上产品库存
                    if(order_product_num > company_product_num) { // 购买数量较多,此时为异常状态,存在用户下单时公司货架产品存在,但买单时产品已被其他用户买走情况,该情况目前先将该产品从公司货架上下架,并记录相关日志信息
                        log.info("针对员工购买产品后微信回调处理时,检查到所购产品数量大于公司货架上该产品数量,预计先将该产品从公司货架上下架,并记录该条日志.相关信息说明:订单号:【" + empolyee_order.getBuy_order_id() + "】;" +
                                    "所购产品Id:【" + empolyee_orderdetail.getProduct_id() + "】;所购产品数量:【" + order_product_num + "】;公司货架上产品数量:【" + company_product_num + "】");
                        // 删除公司货架上该产品
                        dao().clear(Easy_company_product.class, Cnd.where("company_id","=", empolyee_order.getCompany_id()).and("product_id","=",empolyee_orderdetail.getProduct_id()));
                    } else if(order_product_num == company_product_num) { // 刚好买光该产品,则将该产品从公司货架上下架
                        // 删除公司货架上该产品
                        dao().clear(Easy_company_product.class, Cnd.where("company_id","=", empolyee_order.getCompany_id()).and("product_id","=",empolyee_orderdetail.getProduct_id()));
                        log.info("员工购买产品后微信回调处理公司货架上相关产品信息说明:订单号:【" + empolyee_order.getBuy_order_id() + "】;所购产品Id:【" + empolyee_orderdetail.getProduct_id() + "】;所购产品数量:【" + order_product_num + "】;处理前公司货架上该产品数量:【" + company_product_num + "】处理后公司货架上该产品数量:【" + (company_product_num - order_product_num) + "】");
                    } else {
                        // 减少公司货架上该产品库存量
                        dao().update(Easy_company_product.class, Chain.makeSpecial("num", "-" + order_product_num), Cnd.where("company_id", "=", empolyee_order.getCompany_id()).and("product_id", "=", empolyee_orderdetail.getProduct_id()));
                        log.info("员工购买产品后微信回调处理公司货架上相关产品信息说明:订单号:【" + empolyee_order.getBuy_order_id() + "】;所购产品Id:【" + empolyee_orderdetail.getProduct_id() + "】;所购产品数量:【" + order_product_num + "】;处理前公司货架上该产品数量:【" + company_product_num + "】处理后公司货架上该产品数量:【" + (company_product_num - order_product_num) + "】");
                    }
                    break;
                }
            }
            if(! flag_companyproduct_exist)
                log.info("针对员工购买产品后微信回调处理时,检查到所购产品在公司货架上不存在,相关信息说明:订单号:【" + empolyee_order.getBuy_order_id() + "】;所购产品Id:【" + empolyee_orderdetail.getProduct_id() + "】");
        }
    }
}
