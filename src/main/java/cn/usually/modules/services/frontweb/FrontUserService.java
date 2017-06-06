package cn.usually.modules.services.frontweb;

import cn.usually.common.base.Service;
import cn.usually.common.constant.ConstantEasystoreOrder;
import cn.usually.common.util.*;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.frontapi.param.FrontApiParam;
import cn.usually.modules.models.frontapi.result.CompanyProducts;
import cn.usually.modules.models.frontapi.result.ProductCategoryInfo;
import cn.usually.modules.models.frontapi.result.ProductInfo;
import cn.usually.modules.models.platform.easystore.*;
import cn.usually.modules.services.check.CheckService;
import cn.usually.modules.services.platform.easystore.EasyCompanyService;
import cn.usually.modules.services.platform.easystore.EasyProductCategoryService;
import cn.usually.modules.services.platform.easystore.EasyProductService;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.entity.Entity;
import org.nutz.dao.sql.Sql;
import org.nutz.ioc.loader.annotation.Inject;
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

/**
 * Created on 2017-05-15
 */
@SuppressWarnings("rawtypes")
@IocBean(args = {"refer:dao"})
public class FrontUserService extends Service {
	
	private static final Log log = Logs.get();

	@Inject
	private CheckService checkService;

	@Inject
	private EasyCompanyService easyCompanyService;

	@Inject
	private EasyProductCategoryService easyProductCategoryService;

	@Inject
	private EasyProductService easyProductService;

	public FrontUserService(Dao dao) {
		super(dao);
	}

	/**
	 * 校验参数
	 * @param param
	 * @return
	 */
	public CheckInfo checkShowProductsParam(FrontApiParam param) {
		CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象初始化
		// 校验参数
		checkService.checkShowProductsParam(param, checkInfo);
		if(! checkInfo.getFlag())
			return checkInfo;
		// 校验公司Id是否存在
		checkCompanyExists(param.getCompany_id(), checkInfo);
		return checkInfo;
	}

	/**
	 * 根据主键检查公司是否存在:存在返回该公司信息,同时校验通过;否则返回空,且校验失败
	 * @param company_id
	 * @param checkInfo
	 */
	public Easy_company checkCompanyExists(long company_id, CheckInfo checkInfo) {
		Easy_company easy_company = easyCompanyService.fetch(company_id);
		if(easy_company == null) {
			checkInfo.setFlag(false);
			checkInfo.setMsg("匹配公司信息失败");
			return null;
		}else
			return easy_company;
	}

	/**
	 * 获取所有产品信息,供测试时使用
	 * @param company_id
	 * @return
	 */
	/*public CompanyProducts getAllProductsInfo(long company_id) {
		CompanyProducts companyProducts = new CompanyProducts(); //
		// TODO 查询公司所采购的产品库存信息
		Easy_company easy_company = easyCompanyService.fetch(company_id); // 获取公司信息
		companyProducts.setTitle(easy_company.getCompany_name()); //
		List<ProductCategoryInfo> categoryList = new ArrayList<>(); // 待整理的产品类别信息列表
		// 目前返回所有产品信息
		List<Easy_product_category> productCategoryList = easyProductCategoryService.query();
		for(Easy_product_category productCategory : productCategoryList) {
			ProductCategoryInfo productCategoryInfo =  new ProductCategoryInfo();
			productCategoryInfo.setProduct_category_name(productCategory.getName());
			List<ProductInfo> productInfoList = new ArrayList<>(); // 待整理的产品信息
			// 获取其下所有产品信息
			List<Easy_product> productList = easyProductService.query(Cnd.where("category_id","=",productCategory.getId()));
			for(Easy_product product : productList) {
				ProductInfo productInfo = new ProductInfo();
				productInfo.setProduct_id(product.getId());
				productInfo.setProduct_name(product.getProduct_name());
				productInfo.setImage_url("http://www.newworklife.cn" + product.getImage_url());
				productInfo.setPrice_public(product.getPrice_public());
				productInfo.setPrice_empolyee(product.getPrice_company());
				productInfo.setNum(product.getStock());
				productInfoList.add(productInfo);
			}
			productCategoryInfo.setProductInfoList(productInfoList);
			categoryList.add(productCategoryInfo);
		}
		companyProducts.setCategoryList(categoryList);
		return companyProducts;
	}*/

