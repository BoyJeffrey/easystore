package cn.usually.modules.services.platform.easystore;

import cn.usually.common.base.Service;
import cn.usually.common.constant.ConstantEasystoreOrder;
import cn.usually.common.util.DateUtil;
import cn.usually.common.util.Strings;
import cn.usually.common.util.UuidUtil;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.platform.easystore.*;
import org.nutz.dao.Chain;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.trans.Atom;
import org.nutz.trans.Trans;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@IocBean(args = {"refer:dao"})
public class EasyCompanyPurchaseorderService extends Service<Easy_company_purchaseorder> {
	private static final Log log = Logs.get();

    public EasyCompanyPurchaseorderService(Dao dao) {
    	super(dao);
    }

    /**
     * 根据公司ID和所采购产品信息采购产品订单
     * @param company_id
     * @param purchaseorderdetailList
     * @param checkInfo
     */
    public void purchaseCompanyProduct(long company_id, List<Easy_company_purchaseorderdetail> purchaseorderdetailList, CheckInfo checkInfo) {
        if(company_id > 0 && Strings.listNotEmpty(purchaseorderdetailList)) {
            Easy_company easy_company = dao().fetch(Easy_company.class, company_id);
            if(easy_company != null) {
                // 根据采购的产品和数量生成采购订单和详细订单
                Easy_company_purchaseorder purchaseorder = generateInsertPurchaseorder(easy_company,purchaseorderdetailList, checkInfo);
                if(checkInfo.getFlag()) {
                    // 将信息插入数据库中
                    insertPurchaseorder(purchaseorder);
                }
            }
        }
    }

    /**
     * 根据采购的产品和数量生成采购订单和详细订单
     *
     * @param easy_company
     * @param purchaseorderdetailList
     * @param checkInfo
     * @return
     */
    private Easy_company_purchaseorder generateInsertPurchaseorder(Easy_company easy_company, List<Easy_company_purchaseorderdetail> purchaseorderdetailList, CheckInfo checkInfo) {
        // 整理待保存订单数据
        Easy_company_purchaseorder purchaseorder = new Easy_company_purchaseorder();
        // 获取公司account_id
        String account_id = easy_company.getAccount_id();
        // 生成订单主键
        String order_id = UuidUtil.getCompanyPurchaseOrderIdByUUId(account_id);
        // 计算订单总金额
        double total_price = 0.00;
        purchaseorder.setCompany_id(easy_company.getId());
        purchaseorder.setOrder_id(order_id);
        purchaseorder.setCreate_time(DateUtil.getDateTime());
        purchaseorder.setGoods_status(ConstantEasystoreOrder.PURCHASEORDER_GOODSSTATUS_DEALING);
        purchaseorder.setPay_status(ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_UNPAY);
        purchaseorder.setPay_way(ConstantEasystoreOrder.PURCHASEORDER_PAYWAY_UNKNOWN);
        purchaseorder.setThirdpay_order_id("");
        for(Easy_company_purchaseorderdetail purchaseorderdetail : purchaseorderdetailList) {
            long product_num = purchaseorderdetail.getProduct_num();
            purchaseorderdetail.setOrder_id(order_id); //
            Easy_product product = dao().fetch(Easy_product.class, purchaseorderdetail.getProduct_id());
            if(product != null && product_num > 0 && product.getPrice_company() >= 0) { // 校验产品是否存在,且采购量大于0
                double price_company = product.getPrice_company();
                purchaseorderdetail.setProduct_name(product.getProduct_name()); //
                purchaseorderdetail.setPrice_company(price_company); //
                total_price += price_company * product_num;
            }else {
                checkInfo.setFlag(false);
                checkInfo.setMsg("产品校验有误,请联系管理员检查产品价格是否正确");
                return null;
            }
        }
        purchaseorder.setTotal_price(total_price);
        purchaseorder.setPurchaseorderdetailList(purchaseorderdetailList);
        return purchaseorder;
    }

    /**
     * 插入采购订单信息:事务
     * @param purchaseorder
     */
    private void insertPurchaseorder(Easy_company_purchaseorder purchaseorder) {
        Trans.exec(Connection.TRANSACTION_REPEATABLE_READ, new Atom() {
            @Override
            public void run() {
                dao().insert(purchaseorder);
                dao().insert(purchaseorder.getPurchaseorderdetailList());
            }
        });
    }

