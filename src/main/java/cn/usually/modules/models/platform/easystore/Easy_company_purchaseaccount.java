package cn.usually.modules.models.platform.easystore;

import java.io.Serializable;

import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.*;

import cn.usually.common.base.Model;

/**
 * Created on 2017/5/10.
 */
@Table("easy_company_purchaseaccount")
@Comment("公司采购人员信息")
@TableIndexes({@Index(name = "INDEX_EASYCOMPANYPURCHASEACCOUNT_COMPANYID", fields = {"company_id"}, unique = false)})
public class Easy_company_purchaseaccount extends Model implements Serializable {
    private static final long serialVersionUID = 1L;

	@Column
	@Comment("ID")
	@Id
	private long id;

    @Column
    @Comment("公司ID，对应表easy_company中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long company_id;
    
    @Column
    @Comment("公司采购员微信openid---登录平台公众号后用于采购管理")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 200)
    private String company_openid;

	@Column
	@Comment("公司采购员姓名")
	@NotNull
	@ColDefine(type = ColType.VARCHAR, width = 50)
	private String company_purchasename;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getCompany_id() {
		return company_id;
	}

	public void setCompany_id(long company_id) {
		this.company_id = company_id;
	}

	public String getCompany_openid() {
		return company_openid;
	}

	public void setCompany_openid(String company_openid) {
		this.company_openid = company_openid;
	}

	public String getCompany_purchasename() {
		return company_purchasename;
	}

	public void setCompany_purchasename(String company_purchasename) {
		this.company_purchasename = company_purchasename;
	}
}
