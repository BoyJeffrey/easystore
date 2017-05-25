package cn.usually.modules.models.platform.easystore;

import cn.usually.common.base.Model;
import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.*;

import java.io.Serializable;
import java.util.List;

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
	@NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int status;

	@Many(field = "category_id" , target = Easy_product.class)
	private List<Easy_product> easyProductList;

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

	public List<Easy_product> getEasyProductList() {
		return easyProductList;
	}

	public void setEasyProductList(List<Easy_product> easyProductList) {
		this.easyProductList = easyProductList;
	}

}
