package cn.usually.common.shiro.interceptor;

import org.apache.shiro.aop.MethodInvocation;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.aop.AnnotationsAuthorizingMethodInterceptor;

/**
 * Created on 2016/6/22.
 */
public class ShiroAnnotationsAuthorizingMethodInterceptor extends AnnotationsAuthorizingMethodInterceptor {

    public static final ShiroAnnotationsAuthorizingMethodInterceptor DEFAULT_AUTH = new ShiroAnnotationsAuthorizingMethodInterceptor();

    public void assertAuthorized(MethodInvocation methodInvocation) throws AuthorizationException {
        super.assertAuthorized(methodInvocation);
    }
}