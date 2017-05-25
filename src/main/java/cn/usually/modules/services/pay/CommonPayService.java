package cn.usually.modules.services.pay;

import org.nutz.dao.Dao;
import org.nutz.ioc.loader.annotation.IocBean;

import cn.usually.common.base.Service;
import org.nutz.log.Log;
import org.nutz.log.Logs;

/**
 * Created on 2016/12/2.
 */
@SuppressWarnings("rawtypes")
@IocBean(args = {"refer:dao"})
public class CommonPayService extends Service {
	
	private static final Log log = Logs.get();

	public CommonPayService(Dao dao) {
		super(dao);
	}
//
//    /**
//     * 校验订单状态是否成功
//     * @param payParam
//     * @param checkInfo
//     */
//	public void validateIsOrderSuccess(PayParam payParam, CheckInfo checkInfo) {
//		Cnd cnd = Cnd.where("out_trade_no", "=", payParam.getOut_trade_no());
//		if(payParam.getSource_entrance() != null && payParam.getSource_entrance() > 0)
//			cnd = cnd.and("source_entrance", "=", payParam.getSource_entrance());
//		Pay_order_statistics pay_order_statistics = dao().fetch(Pay_order_statistics.class, cnd);
//        if(pay_order_statistics != null && pay_order_statistics.getOrder_status() == ConstantPay.ORDERSTATISTICS_ORDERSTATUS_PAYSUCCESS) {
//        	checkInfo.setFlag(true);
//        	checkInfo.setMsg("该笔订单已支付，请勿重复提交");
//        	log.info("【商户订单号】:" + payParam.getOut_trade_no() + "已支付，请勿重复提交");
//        }
//	}
//
//	/**
//	 * 添加订单
//	 * @param payParam
//	 * @param checkInfo
//	 */
//	public void addPayOrder(PayParam payParam, CheckInfo checkInfo) {
//		// 查询订单是否存在,不存在则添加
//		Pay_order_statistics db_order_statistics = dao().fetch(Pay_order_statistics.class, Cnd.where("out_trade_no", "=", payParam.getOut_trade_no()).and("source_entrance", "=", payParam.getSource_entrance()));
//		if(db_order_statistics == null) {
//			Pay_order_statistics pay_order_statistics = new Pay_order_statistics();
//			pay_order_statistics.setOut_trade_no(payParam.getOut_trade_no());
//			pay_order_statistics.setPayer_name(payParam.getMerchant_name());
//			// 查询收款方配置信息
//			if(ConstantPay.PAYTYPE_ALIPAY == payParam.getPaytype()) { // 支付宝
//				// 查询支付宝配置信息
//				Alipay_config alipayConfig = dao().fetch(Alipay_config.class);
//				pay_order_statistics.setPayee_name(alipayConfig.getPartner_name());
//            }else if(ConstantPay.PAYTYPE_WECHAT == payParam.getPaytype()) { // 微信
//            	// 查询微信配置信息
//            	Wx_config wxconfig = dao().fetch(Wx_config.class);
//            	pay_order_statistics.setPayee_name(wxconfig.getAppname());
//            }else if(ConstantPay.PAYTYPE_UNION == payParam.getPaytype()) { // 银联
//            	// 查询银配置信息
//            	Union_config union_config = dao().fetch(Union_config.class);
//            	pay_order_statistics.setPayee_name(union_config.getMerName());
//            }
//			pay_order_statistics.setAmount(payParam.getAmount());
//			pay_order_statistics.setCreatetime(DateUtil.getDateTime());
//			pay_order_statistics.setOrder_status(ConstantPay.ORDERSTATISTICS_ORDERSTATUS_UNPAY);
//			pay_order_statistics.setPayment(payParam.getPaytype());
//			pay_order_statistics.setFront_url(payParam.getFront_url());
//			pay_order_statistics.setNotify_url(payParam.getNotify_url());
//			pay_order_statistics.setSource_entrance(payParam.getSource_entrance());
//			pay_order_statistics.setSubject_name(payParam.getSubject_name());
//			pay_order_statistics.setOpAt((int) (System.currentTimeMillis() / 1000));
//			pay_order_statistics.setDelFlag(false);
//			dao().insert(pay_order_statistics);
//			log.info("订单插入成功：【商户订单号】：" + payParam.getOut_trade_no() + ";【来源】：" + payParam.getSource_entrance());
//		}else
//			log.info("订单已存在，无需做插入操作：【商户订单号】：" + payParam.getOut_trade_no() + ";【来源】：" + payParam.getSource_entrance());
//	}
//
//	/**
//	 * 更新订单为成功状态
//	 * @param pay_order_statistics
//	 * @param checkInfo
//	 */
//	public Pay_order_statistics updateOrderPaySuccess(Pay_order_statistics pay_order_statistics, CheckInfo checkInfo) {
//		// 查询订单
//		Pay_order_statistics db_order_statistics = dao().fetch(Pay_order_statistics.class, Cnd.where("out_trade_no", "=", pay_order_statistics.getOut_trade_no()));
//		if(db_order_statistics != null) {
//			db_order_statistics.setTrade_no_third(pay_order_statistics.getTrade_no_third());
//			db_order_statistics.setPaytime(pay_order_statistics.getPaytime());
//			db_order_statistics.setOrder_status(pay_order_statistics.getOrder_status());
//			db_order_statistics.setPayment(pay_order_statistics.getPayment());
//			// 更新操作
//			dao().updateIgnoreNull(db_order_statistics);
//			checkInfo.setFlag(true);
//			log.info("订单更新成功：【商户订单号】：" + db_order_statistics.getOut_trade_no() + ";【本地订单主键】：" + db_order_statistics.getId());
//		}else
//			log.info("订单查找失败：【商户订单号】：" + pay_order_statistics.getOut_trade_no());
//		return db_order_statistics;
//	}
//
//	/**
//	 * 异步通知客户端机器
//	 * @param update_order_statistics
//	 */
//	public void notifyCustomMachine(Pay_order_statistics pay_order_statistics) {
//		String notify_url = pay_order_statistics.getNotify_url();
//		try {
//			if(Strings.isNotNullOrEmpty(notify_url)) {
//				// 建立连接
//				URL url = new URL(notify_url);
//				HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
//				// 设置连接属性
//				httpConn.setDoOutput(true); // 使用 URL 连接进行输出
//				httpConn.setDoInput(true); // 使用 URL 连接进行输入
//				httpConn.setUseCaches(false); // 忽略缓存
//				httpConn.setRequestMethod("POST"); // 设置URL请求方法
//				// 传输
//				String parameterData = "out_trade_no=" + pay_order_statistics.getOut_trade_no() + "&trade_status=" + ConstantPay.PAY_SUCCESS + "&amount=" + pay_order_statistics.getAmount();
//				OutputStream os = httpConn.getOutputStream();
//				os.write(parameterData.getBytes());
//				os.flush();
//				// 响应
//				if (httpConn.getResponseCode() == HttpURLConnection.HTTP_OK) {
//					BufferedReader br = new BufferedReader(new InputStreamReader((httpConn.getInputStream())));
//					String result = "";
//					String data;
//					while ((data = br.readLine()) != null) {
//						result = Strings.isNullOrEmpty(data) ? result : result + data;
//						log.info("异步通知时，客户端商户号【" + pay_order_statistics.getOut_trade_no() + "】返回当前行信息:" + result);
//					}
//					log.info("异步通知时，客户端商户号【" + pay_order_statistics.getOut_trade_no() + "】返回总信息:" + result);
//					// 如果客户端返回已处理成功,则不再异步通知
//					Integer notify_num = pay_order_statistics.getNotify_num();
//					pay_order_statistics.setNotify_num(notify_num + 1);
//					if(Strings.isNotNullOrEmpty(result) && ConstantPay.CUSTOMBACK_SUCCESSINFO.equals(result)) {
//						if(notify_num != null && notify_num >= 0) {
//							pay_order_statistics.setFlag_backsuccess(ConstantPay.ORDERSTATISTICS_FLAGBACKSUCCESS);
//						}
//					}
//					// 更新操作
//					dao().updateIgnoreNull(pay_order_statistics);
//					log.info("异步通知客户端机器成功:【商户订单号】:" + pay_order_statistics.getOut_trade_no() + ";客户端返回信息output:" + result);
//				} else
//					log.info("Failed : HTTP error code : " + httpConn.getResponseCode());
//				httpConn.disconnect();
//			}else {
//				log.info("获取商户号:" + pay_order_statistics.getOut_trade_no() + "所涉及notify_url为空");
//			}
//		} catch (Exception e) {
//			e.printStackTrace();
//			log.info("异步通知客户端异常，相关商户号:" + pay_order_statistics.getOut_trade_no());
//		}
//	}
//
//	/**
//	 * 查找最大推送次数
//	 * @return
//	 */
//	public int getNotifyOrderMaxnum() {
//		String notifyOrderMaxnum = Globals.MyConfig.get("NotifyOrderMaxnum");
//		log.info("获取最大异步通知客户端次数:" + notifyOrderMaxnum);
//		if(Strings.isNotNullOrEmpty(notifyOrderMaxnum))
//			return Integer.valueOf(notifyOrderMaxnum);
//		else
//			return Globals.NotifyOrderMaxnum;
//	}
//
//	/**
//	 * 异步通知客户端
//	 * @param taskId
//	 * @return
//	 */
//	public void notifyOrder(String taskId) {
//		 // 查找最大推送次数
//        int max_num = getNotifyOrderMaxnum();
//        // 分页查询所有订单
//        int count = dao().count(Pay_order_statistics.class, Cnd.where("order_status", "=", ConstantPay.ORDERSTATISTICS_ORDERSTATUS_PAYSUCCESS)
//        											.and("notify_num","<",max_num).and("flag_backsuccess", "<>", 1));
//        // 分批通知t
//        if(count > 0) {
//        	 Pager pager = new Pager();
//             pager.setRecordCount(count);
//             pager.setPageSize(ConstantPay.NOTIFYORDER_EVERYNUM);
//             int total_repeat = count % ConstantPay.NOTIFYORDER_EVERYNUM == 0 ? count % ConstantPay.NOTIFYORDER_EVERYNUM : (count / ConstantPay.NOTIFYORDER_EVERYNUM) + 1;
//             for(int i = 1; i <= total_repeat; i++) {
//            	 pager.setPageNumber(i);
//            	 List<Pay_order_statistics> order_list =  dao().query(Pay_order_statistics.class,
//            			 												Cnd.where("order_status", "=", ConstantPay.ORDERSTATISTICS_ORDERSTATUS_PAYSUCCESS)
//																			.and("notify_num","<",max_num).and("flag_backsuccess", "<>", 1), pager);
//            	 if(order_list != null) {
//            		 // 对每条订单异步通知客户端
//            		 for(Pay_order_statistics pay_order_statistics : order_list)
//                		 notifyCustomMachine(pay_order_statistics);
//            	 }
//             }
//          // 最后修改时间
//          dao().update(Sys_task.class, Chain.make("exeAt", (int) (System.currentTimeMillis() / 1000)).add("exeResult", "执行成功"), Cnd.where("id", "=", taskId));
//        }
//	}
//
//	/**
//	 * 解码对象
//	 * @param obj
//	 * @return
//	 */
//	@SuppressWarnings("deprecation")
//	public Object decodeParamObject(Object obj) {
//		Object obj_return = null;
//		if(obj instanceof PayParam) {
//			PayParam source_obj = (PayParam) obj;
//			PayParam payParam = new PayParam();
//			payParam.setOut_trade_no(URLDecoder.decode(source_obj.getOut_trade_no()));
//			if(Strings.isNotNullOrEmpty(source_obj.getMerchant_name())) {
//				payParam.setMerchant_name(URLDecoder.decode(source_obj.getMerchant_name()));
//			}else
//				payParam.setMerchant_name("");
//			if(Strings.isNotNullOrEmpty(source_obj.getSubject_name())) {
//				payParam.setSubject_name(URLDecoder.decode(source_obj.getSubject_name()));
//			}else
//				payParam.setSubject_name("");
//			payParam.setAmount(Double.valueOf(URLDecoder.decode(String.valueOf(source_obj.getAmount()))));
//			payParam.setPaytype(Integer.valueOf(URLDecoder.decode(String.valueOf(source_obj.getPaytype()))));
//			payParam.setFront_url(URLDecoder.decode(source_obj.getFront_url()));
//			payParam.setNotify_url(URLDecoder.decode(source_obj.getNotify_url()));
//			payParam.setSource_entrance(Integer.valueOf(URLDecoder.decode(String.valueOf(source_obj.getSource_entrance()))));
//			obj_return = payParam;
//		}
//		return obj_return;
//	}

}
