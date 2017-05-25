package cn.usually.common.shiro.exception;

import org.apache.shiro.authc.AuthenticationException;

/**
 * Created on 2016/6/22
 */
public class EmptyCaptchaException extends AuthenticationException {

    public EmptyCaptchaException() {
        super();
    }

    public EmptyCaptchaException(String message, Throwable cause) {
        super(message, cause);
    }

    public EmptyCaptchaException(String message) {
        super(message);
    }

    public EmptyCaptchaException(Throwable cause) {
        super(cause);
    }
}
