package cn.usually.modules.models.platform.union;

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
@Table("union_config")
public class Union_config extends Model implements Serializable {
    private static final long serialVersionUID = 1L;
    @Column
    @Name
    @Comment("ID")
    @ColDefine(type = ColType.VARCHAR, width = 32)
    @Prev(els = {@EL("uuid()")})
    private String id;

    @Column
    @Comment("商户名称")
    @ColDefine(type = ColType.VARCHAR, width = 120)
    private String merName;

    @Column
    @Comment("商户号")
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String merId;
    
    @Column
    @Comment("签名证书密码")
    @ColDefine(type = ColType.VARCHAR, width = 120)
    private String signCert_pwd;

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

	public String getMerName() {
		return merName;
	}

	public void setMerName(String merName) {
		this.merName = merName;
	}

	public String getMerId() {
		return merId;
	}

	public void setMerId(String merId) {
		this.merId = merId;
	}

	public String getSignCert_pwd() {
		return signCert_pwd;
	}

	public void setSignCert_pwd(String signCert_pwd) {
		this.signCert_pwd = signCert_pwd;
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
