package cn.usually.common.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.nutz.log.Log;
import org.nutz.log.Logs;

import cn.usually.common.base.Globals;
import cn.usually.modules.models.platform.sys.Sys_route;

/**
 * Created on 2016/7/31.
 */
public class RouteFilter implements Filter {
    private static final Log log = Logs.get();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req2 = (HttpServletRequest) req;
        HttpServletResponse res2 = (HttpServletResponse) res;
        res2.setCharacterEncoding("utf-8");
        req2.setCharacterEncoding("utf-8");
        Sys_route route = Globals.RouteMap.get(req2.getRequestURI().replace(Globals.AppBase, ""));
        if (route != null) {
            if ("show".equals(route.getType())) {
                res2.sendRedirect(route.getToUrl());
            } else {
                req2.getRequestDispatcher(route.getToUrl()).forward(req2, res2);
            }
        } else chain.doFilter(req2, res2);
    }

    @Override
    public void init(FilterConfig arg0) throws ServletException {
    }

    @Override
    public void destroy() {
    }
}
