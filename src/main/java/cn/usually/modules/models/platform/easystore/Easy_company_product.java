package cn.usually.modules.models.platform.easystore;

import java.io.Serializable;

import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

/**
 * Created on 2017/5/10.
 */
@Table("easy_company_product")
@Comment("公司的货架产品信息")
@TableIndexes({@Index(name = "INDEX_EASYCOMPANYPRODUCT_COMPANYPRODUCTID", fields = {"company_id","product_id"}, unique = false)})
public class Easy_company_product implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("公司ID，对应表easy_company中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long company_id;
    
    @Column
    @Comment("产品ID，对应表easy_product中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long product_id;

    @Column
    @Comment("公司货架上这个产品存货量:num>0")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long num;

	public long getCompany_id() {
		return company_id;
	}

	public void setCompany_id(long company_id) {
		this.company_id = company_id;
	}

	public long getProduct_id() {
		return product_id;
	}

	public void setProduct_id(long product_id) {
		this.product_id = product_id;
	}

	public long getNum() {
		return num;
	}

	public void setNum(long num) {
		this.num = num;
	}

}
