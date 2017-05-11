package cn.usually.modules.models.platform.easystore;

import java.io.Serializable;

import org.antlr.v4.runtime.misc.NotNull;
import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.ColType;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

import cn.usually.common.base.Model;

/**
 * Created on 2017/5/10.
 */
@Table("easy_deliveryman")
@Comment("送货员管理")
@TableIndexes({@Index(name = "INDEX_EASYDELIVERYMAN_LOGINID", fields = {"login_id"}, unique = true)})
public class Easy_deliveryman extends Model implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column
    @Comment("ID")
    @Id
    private long id;
    
    @Column
    @Comment("送货员登录Id")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private long login_id;

    @Column
    @Comment("送货员页面登录密码")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 100)
    private String login_password;
    
    @Column
    @Comment("送货员名称")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private String deliveryman_name;
    
    @Column
    @Comment("送货员昵称")
    @NotNull
    @ColDefine(type = ColType.VARCHAR, width = 50)
    private String deliveryman_nickname;
    
    @Column
    @Comment("送货员状态:0正常;1已退出平台")
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

	public long getLogin_id() {
		return login_id;
	}

	public void setLogin_id(long login_id) {
		this.login_id = login_id;
	}

	public String getLogin_password() {
		return login_password;
	}

	public void setLogin_password(String login_password) {
		this.login_password = login_password;
	}

	public String getDeliveryman_name() {
		return deliveryman_name;
	}

	public void setDeliveryman_name(String deliveryman_name) {
		this.deliveryman_name = deliveryman_name;
	}

	public String getDeliveryman_nickname() {
		return deliveryman_nickname;
	}

	public void setDeliveryman_nickname(String deliveryman_nickname) {
		this.deliveryman_nickname = deliveryman_nickname;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
    
}