    /**
     * 查询当前采购单中所采购产品ID和数量信息,放入map中
     * @param purchaseorder
     * @return
     */
    public Map<Long,Easy_company_purchaseorderdetail> queryPurchaseorderdetailMapByOrder(Easy_company_purchaseorder purchaseorder) {
        Map<Long, Easy_company_purchaseorderdetail> purchaseorderdetailMap = new HashMap<>();
        List<Easy_company_purchaseorderdetail> purchaseorderdetailList = dao().query(Easy_company_purchaseorderdetail.class, Cnd.where("order_id","=",purchaseorder.getOrder_id()));
        if(purchaseorderdetailList != null) {
            for(Easy_company_purchaseorderdetail purchaseorderdetail : purchaseorderdetailList)
                purchaseorderdetailMap.put(purchaseorderdetail.getProduct_id(),purchaseorderdetail);
        }
        return purchaseorderdetailMap;
    }

    /**
     * 获取采购订单详细信息,并转换为产品类型信息列表
     * @param order_id
     * @return
     */
    public List<Easy_product_category> getPurchaseorderdetailAsProductCategoryList(String order_id) {
        // 转换后的产品类型信息
        List<Easy_product_category> productCategoryList = new ArrayList<>();
        // 获取采购单详情
        List<Easy_company_purchaseorderdetail> purchaseorderdetailList = dao().query(Easy_company_purchaseorderdetail.class, Cnd.where("order_id","=", order_id));
        if(purchaseorderdetailList != null) {
            Easy_product_category product_category = new Easy_product_category();
            for(Easy_company_purchaseorderdetail purchaseorderdetail : purchaseorderdetailList) {
                // 查询产品详情
                Easy_product product = dao().fetchLinks(dao().fetch(Easy_product.class, purchaseorderdetail.getProduct_id()), "productCategory");
                product.setProduct_num((int)purchaseorderdetail.getProduct_num()); // 临时放入
                // 整理至产品分类列表中
                tidyToProductCategoryList(product, productCategoryList);
            }
        }
        return  productCategoryList;
    }

    /**
     * 采购单详细整理至产品分类列表中
     * @param product
     * @param productCategoryList
     */
    private void tidyToProductCategoryList(Easy_product product, List<Easy_product_category> productCategoryList) {
        long category_id = product.getCategory_id();
        boolean flag_category_add = true; // 是否为新类别
        for(Easy_product_category product_category : productCategoryList) {
            if(category_id == product_category.getId()) {
                flag_category_add = false;
                // 添加该产品至分类
                product_category.getEasyProductList().add(product);
                break;
            }
        }
        if(flag_category_add) {
            Easy_product_category product_category_add = product.getProductCategory();
            List<Easy_product> productListAdd = new ArrayList<>();
            productListAdd.add(product);
            product_category_add.setEasyProductList(productListAdd);
            productCategoryList.add(product_category_add);
        }

    }

