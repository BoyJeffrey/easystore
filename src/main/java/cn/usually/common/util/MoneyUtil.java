package cn.usually.common.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.rmi.ServerException;
import java.text.DecimalFormat;

/**
 * @desc 金额转换
 * @author 
 * @Copyright: (c) 2016年4月9日 下午5:21:03
 * @company: 民生在线  
 */
public class MoneyUtil {
	private static final BigDecimal PRICE_DEFAULT_NULL = new BigDecimal(0); // 金额为空时,默认0
	private static final String PRICE_FRACTION_ONE = "0.0"; // 保留1位小数
	private static final String PRICE_FRACTION_TWO = "0.00"; // 保留2位小数
	private static final String PRICE_NO_FRACTION = "0"; // 不存在小数点
	
	/**
	 * Object转BigDecimal
	 * @param price
	 * @return
	 * @throws ServerException 
	 */
	public static BigDecimal objectToBigDecimalNoException(Object o) {
		BigDecimal result = null;
		try {
			if(o == null)
				result = PRICE_DEFAULT_NULL;
			else
				result = new BigDecimal(String.valueOf(o));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 保留2位小数
	 * @param price
	 * @return
	 * @throws ServerException 
	 */
	public static BigDecimal getFractionTwoNoException(BigDecimal price) {
		BigDecimal result = PRICE_DEFAULT_NULL;
		try {
			DecimalFormat df = new DecimalFormat(PRICE_FRACTION_TWO);
			df.setRoundingMode(RoundingMode.FLOOR);
			result = new BigDecimal(df.format(price));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 保留2位小数:四舍五入
	 * @param price
	 * @return
	 * @throws ServerException 
	 */
	public static BigDecimal getFractionTwoHalfUpNoException(BigDecimal price) {
		BigDecimal result = PRICE_DEFAULT_NULL;
		try {
			DecimalFormat df = new DecimalFormat(PRICE_FRACTION_TWO);
			df.setRoundingMode(RoundingMode.HALF_UP);
			result = new BigDecimal(df.format(price));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 返回BigDecimal类型(1位小数)
	 * @param price
	 * @return
	 * @throws ServerException 
	 */
	public static BigDecimal getFractionOneBD(BigDecimal price) {
		BigDecimal result = new BigDecimal(0);
		try {
			DecimalFormat df = new DecimalFormat(PRICE_FRACTION_ONE);
			df.setRoundingMode(RoundingMode.FLOOR);
			result = new BigDecimal(df.format(price));
		} catch (Exception e) {
			System.out.println("price:" + price);
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * BigDecimal转换为整数
	 * @param price
	 * @return
	 * @throws ServerException 
	 */
	public static int getNoFractionUpInt(BigDecimal price) {
		int result = 0;
		try {
			DecimalFormat df = new DecimalFormat(PRICE_NO_FRACTION);
			df.setRoundingMode(RoundingMode.UP);
			result = Integer.valueOf(String.valueOf(df.format(price)));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 是否金额为0
	 * @param price
	 * @return
	 * @throws ServerException 
	 */
	public static boolean isMoneyNotZero(String price) {
		if(price == null || "".equals(price.trim()) || "".equals(price))
			return false;
		else
			return true;
	}
	
	/**
	 * 是否金额为0
	 * @param price
	 * @return
	 * @throws ServerException 
	 */
	public static boolean isMoneyNotZero(BigDecimal price) {
		if(price == null || price.compareTo(new BigDecimal(0)) == 0)
			return false;
		else
			return true;
	}
	
	/**
	 * 是否>0 且<=1
	 * @param value
	 * @return
	 */
	public static boolean isValueBetweenZeroAndOne(BigDecimal value) {
		if(value != null && value.compareTo(new BigDecimal(0)) == 1 && value.compareTo(new BigDecimal(1)) < 1)
			return true;
		else
			return false;
	}

	/**
	 * 是否大于0
	 * @param value
	 * @return true 大于0, false 不大于0
	 */
	public static boolean isMorethanZero(BigDecimal value) {
		if(value != null && value.compareTo(new BigDecimal("0")) == 1)
			return true;
		else
			return false;
	}
	
	/**
	 * 是否为金额,且大于0
	 * @param value
	 * @return 
	 */
	public static boolean isMoneyMorethanZero(Object o) {
		boolean flag = false;
		try {
			BigDecimal money = new BigDecimal(String.valueOf(o));
			if(money.compareTo(new BigDecimal("0")) == 1)
				flag = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 比较前面金额是否大于后面金额:前面大于后面返回true,否则返回false
	 * @param value
	 * @return 
	 */
	public static boolean isAmountBeforeMorethanAfter(BigDecimal amount_before, BigDecimal amount_after) {
		if(amount_before.compareTo(amount_after) == 1)
			return true;
		else
			return false;
	}
	
	/**
	 * 比较前面金额是否大于等于后面金额:前面大于后面返回true,否则返回false
	 * @param value
	 * @return 
	 */
	public static boolean isAmountBeforeMorethanOrSameAfter(BigDecimal amount_before, BigDecimal amount_after) {
		if(amount_before.compareTo(amount_after) == -1)
			return false;
		else
			return true;
	}
}
