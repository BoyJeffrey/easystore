package cn.usually.modules.models.platform.easystore;

import java.io.Serializable;

import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import cn.usually.common.base.Model;

/**
 * Created on 2017/5/10.
 */
@Table("easy_product_category")
@Comment("产品分类")
public class Easy_product_category extends Model implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;

    @Column
    @Comment("产品类别名称")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private String name;
    
    @Column
    @Comment("产品类别状态:0正常;1下架")
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int status;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

}