    /**
     * 修改采购单主信息:另外处理确认收货和处理中情况下该公司库存信息
     * 事务
     * @param easyCompanyPurchaseorder
     * @param flag 是否更新公司货架库存
     */
    public void updatePrchaseorderMain(Easy_company_purchaseorder easyCompanyPurchaseorder, boolean flag) {
        Trans.exec(Connection.TRANSACTION_REPEATABLE_READ, new Atom() {
            @Override
            public void run() {
                // 获取订单主信息
                Easy_company_purchaseorder purchaseorder_db = dao().fetch(Easy_company_purchaseorder.class, easyCompanyPurchaseorder.getId());
                if(flag) {
                    boolean flag_add = false; // 是否要增加公司库存
                    boolean flag_reduce = false; // 是否要减少公司库存
                    int goods_status = easyCompanyPurchaseorder.getGoods_status(); // 前台
                    int goods_status_db = purchaseorder_db.getGoods_status();
                    if(goods_status != goods_status_db) {
                        if(ConstantEasystoreOrder.PURCHASEORDER_GOODSSTATUS_DEALING == goods_status)
                            flag_reduce = true;
                        else if(ConstantEasystoreOrder.PURCHASEORDER_GOODSSTATUS_CONFIRM == goods_status)
                            flag_add = true;
                    }
                    if(flag_add || flag_reduce) { // 库存待处理
                        // 获取订单详情
                        List<Easy_company_purchaseorderdetail> purchaseorderdetailList = dao().query(Easy_company_purchaseorderdetail.class, Cnd.where("order_id", "=", purchaseorder_db.getOrder_id()));
                        if(Strings.listNotEmpty(purchaseorderdetailList)) {
                            // 获取公司库存信息
                            List<Easy_company_product> company_product_list = dao().query(Easy_company_product.class,Cnd.where("company_id", "=", purchaseorder_db.getCompany_id()));
                            if(! Strings.listNotEmpty(company_product_list))
                                company_product_list = new ArrayList<>();
                            // 当前订单详细信息更新至公司货架
                            for(Easy_company_purchaseorderdetail purchaseorderdetail : purchaseorderdetailList) {
                                boolean flag_productid_exist = false; // 查找当前公司库存中product_id是否已存在
                                boolean flag_num_same = false; // 存在时,比较当前库存产品数量是否与其采购量一致
                                for (Easy_company_product company_product : company_product_list) {
                                    if(company_product.getProduct_id() == purchaseorderdetail.getProduct_id()) {
                                        flag_productid_exist = true;
                                        if(company_product.getNum() == purchaseorderdetail.getProduct_num())
                                            flag_num_same = true;
                                        break;
                                    }
                                }
                                // 根据采购的产品是否在公司库存及添加或减少库存标志情况做相应操作
                                if(flag_productid_exist) { // update
                                    if(flag_reduce && flag_num_same) // delete 如果库为减标志,且减后为0,则删除该数据
                                        dao().clear(Easy_company_product.class, Cnd.where("company_id","=", purchaseorder_db.getCompany_id()).and("product_id","=",purchaseorderdetail.getProduct_id()));
                                    else {
                                        String add_or_reduce_sql = (flag_add ? "+" : "-") + purchaseorderdetail.getProduct_num();
                                        dao().update(Easy_company_product.class, Chain.makeSpecial("num", add_or_reduce_sql), Cnd.where("company_id", "=", purchaseorder_db.getCompany_id()).and("product_id", "=", purchaseorderdetail.getProduct_id()));
                                    }
                                }else { // insert
                                    Easy_company_product company_product_add = new Easy_company_product();
                                    company_product_add.setCompany_id(purchaseorder_db.getCompany_id());
                                    company_product_add.setProduct_id(purchaseorderdetail.getProduct_id());
                                    company_product_add.setNum(purchaseorderdetail.getProduct_num());
                                    dao().insert(company_product_add);
                                }

                            }
                        }
                    }
                }
                // 更新主菜单信息
                dao().updateIgnoreNull(easyCompanyPurchaseorder);
                // 更新支付时间
                int pay_status_front = easyCompanyPurchaseorder.getPay_status();
                int pay_status_db = purchaseorder_db.getPay_status();
                if(pay_status_front != pay_status_db) {
                    // 比较当前与库中支付状态:如果发生变化,则更新支付时间【变为支付完成,则去当前时间;非支付完成,则赋值空】
                    if(ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_UNPAY == pay_status_front || ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_DEALING == pay_status_front)
                        dao().update(Easy_company_purchaseorder.class, Chain.make("pay_time", null), Cnd.where("id","=", easyCompanyPurchaseorder.getId()));
                    else if(ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_PAYSUCCESS == pay_status_front)
                        dao().update(Easy_company_purchaseorder.class, Chain.make("pay_time", DateUtil.getDateTime()), Cnd.where("id","=", easyCompanyPurchaseorder.getId()));
                }
            }
        });
    }

