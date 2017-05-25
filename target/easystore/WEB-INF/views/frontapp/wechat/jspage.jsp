<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>微信支付</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
<script type="text/javascript">
  	function callpay(){
	  	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() { 
			 WeixinJSBridge.invoke('getBrandWCPayRequest',{
	  		 		"appId" : "${wechatPageInfo.appid}",
	  		 		"timeStamp" : "${wechatPageInfo.timeStamp}", 
	  		 		"nonceStr" : "${wechatPageInfo.nonceStr}", 
	  		 		"package" : "${wechatPageInfo.packageStr}",
	  		 		"signType" : "MD5", 
	  		 		"paySign" : "${wechatPageInfo.sign}" 
	   			},function(res){
					WeixinJSBridge.log(res.err_msg);
	 				//alert(res.err_code + res.err_desc + res.err_msg);
					var result = "";
		            if(res.err_msg == "get_brand_wcpay_request:ok"){  
		                result = 'ok';
		            }else if(res.err_msg == "get_brand_wcpay_request:cancel"){  
		            	result = 'cancel';
		            }else{  
		            	result = 'fail';
		            }  
		            //alert(result);
		            window.location.href = '${front_url}' + "?result=" +  result;
				})
			},false);
		}
	callpay();
  </script>
  </head>
</html>
