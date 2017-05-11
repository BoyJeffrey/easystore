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

import cn.usually.common.base.Model;

/**
 * Created on 2017/5/10.
 */
@Table("easy_deliveryman_associatecompany")
@Comment("送货员当前关联公司")
@TableIndexes({@Index(name = "INDEX_EASYDELIVERYMANASSOCIATECOMPANY_DELIVERYMANID", fields = {"deliveryman_id"}, unique = false)})
public class Easy_deliveryman_associatecompany extends Model implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("送货员主键ID，对应表easy_deliveryman中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long deliveryman_id;
    
    @Column
    @Comment("公司ID，对应表easy_company中id")
    @NotNull
    @ColDefine(type = ColType.INT)
    private long company_id;

	public long getDeliveryman_id() {
		return deliveryman_id;
	}

	public void setDeliveryman_id(long deliveryman_id) {
		this.deliveryman_id = deliveryman_id;
	}

	public long getCompany_id() {
		return company_id;
	}

	public void setCompany_id(long company_id) {
		this.company_id = company_id;
	}
    
}