    /**
     * 将订单详情中产品量融入默认采购产品为0的正常上架产品
     * @param purchaseorder
     * @param productCategoryList
     * @return
     */
    public void convertPurchaseorderdetailToProductCategoryList(Easy_company_purchaseorder purchaseorder, List<Easy_product_category> productCategoryList) {
        List<Easy_company_purchaseorderdetail> purchaseorderdetailList = dao().query(Easy_company_purchaseorderdetail.class, Cnd.where("order_id","=",purchaseorder.getOrder_id()));
        if(purchaseorderdetailList != null) {
            for(Easy_product_category product_category : productCategoryList) {
                List<Easy_product> productList = product_category.getEasyProductList();
                for(Easy_product product : productList) {
                    long product_id = product.getId();
                    for(Easy_company_purchaseorderdetail purchaseorderdetail : purchaseorderdetailList) {
                        long purchaseorderdetail_product_id = purchaseorderdetail.getProduct_id();
                        if(product_id == purchaseorderdetail_product_id) { // 匹配成功
                            product.setProduct_num((int) purchaseorderdetail.getProduct_num());
                            break;
                        }
                    }
                }
            }
        }
    }

    /**
     * 根据主订单id和修改后的采购单详细信息进行修改工作
     * 事务
     * @param purchaseorder
     * @param purchaseorderdetailList
     * @param checkInfo
     */
    public void updatePurchaseorderdetail(Easy_company_purchaseorder purchaseorder, List<Easy_company_purchaseorderdetail> purchaseorderdetailList, CheckInfo checkInfo) {
        // 待重新插入采购详细信息
        generateUpdatePurchaseorder(purchaseorder,purchaseorderdetailList, checkInfo);
        if(checkInfo.getFlag()) {
            // 将信息插入数据库中
            updatePurchaseorder(purchaseorder);
        }
    }

    /**
     * 根据采购的产品和数量生成采购订单和详细订单
     *
     * @param purchaseorder
     * @param purchaseorderdetailList
     * @param checkInfo
     * @return
     */
    private Easy_company_purchaseorder generateUpdatePurchaseorder(Easy_company_purchaseorder purchaseorder, List<Easy_company_purchaseorderdetail> purchaseorderdetailList, CheckInfo checkInfo) {
        // 计算订单总金额
        double total_price = 0.00;
        for(Easy_company_purchaseorderdetail purchaseorderdetail : purchaseorderdetailList) {
            long product_num = purchaseorderdetail.getProduct_num();
            purchaseorderdetail.setOrder_id(purchaseorder.getOrder_id()); //
            Easy_product product = dao().fetch(Easy_product.class, purchaseorderdetail.getProduct_id());
            if(product != null && product_num > 0 && product.getPrice_company() >= 0) { // 校验产品是否存在,且采购量大于0
                double price_company = product.getPrice_company();
                purchaseorderdetail.setProduct_name(product.getProduct_name()); //
                purchaseorderdetail.setPrice_company(price_company); //
                total_price += price_company * product_num;
            }else {
                checkInfo.setFlag(false);
                checkInfo.setMsg("产品校验有误,请联系管理员检查产品价格是否正确");
                return null;
            }
        }
        purchaseorder.setTotal_price(total_price);
        purchaseorder.setPurchaseorderdetailList(purchaseorderdetailList);
        return purchaseorder;
    }

    /**
     * 更新采购订单信息:事务
     * @param purchaseorder
     */
    private void updatePurchaseorder(Easy_company_purchaseorder purchaseorder) {
        Trans.exec(Connection.TRANSACTION_REPEATABLE_READ, new Atom() {
            @Override
            public void run() {
                dao().update(purchaseorder);
                // 删除订单主信息下的采购详细信息后，再添加当前采购详细信息
                dao().clear(Easy_company_purchaseorderdetail.class, Cnd.where("order_id","=",purchaseorder.getOrder_id()));
                dao().insert(purchaseorder.getPurchaseorderdetailList());
            }
        });
    }

    /**
     * 查询所有正常上架的产品类别中的正常上架的产品
     * @return
     */
    public List<Easy_product_category> queryNormalProductCategoryList() {
        List<Easy_product_category> productCategoryList = dao().query(Easy_product_category.class, Cnd.where("status","=",0));
        if(productCategoryList != null) {
            for(Easy_product_category easy_product_category: productCategoryList) {
                List<Easy_product> easyProductList;
                easyProductList = dao().query(Easy_product.class, Cnd.where("category_id","=",easy_product_category.getId()).and("status","=",0));
                if(easyProductList == null)
                    easyProductList = new ArrayList<>();
                easy_product_category.setEasyProductList(easyProductList);
            }
        }
        if(productCategoryList == null)
            productCategoryList = new ArrayList<>();
        return productCategoryList;
    }

