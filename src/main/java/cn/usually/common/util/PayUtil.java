package cn.usually.common.util;

import cn.usually.common.pay.wechat.ConfigUtil;
import cn.usually.common.pay.wechat.MD5Util;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.SortedMap;

/**
 * 支付工具类
 * Created by MichaelZhou on 5/23/17.
 */
public class PayUtil {

    private static final String charset = "UTF-8";

    /**
     * 创建md5摘要,规则是:按参数名称a-z排序,遇到空值的参数不参加签名。
     */
    public static String createSignWx(SortedMap<String, String> packageParams) {
        StringBuffer sb = new StringBuffer();
        Set es = packageParams.entrySet();
        Iterator it = es.iterator();
        while (it.hasNext()) {
            Map.Entry entry = (Map.Entry) it.next();
            String k = (String) entry.getKey();
            String v = (String) entry.getValue();
            if (null != v && !"".equals(v) && !"sign".equals(k)
                    && !"key".equals(k)) {
                sb.append(k + "=" + v + "&");
            }
        }
        sb.append("key=" + ConfigUtil.API_KEY);
        System.out.println("md5 sb:" + sb);
        String sign = MD5Util.MD5Encode(sb.toString(), charset).toUpperCase();
        System.out.println("packge签名:" + sign);
        return sign;

    }
}
