package cn.usually.common.core;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import net.sf.ehcache.CacheManager;

import org.apache.shiro.crypto.RandomNumberGenerator;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.Sha256Hash;
import org.nutz.dao.Chain;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.impl.FileSqlManager;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.util.Daos;
import org.nutz.integration.quartz.QuartzJob;
import org.nutz.integration.quartz.QuartzManager;
import org.nutz.ioc.Ioc;
import org.nutz.lang.Encoding;
import org.nutz.lang.Strings;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.NutConfig;
import org.quartz.Scheduler;

import cn.usually.common.base.Globals;
import cn.usually.modules.models.platform.sys.Sys_config;
import cn.usually.modules.models.platform.sys.Sys_menu;
import cn.usually.modules.models.platform.sys.Sys_role;
import cn.usually.modules.models.platform.sys.Sys_route;
import cn.usually.modules.models.platform.sys.Sys_task;
import cn.usually.modules.models.platform.sys.Sys_unit;
import cn.usually.modules.models.platform.sys.Sys_user;

/**
 * Created on 2016/6/21.
 */
public class Setup implements org.nutz.mvc.Setup {
    private static final Log log = Logs.get();

    public void init(NutConfig config) {
        try {
            // 环境检查
            if (!Charset.defaultCharset().name().equalsIgnoreCase(Encoding.UTF8)) {
                log.warn("This project must run in UTF-8, pls add -Dfile.encoding=UTF-8 to JAVA_OPTS");
            }
            Ioc ioc = config.getIoc();
            Dao dao = ioc.get(Dao.class);
            // 初始化数据表
            initSysData(config, dao);
            // 检查一下Ehcache CacheManager 是否正常.
            CacheManager cacheManager = ioc.get(CacheManager.class);
            log.debug("Ehcache CacheManager = " + cacheManager);
            // 初始化系统变量
            initSysSetting(config, dao);
            // 初始化定时任务
            initSysTask(config, dao);
            // 初始化自定义路由
            initSysRoute(config, dao);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 初始化自定义路由
     *
     * @param config
     * @param dao
     */
    private void initSysRoute(NutConfig config, Dao dao) {
        if (0 == dao.count(Sys_route.class)) {
            //路由示例
            Sys_route route = new Sys_route();
            route.setDisabled(false);
            route.setUrl("/sysadmin");
            route.setToUrl("/platform/login");
            route.setType("hide");
            dao.insert(route);
        }
        Globals.initRoute(dao);
    }

    /**
     * 初始化定时任务
     *
     * @param config
     * @param dao
     */
    private void initSysTask(NutConfig config, Dao dao) {
        QuartzManager quartzManager = config.getIoc().get(QuartzManager.class);
        quartzManager.clear();
        if (0 == dao.count(Sys_task.class)) {
            //定时任务示例
            Sys_task task = new Sys_task();
            task.setDisabled(true);
            task.setName("测试任务");
            task.setJobClass("cn.usually.common.quartz.job.TestJob");
            task.setCron("*/50 * * * * ?");
            task.setData("{\"hi\":\"---\"}");
            task.setNote("---");
            dao.insert(task);
        }
        List<Sys_task> taskList = dao.query(Sys_task.class, Cnd.where("disabled", "=", 0));
        for (Sys_task sysTask : taskList) {
            try {
                QuartzJob qj = new QuartzJob();
                qj.setJobName(sysTask.getId());
                qj.setJobGroup(sysTask.getId());
                qj.setClassName(sysTask.getJobClass());
                qj.setCron(sysTask.getCron());
                qj.setComment(sysTask.getNote());
                qj.setDataMap(sysTask.getData());
                quartzManager.add(qj);
            } catch (Exception e) {
                log.error(e.getMessage());
            }
        }
    }

    /**
     * 初始化数据库
     *
     * @param config
     * @param dao
     */
    private void initSysData(NutConfig config, Dao dao) {
        Daos.createTablesInPackage(dao, "cn.usually.modules", false);
    }

    /**
     * 初始化系统变量
     *
     * @param config
     * @param dao
     */
    private void initSysSetting(NutConfig config, Dao dao) {
        Globals.AppRoot = Strings.sNull(config.getAppRoot());//项目路径
        Globals.AppBase = Strings.sNull(config.getServletContext().getContextPath());//部署名
        Globals.init(dao);
    }

    public void destroy(NutConfig config) {
        // 解决quartz有时候无法停止的问题
        try {
            config.getIoc().get(Scheduler.class).shutdown(true);
        } catch (Exception e) {
        }
    }
}
