package cn.usually.modules.models.platform.alipay;

import java.io.Serializable;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.EL;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Prev;
import org.nutz.dao.entity.annotation.Table;

import cn.usually.common.base.Model;

/**
 * Created on 2016/12/1.
 */
@Table("alipay_config")
public class Alipay_config extends Model implements Serializable {
    private static final long serialVersionUID = 1L;
    @Column
    @Name
    @Comment("ID")
    @ColDefine(type = ColType.VARCHAR, width = 32)
    @Prev(els = {@EL("uuid()")})
    private String id;

    @Column
    @Comment("收款人名称")
    @ColDefine(type = ColType.VARCHAR, width = 120)
    private String partner_name;

    @Column
    @Comment("合作者身份ID")
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String partner;

    @Column
    @Comment("收款方ID")
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private String seller_id;

    @Column
    @Comment("商户私钥")
    @ColDefine(type = ColType.TEXT, width = 255)
    private String private_key;

    @Column
    @Comment("支付宝公钥")
    @ColDefine(type = ColType.TEXT, width = 255)
    private String ali_public_key;

    @Column
    @Comment("返回前端url")
    @ColDefine(type = ColType.VARCHAR, width = 120)
    private String front_url;
    
    @Column
    @Comment("后端回调url")
    @ColDefine(type = ColType.VARCHAR, width = 120)
    private String notify_url;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

	public String getPartner_name() {
		return partner_name;
	}

	public void setPartner_name(String partner_name) {
		this.partner_name = partner_name;
	}

	public String getPartner() {
		return partner;
	}

	public void setPartner(String partner) {
		this.partner = partner;
	}

	public String getSeller_id() {
		return seller_id;
	}

	public void setSeller_id(String seller_id) {
		this.seller_id = seller_id;
	}

	public String getPrivate_key() {
		return private_key;
	}

	public void setPrivate_key(String private_key) {
		this.private_key = private_key;
	}

	public String getAli_public_key() {
		return ali_public_key;
	}

	public void setAli_public_key(String ali_public_key) {
		this.ali_public_key = ali_public_key;
	}

	public String getFront_url() {
		return front_url;
	}

	public void setFront_url(String front_url) {
		this.front_url = front_url;
	}

	public String getNotify_url() {
		return notify_url;
	}

	public void setNotify_url(String notify_url) {
		this.notify_url = notify_url;
	}
}
