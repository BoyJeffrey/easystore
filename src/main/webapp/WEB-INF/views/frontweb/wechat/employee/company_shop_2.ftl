<!DOCTYPE html>
<html lang="zh">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
    <title>易民新便利</title>
    <script type="text/javascript">
    	var openid 		= ${open_id};
    	var companyid 	= ${company_id};

    	if(!openid){

    		var showcompanyproduct = encodeURIComponent("http://www.newworklife.cn/easystore_wechat/employee/company_shop_from_scan?companyid=${company_id}");

            window.location.href ='https://open.weixin.qq.com/connect/oauth2/authorize?appid=${app_id}&redirect_uri='+showcompanyproduct+'&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
    	}

    </script>
</head>
<body>

	<p>请求结果代码：${code}</p>
	<p>请求结果描述：${codestring}</p>

</body>
</html>
