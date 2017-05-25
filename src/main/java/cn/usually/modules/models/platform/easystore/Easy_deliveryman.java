package cn.usually.modules.models.platform.easystore;

import cn.usually.common.base.Model;
import cn.usually.modules.models.platform.sys.Sys_user;
import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.*;

import java.io.Serializable;

/**
 * Created on 2017/5/10.
 */
@Table("easy_deliveryman")
@Comment("送货员管理")
@TableIndexes({@Index(name = "INDEX_EASYDELIVERYMAN_USERID", fields = {"userId"}, unique = true)})
public class Easy_deliveryman extends Model implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;

	@Column
	@Comment("关联送货员角色用户")
	@ColDefine(type = ColType.VARCHAR, width = 32)
	private String userId;
    
    @Column
    @Comment("送货员名称")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private String deliveryman_name;
    
	@Column
	@Comment("送货员联系电话")
	@NotNull
	@ColDefine(type = ColType.VARCHAR, width = 50)
	private String deliveryman_phone;
    
    @Column
    @Comment("送货员状态:0正常;1已退出平台")
    @NotNull
    @Default(value = "0")
    @ColDefine(type = ColType.INT)
    private int status;

    @One(target = Sys_user.class, field = "userId")
    private Sys_user sys_user;

	public long getId() {
		return id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getDeliveryman_name() {
		return deliveryman_name;
	}

	public void setDeliveryman_name(String deliveryman_name) {
		this.deliveryman_name = deliveryman_name;
	}

	public String getDeliveryman_phone() {
		return deliveryman_phone;
	}

	public void setDeliveryman_phone(String deliveryman_phone) {
		this.deliveryman_phone = deliveryman_phone;
	}

	public int getStatus() {
		return status;
	}

	public Sys_user getSys_user() {
		return sys_user;
	}

	public void setSys_user(Sys_user sys_user) {
		this.sys_user = sys_user;
	}

	public void setStatus(int status) {
		this.status = status;
	}
    
}
