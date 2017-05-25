package cn.usually.common.util;

import java.util.UUID;

/**
 * @desc Uuid生成类
 * @author 
 * @Copyright: (c) 2016年10月27日 下午2:05:34
 * @company: 民生在线  
 */
public class UuidUtil {
	
	/**
	 * 表32位主键生成
	 */
	public static String getTablePk() {
		return java.util.UUID.randomUUID().toString().replace("-", "");
	}
	
	/**
	 * 生成唯一订单号:16位数
	 * @param machineId 集群、服务器编号
	 * @return
	 */
	public static String getOrderId12ByUUId(String machineId) {
        int hashCodeV = UUID.randomUUID().toString().hashCode();
        if(hashCodeV < 0) {//有可能是负数
            hashCodeV = - hashCodeV;
        }
        // 0 代表前面补充0;15 代表长度为15;d 代表参数为正数型
        return machineId + String.format("%015d", hashCodeV);
    }
	
	/**
	 * 生成唯一订单号:28位数
	 * 格式:machineId + xxxx + 00 + xxxx + 00 + 15位hashCode
	 * @param machineId 集群、服务器编号
	 * @return
	 */
	public static String getOrderId28ByUUId(String machineId) {
		int hashCodeV = UUID.randomUUID().toString().hashCode();
		if(hashCodeV < 0) {//有可能是负数
			hashCodeV = - hashCodeV;
		}
		// 0 代表前面补充0;15 代表长度为15;d 代表参数为正数型
		return machineId + getFixedDigitRandomNumber(4) + "00" + getFixedDigitRandomNumber(4) + "00" + String.format("%015d", hashCodeV);
	}
	
	/**
	 * 生成固定位数的随机数:1~18位
	 * @param digit
	 * @return
	 */
	public static String getFixedDigitRandomNumber(int digit) {
		if(digit < 1){  
            throw new IllegalArgumentException("随机数位数必须大于0");  
        }  
        return String.valueOf((long)(Math.random()*9*Math.pow(10,digit-1)) + (long)Math.pow(10,digit-1));
	}

	/**
	 * 生成公司采购单唯一订单号:
	 * 格式:account_id + "00" + 14位时间戳 + "00" + 8位随机数
	 * @return
	 */
	public static String getCompanyPurchaseOrderIdByUUId(String account_id) {
		int hashCodeV = UUID.randomUUID().toString().hashCode();
		if(hashCodeV < 0) {//有可能是负数
			hashCodeV = - hashCodeV;
		}
		return account_id + "00" + DateUtil.getCompactDateTime() + "00" + getFixedDigitRandomNumber(8);
	}

	/**
	 * 生成唯一用户订单号:32位数
	 * 格式:14位时间戳 + "00" + 1位随机数 + 15位hashCode
	 * @return
	 */
	public static String getOrderId32ByUUId() {
		int hashCodeV = UUID.randomUUID().toString().hashCode();
		if(hashCodeV < 0) {//有可能是负数
			hashCodeV = - hashCodeV;
		}
		// 0 代表前面补充0;15 代表长度为15;d 代表参数为正数型
		return DateUtil.getCompactDateTime() + "00" + getFixedDigitRandomNumber(1) + String.format("%015d", hashCodeV);
	}
	
    public static void main(String[] args) {
        System.out.println(getOrderId28ByUUId("1"));
        System.out.println(getFixedDigitRandomNumber(8));
		System.out.println(getCompanyPurchaseOrderIdByUUId("123"));
		System.out.println(getOrderId32ByUUId());
	}

}
