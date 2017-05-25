package cn.usually.common.filter;

import org.nutz.json.JsonFormat;
import org.nutz.lang.Strings;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.ActionContext;
import org.nutz.mvc.ActionFilter;
import org.nutz.mvc.Mvcs;
import org.nutz.mvc.View;
import org.nutz.mvc.view.UTF8JsonView;

import cn.usually.common.base.Result;
import cn.usually.modules.services.platform.sys.SysApiService;


/**
 * Created on 2016/8/11.
 */
public class TokenFilter implements ActionFilter {
    private static final Log log = Logs.get();
    private SysApiService apiService= Mvcs.ctx().getDefaultIoc().get(SysApiService.class);

    public View match(ActionContext context) {
        String appId = Strings.sNull(context.getRequest().getParameter("appId"));
        String token = Strings.sNull(context.getRequest().getParameter("token"));
        if (!apiService.verifyToken(appId, token)) {
            return new UTF8JsonView(JsonFormat.compact()).setData(Result.error(-1,"token invalid"));
        }
        return null;
    }
}
