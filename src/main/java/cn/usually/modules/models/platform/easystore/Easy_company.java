package cn.usually.modules.models.platform.easystore;

import cn.usually.common.base.Model;
import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.*;

import java.io.Serializable;

/**
 * Created on 2017/5/10.
 */
@Table("easy_company")
@Comment("采购公司---平台上提供员工福利的公司")
@TableIndexes({@Index(name = "INDEX_EASYCOMPANY_ACCOUNTID", fields = {"account_id"}, unique = false),
			   @Index(name = "INDEX_EASYCOMPANY_EMPLOYEENUM", fields = {"employee_num"}, unique = false)})
public class Easy_company extends Model implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;

    @Column
    @Comment("公司名称")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 150)
    private String company_name;
    
    @Column
    @Comment("公司地址")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 200)
    private String company_address;
    
    @Column
    @Comment("公司联系电话")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private String company_phone;
    
    @Column
    @Comment("公司联系人姓名")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private String company_contact_name;

	@Column
	@Comment("公司员工人数")
	@NotNull
	@Default(value = "0")
	@ColDefine(type = ColType.INT)
	private int employee_num;
    
    @Column
    @Comment("公司加入平台时间")
    @ColDefine(type = ColType.DATETIME)
    private String create_time;
    
    @Column
    @Comment("公司在平台的登录账号id")
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private String account_id;

    @Column
    @Comment("公司在平台的登录密码")
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String account_password;
    
   /* @Column
    @Comment("公司采购员微信openid---登录平台公众号后用于采购管理")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 200)
    private String company_openid;*/
    
    @Column
    @Comment("公司给员工的福利类型:0纯福利;1员工和企业共同负担")
    @NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int benefit_type;
    
    @Column
    @Comment("纯福利公司员工象征性支付钱数:元")
    @NotNull
    @Default(value = "0.2")
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double price_pure_benefit;
    
    @Column
    @Comment("员工和企业共同负担公司员工支付钱数占产品公开价格的比例(%)---默认40,不能高于企业的拿货价格的最低值")
    @NotNull
    @Default(value = "40")
    @ColDefine(type = ColType.FLOAT, precision = 2)
    private Double price_percent_benefit;
    
    @Column
    @Comment("公司在平台状态:0正常;1已退出平台")
    @NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int status;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getCompany_name() {
		return company_name;
	}

	public void setCompany_name(String company_name) {
		this.company_name = company_name;
	}

	public String getCompany_address() {
		return company_address;
	}

	public void setCompany_address(String company_address) {
		this.company_address = company_address;
	}

	public String getCompany_phone() {
		return company_phone;
	}

	public void setCompany_phone(String company_phone) {
		this.company_phone = company_phone;
	}

	public String getCompany_contact_name() {
		return company_contact_name;
	}

	public void setCompany_contact_name(String company_contact_name) {
		this.company_contact_name = company_contact_name;
	}

	public String getCreate_time() {
		return create_time;
	}

	public void setCreate_time(String create_time) {
		this.create_time = create_time;
	}

	public String getAccount_id() {
		return account_id;
	}

	public void setAccount_id(String account_id) {
		this.account_id = account_id;
	}

	public String getAccount_password() {
		return account_password;
	}

	public void setAccount_password(String account_password) {
		this.account_password = account_password;
	}

	public int getBenefit_type() {
		return benefit_type;
	}

	public void setBenefit_type(int benefit_type) {
		this.benefit_type = benefit_type;
	}

	public Double getPrice_pure_benefit() {
		return price_pure_benefit;
	}

	public void setPrice_pure_benefit(Double price_pure_benefit) {
		this.price_pure_benefit = price_pure_benefit;
	}

	public Double getPrice_percent_benefit() {
		return price_percent_benefit;
	}

	public void setPrice_percent_benefit(Double price_percent_benefit) {
		this.price_percent_benefit = price_percent_benefit;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getEmployee_num() {
		return employee_num;
	}

	public void setEmployee_num(int employee_num) {
		this.employee_num = employee_num;
	}
}