	/**
	 * 根据公司Id获取货架产品信息
	 * @param company_id
	 * @return
	 */
	public CompanyProducts getCompanyProductsInfo(long company_id) {
		CompanyProducts companyProducts = new CompanyProducts(); //
		// 获取公司信息
		Easy_company company = dao().fetch(Easy_company.class, company_id);
		companyProducts.setTitle(company.getCompany_name());
		// 查询公司所采购的产品库存信息
		Sql sql = Sqls.create("select com.company_name as title,pc.id as category_id," +
											"pc.name as product_category_name,pro.id as product_id," +
											"pro.product_name,pro.image_url,round(pro.price_public,2) as price_public," +
											"case com.benefit_type " +
												"when 0 then round(com.price_pure_benefit,2) " +
												"when 1 then ROUND(pro.price_public * com.price_percent_benefit/100,2) " +
												"else round(pro.price_public,2) " +
											"end as price_empolyee," +
											"cp.num from easy_company_product cp " +
										"inner join easy_company com on com.id = cp.company_id " +
										"inner join easy_product pro on pro.id = cp.product_id " +
										"inner join easy_product_category pc on pc.id = pro.category_id " +
										"where cp.company_id = @company_id order by pc.id");
		sql.setCallback(Sqls.callback.entities());
		Entity<ProductInfo> entity = dao().getEntity(ProductInfo.class);
		sql.setEntity(entity).setParam("company_id", company_id);
		this.dao().execute(sql);
		List<ProductInfo> list = sql.getList(ProductInfo.class);
		// 分类所对应产品Id
		List<Long> category_id_list = new ArrayList<>();
		if(Strings.listNotEmpty(list)) {
			for(ProductInfo productInfo : list) {
				if(! category_id_list.contains(productInfo.getCategory_id()))
					category_id_list.add(productInfo.getCategory_id());
			}
			// 组装数据
			List<ProductCategoryInfo> productCategoryList = new ArrayList<>();
			for(long category_id : category_id_list) {
				ProductCategoryInfo productCategoryInfo =  new ProductCategoryInfo();
				List<ProductInfo> productInfoList = new ArrayList<>(); // 待整理的产品信息
				// 匹配所有该类别产品分类信息
				for(ProductInfo productInfo : list) {
					if(productInfo.getCategory_id() == category_id) { // 匹配ok
//						companyProducts.setTitle(productInfo.getTitle()); //
						productCategoryInfo.setCategory_id(category_id);
						productCategoryInfo.setProduct_category_name(productInfo.getProduct_category_name()); //
						productInfoList.add(productInfo);
					}
				}
				productCategoryInfo.setProductInfoList(productInfoList); // 该类别所有产品组装
				productCategoryList.add(productCategoryInfo); // 组装类别
			}
			companyProducts.setCategoryList(productCategoryList); //
		}
		return companyProducts;
	}

