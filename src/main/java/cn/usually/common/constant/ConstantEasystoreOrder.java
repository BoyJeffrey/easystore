package cn.usually.common.constant;

/**
 * 便利店订单常量
 * Created by MichaelZhou on 5/18/17.
 */
public class ConstantEasystoreOrder {

    /**
     * 支付类型: 3 微信
     */
    public static int PAYTYPE_WECHAT = 3; //

    /**
     * 采购单供货状态:处理中
     */
    public static final int PURCHASEORDER_GOODSSTATUS_DEALING = 0;

    /**
     * 采购单供货状态:采购员确认货到
     */
    public static final int PURCHASEORDER_GOODSSTATUS_CONFIRM = 1;

    /**
     * 采购单支付状态:0 未支付
     */
    public static final int PURCHASEORDER_PAYSTATUS_UNPAY = 0;

    /**
     * 采购单支付状态:1 处理中
     */
    public static final int PURCHASEORDER_PAYSTATUS_DEALING = 1;

    /**
     * 采购单支付状态:2 支付成功
     */
    public static final int PURCHASEORDER_PAYSTATUS_PAYSUCCESS = 2;

    /**
     * 采购单支付方式:0 未知
     */
    public static final int PURCHASEORDER_PAYWAY_UNKNOWN = 0;

    /**
     * 采购单支付方式:1 现金
     */
    public static final int PURCHASEORDER_PAYWAY_CASH = 1;

    /**
     * 采购单支付方式:2 微信
     */
    public static final int PURCHASEORDER_PAYWAY_WECHAR = 2;
}
