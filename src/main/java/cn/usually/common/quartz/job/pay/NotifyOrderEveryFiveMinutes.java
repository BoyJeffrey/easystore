package cn.usually.common.quartz.job.pay;

import org.nutz.ioc.loader.annotation.Inject;
import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import cn.usually.modules.services.pay.CommonPayService;

/**
 * @desc 
 * @author 
 * @Copyright: (c) 2016年12月6日 下午4:06:58
 * @company: 
 */
@IocBean
public class NotifyOrderEveryFiveMinutes implements Job {
	
	private static final Log log = Logs.get();
	
	@Inject
    private CommonPayService commonPayService;

    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap data = context.getJobDetail().getJobDataMap();
        String taskId = context.getJobDetail().getKey().getName();
        String desc = data.getString("desc");
        log.info("定时任务中,taskId:" + taskId + ";desc" + desc);
        // 查询第三方成功订单中,客户端未异步返回本地成功信息,且未达到通知次数的订单
        commonPayService.notifyOrder(taskId);
    }

}