    /**
     * 查询公司货架上所有信息
     * @param company_id
     * @return
     */
    public List<Easy_company_product> queryCompanyProduct(long company_id) {

        Sql sql = Sqls.queryRecord("select p.product_name,p.price_company,cp.num from easy_company_product cp " +
                                        "left join easy_product p on p.id = cp.product_id " +
                                        "where cp.company_id=@company_id");//参数化
        sql.params().set("company_id", company_id);
        dao().execute(sql);
        return sql.getList(null);
    }


    /**
     * 是否可以删除该采购员订单
     * @param purchaseorder_id
     * @param checkInfo
     */
    public void canDeleteCompanyPurchaseorder(long purchaseorder_id, CheckInfo checkInfo) {
        // 如果供货状态状态为'处理中',且支付状态为'未支付',且支付方式为'未知',则可以删除
        Easy_company_purchaseorder purchaseorder = dao().fetch(Easy_company_purchaseorder.class, purchaseorder_id);
        if(!(ConstantEasystoreOrder.PURCHASEORDER_GOODSSTATUS_DEALING == purchaseorder.getGoods_status()
                && ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_UNPAY == purchaseorder.getPay_status()
                && ConstantEasystoreOrder.PURCHASEORDER_PAYWAY_UNKNOWN == purchaseorder.getPay_way())) {
            checkInfo.setFlag(false);
            checkInfo.setMsg("无法删除采购订单，采购订单【" + purchaseorder.getOrder_id() + "】并非处于【供货中-未支付-支付方式未知】状态");
        }
    }

    /**
     * 待删除的采购单,是否都可以删除
     * @param purchaseorder_ids
     * @param checkInfo
     */
    public void canDeleteCompanyPurchaseorder(Long[] purchaseorder_ids, CheckInfo checkInfo) {
        for(long purchaseorder_id : purchaseorder_ids) {
            canDeleteCompanyPurchaseorder(purchaseorder_id, checkInfo);
            if(! checkInfo.getFlag()) // 存在不可删除的采购单了
                return;
        }
    }

    /**
     * 根据主订单Id删除主订单及详细信息
     * 事务
     * @param purchaseorder_id
     */
    public void deletePurchaseorder(long purchaseorder_id) {
        // 查找主订单
        Easy_company_purchaseorder purchaseorder = dao().fetch(Easy_company_purchaseorder.class, purchaseorder_id);
        // 删除详细订单
        Trans.exec(Connection.TRANSACTION_REPEATABLE_READ, new Atom() {
            @Override
            public void run() {
                // 删除详细订单
                dao().clear(Easy_company_purchaseorderdetail.class, Cnd.where("order_id", "=", purchaseorder.getOrder_id()));
                // 删除主订单
                dao().delete(Easy_company_purchaseorder.class, purchaseorder_id);
            }
        });
    }

    /**
     * 根据主订单Ids删除主订单及详细信息
     * 事务
     * @param purchaseorder_ids
     */
    public void deletePurchaseorder(Long[] purchaseorder_ids) {
        // 查找所有主订单
        List<Easy_company_purchaseorder> purchaseorderList = dao().query(Easy_company_purchaseorder.class, Cnd.where("id","in", purchaseorder_ids));
        // 查找所有主订单所对应order_id
        if(Strings.listNotEmpty(purchaseorderList)) {
            List<String> order_id_list = new ArrayList<>();
            for(Easy_company_purchaseorder purchaseorder : purchaseorderList)
                order_id_list.add(purchaseorder.getOrder_id());
            // 删除详细订单
            Trans.exec(Connection.TRANSACTION_REPEATABLE_READ, new Atom() {
                @Override
                public void run() {
                    // 删除所有详细订单
                    dao().clear(Easy_company_purchaseorderdetail.class, Cnd.where("order_id", "in", order_id_list));
                    // 删除主订单
                    dao().clear(Easy_company_purchaseorder.class, Cnd.where("id", "in", purchaseorder_ids));
                }
            });
        }

    }
}