	/**
	 * 用户支付订单前,参数校验
	 * @param company_id
	 * @param total_price
	 * @param orderdetailList
	 * @param checkInfo
	 * @return
	 */
	public String dealEmployeeBeforePay(long company_id, double total_price, List<Easy_empolyee_orderdetail> orderdetailList, CheckInfo checkInfo) {
		String buy_order_id = "";
		// 校验相关公司是否存在
		if(company_id > 0) {
			Easy_company company = dao().fetch(Easy_company.class, company_id);
			if(company == null) {
				checkInfo.setMsg("查询公司信息失败");
				return "";
			}
		}else {
			checkInfo.setMsg("校验公司信息失败");
			return "";
		}
		List<Long> productIdList = new ArrayList<>();
		// 校验产品是否存在公司货架上,且是否足够
		if(Strings.listNotEmpty(orderdetailList)) {
			for(Easy_empolyee_orderdetail orderdetail : orderdetailList) {
				productIdList.add(orderdetail.getProduct_id());
				int count = dao().count(Easy_company_product.class, Cnd.where("company_id", "=", company_id).and("product_id", "=", orderdetail.getProduct_id())
																		.and("num", ">=", orderdetail.getProduct_num()));
				if(count == 0) {
					checkInfo.setMsg("校验部分零食已不足");
					return "";
				}
			}
		}else {
			checkInfo.setMsg("还未选择零食呢");
			return "";
		}
		// 校验价格是否大于0,且是否无误
		if(total_price >= 0) {
			// 查询库中当前产品价格
			Sql sql = Sqls.create("select pro.id as product_id,pro.product_name as product_name," +
					"case com.benefit_type " +
					"when 0 then round(com.price_pure_benefit,2) " +
					"when 1 then ROUND(pro.price_public * com.price_percent_benefit/100,2) " +
					"else round(pro.price_public,2) " +
					"end as price_empolyee " +
					"from easy_company_product cp " +
					"inner join easy_company com on com.id = cp.company_id " +
					"inner join easy_product pro on pro.id = cp.product_id " +
					"$condition");
			sql.setCallback(Sqls.callback.entities());
			Entity<ProductInfo> entity = dao().getEntity(ProductInfo.class);
			sql.setEntity(entity).setCondition(Cnd.where("cp.company_id", "=", company_id).and("cp.product_id", "in", productIdList));
			this.dao().execute(sql);
			List<ProductInfo> list_db = sql.getList(ProductInfo.class);
			// 校验产品个数是否相同
			if(list_db.size() != orderdetailList.size()) {
				log.info("校验零食库存信息有误---库中所涉及产品list:" + list_db.size() + ";前端购买产品list:" + orderdetailList.size());
				checkInfo.setMsg("校验零食库存信息有误");
				return "";
			}
			// 组装成map形式
			Map<Long, ProductInfo> productInfoMap = new HashMap<>();
			for(ProductInfo productInfo : list_db)
				productInfoMap.put(productInfo.getProduct_id(), productInfo);
			// 统计库中总价格
			double total_price_db = 0.00;
			for(Easy_empolyee_orderdetail orderdetail : orderdetailList) {
				total_price_db = (MoneyUtil.objectToBigDecimalNoException(total_price_db)
						.add(MoneyUtil.objectToBigDecimalNoException(productInfoMap.get(orderdetail.getProduct_id()).getPrice_empolyee()).multiply(MoneyUtil.objectToBigDecimalNoException(Long.valueOf(orderdetail.getProduct_num())))).doubleValue());
			}
			// 标胶最终价格
			if(total_price != total_price_db) {
				log.info("校验价格有误---" + "前端total_price:" + total_price + ";而后端total_price_db:" + total_price_db);
				checkInfo.setMsg("校验价格有误,请重新下单");
				return "";
			}
			buy_order_id = UuidUtil.getOrderId32ByUUId();
			// 生成订单
			createEmpolyeeorder(buy_order_id, company_id, total_price, orderdetailList, productInfoMap);
			// 一切ok,生成该笔订单的商户订单号
			checkInfo.setFlag(true);
			return buy_order_id;
		}else {
			checkInfo.setMsg("校验价格有误,请重新下单");
			return "";
		}

	}

	/**
	 * 生成订单
	 * 事务
	 * @param buy_order_id
	 * @param company_id
	 * @param total_price
	 * @param orderdetailList
	 * @param productInfoMap
	 */
	private void createEmpolyeeorder(String buy_order_id, long company_id, double total_price, List<Easy_empolyee_orderdetail> orderdetailList, Map<Long, ProductInfo> productInfoMap) {
		// 组装主表
		Easy_empolyee_order empolyee_order = new Easy_empolyee_order();
		empolyee_order.setBuy_order_id(buy_order_id);
		empolyee_order.setCompany_id(company_id);
		empolyee_order.setOpenid(""); // 用户微信openid,延迟插入
		empolyee_order.setCreate_time(DateUtil.getDateTime());
		empolyee_order.setTotal_price(total_price);
		empolyee_order.setThirdpay_order_id(""); // 待成功支付时插入
		empolyee_order.setPay_time(null); // 待成功支付时插入
		empolyee_order.setPay_status(ConstantEasystoreOrder.PURCHASEORDER_PAYSTATUS_UNPAY);
		empolyee_order.setPay_way(ConstantEasystoreOrder.PURCHASEORDER_PAYWAY_UNKNOWN);
		// 组装详细表
		List<Easy_empolyee_orderdetail> empolyee_orderdetail_list = new ArrayList<>();
		for(Easy_empolyee_orderdetail easy_empolyee_orderdetail : orderdetailList) {
			long product_id = easy_empolyee_orderdetail.getProduct_id();
			easy_empolyee_orderdetail.setBuy_order_id(buy_order_id);
			easy_empolyee_orderdetail.setProduct_name(productInfoMap.get(product_id).getProduct_name());
			easy_empolyee_orderdetail.setPrice_empolyee(productInfoMap.get(product_id).getPrice_empolyee());
			empolyee_orderdetail_list.add(easy_empolyee_orderdetail);
		}
		// 事务插入订单信息
		Trans.exec(Connection.TRANSACTION_REPEATABLE_READ, new Atom() {
			@Override
			public void run() {
				dao().insert(empolyee_order);
				dao().insert(empolyee_orderdetail_list);
			}
		});
	}
}
