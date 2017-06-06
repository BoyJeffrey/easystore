package cn.usually.modules.controllers.frontweb;

import cn.usually.common.base.Result;
import cn.usually.common.util.CheckUtil;
import cn.usually.modules.models.check.CheckInfo;
import cn.usually.modules.models.frontapi.param.FrontApiParam;
import cn.usually.modules.models.frontapi.result.CompanyProducts;
import cn.usually.modules.models.platform.easystore.Easy_empolyee_orderdetail;
import cn.usually.modules.services.frontweb.FrontUserService;
import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.json.Json;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.adaptor.JsonAdaptor;
import org.nutz.mvc.annotation.AdaptBy;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.annotation.Param;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 便利店前端请求
 * Created on 2017-05-2
 */
@IocBean
@At("/frontweb/user")
public class FrontUserController {
    private static final Log log = Logs.get();

    @Inject
    private FrontUserService frontUserService;

    /**
     * 用户扫描公司货架二维码后获取商品信息
     * @param param
     * @return
     */
    /*@At
    @Ok("json")
    public Object showProducts(@Param("..") FrontApiParam param) {
        try {
            log.debug("param::" + param);
            // 校验参数
            CheckInfo checkInfo = frontUserService.checkShowProductsParam(param);
            if(! checkInfo.getFlag())
                return Result.error(checkInfo.getMsg());
            // 校验通过,则获取该公司货架上商品信息
            CompanyProducts companyProducts = frontUserService.getCompanyProductsInfo(param.getCompany_id());
            return Result.success("ok",companyProducts);
        } catch (Exception e) {
            return Result.error("fail");
        }
    }*/

    /**
     * 用户扫描公司货架二维码后跳转至相应页面
     * @param param
     * @param  req
     * @return
     */
    @At
    @Ok("beetl:/frontweb/user/employee_buy_index.html")
    public void showProducts(@Param("..") FrontApiParam param, HttpServletRequest req) {
        log.debug("param::" + param);
        // 校验参数
        CheckInfo checkInfo = frontUserService.checkShowProductsParam(param);
        if(! checkInfo.getFlag()) {
            req.setAttribute("title", "");
            req.setAttribute("checkInfo", checkInfo);
            req.setAttribute("company_id", -1);
            return;
        }
        // 校验通过,则获取该公司货架上商品信息
        CompanyProducts companyProducts = frontUserService.getCompanyProductsInfo(param.getCompany_id());
        req.setAttribute("checkInfo", checkInfo);
        req.setAttribute("title", companyProducts.getTitle());
        req.setAttribute("company_id", param.getCompany_id());
        req.setAttribute("categoryList", companyProducts.getCategoryList());
    }

    /**
     * 校验用户支付前参数,校验通过则返回该笔订单在本系统中商户订单号
     * @param company_id
     * @param total_price
     * @param orderitem_datas
     */
    @At
    @Ok("json")
    @AdaptBy(type = JsonAdaptor.class)
    public Object checkBeforePay(@Param("company_id") long company_id, @Param("total_price") double total_price, @Param("orderitem_datas") String orderitem_datas) {
        log.debug("用户下单前,订单校验:company_id:" + company_id + ";total_price:" + total_price + ";orderitem_datas:" + orderitem_datas);
        List<Easy_empolyee_orderdetail> orderdetailList = Json.fromJsonAsList(Easy_empolyee_orderdetail.class, orderitem_datas);
        CheckInfo checkInfo = CheckUtil.getDefaultFalseCheckInfo(); // 校验对象初始化
        String buy_order_id = frontUserService.dealEmployeeBeforePay(company_id, total_price, orderdetailList, checkInfo);
        if(checkInfo.getFlag())
            return Result.success("success", buy_order_id);
        else
            return Result.error(checkInfo.getMsg());
    }
}
