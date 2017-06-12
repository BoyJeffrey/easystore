/**用户设备管理list中的方法**/
function onloadGrid(){
	jQuery("#myList").jqGrid({
	   	url:ctx+'/usr/list/forJson.do',
		datatype: "json",
		jsonReader:{
				root: "result",
				page: "pageBean.page",
				total: "pageBean.pages",
				records: "pageBean.count",
				repeatitems: true,
		},
	   	colNames:['UID账号','注册方式','手机号', '系统平台','最近使用时间'],
	   	colModel:[
	   		{name:'uidNum',index:'uidNum',align:"center"},
	   		{name:'registerWay',index:'registerWay', formatter:function( cellval, rowModel , rowData){
	   			return cellval=='0'?'手机号':'第三方账号'	;
	   		},align:"center"},
	   		{name:'tel',index:'tel',align:"center"},
	   		{name:'platform',index:'platform', formatter:function( cellval, rowModel , rowData){
	   		    var returnVal="";
	   		    if(cellval==0){
	   		    	returnVal="Android";
	   		    }else if(cellval==1){
	   		    	returnVal="IOS";
	   		    }else{
	   		    	returnVal="Android、IOS";
	   		    }
	   			return returnVal;
	   		},align:"center"},
	   		{name:'androidRecentlyTime',index:'androidRecentlyTime',formatter:function( cellval, rowModel , rowData){
	   			var maxVal=compareTime(cellval,rowData.iosRecentlyTime);
	   			return maxVal;
	   		},align:"center"}
	   	],
	   	height:"auto",
	   	rowNum:20,
	   	rowList:[20,50,100],
	   	pager: '#myPager',
	   	sortname: 'id',
	   	multiselect:true,
	    viewrecords: true,
	    sortorder: "desc",
	    prmNames: {page:"pageNum",rows:"pageSize"},
	    caption:"JSON Example",
	    onPaging:function(){
	    	window.parent.document.documentElement.scrollTop= 0;//页面滚动条处于最顶端
			window.parent.document.body.scrollTop= 0;//谷歌
	    }
	});
	jQuery("#myList").jqGrid('navGrid','#myPager',{edit:false,add:false,del:false});
	$("#myList").setGridWidth($(".usermain").width()*1);
	 //查询
	$("#queryBtn").bind("click", function() {  
		var registerWay=$("#registerWay").val();
		var platform=$("#platform").val();
		var uidNum=$("#uidNum").val();
		var tel=$("#tel").val();
		if(registerWay=="注册方式")
			registerWay=null;
		if(uidNum=="UID")
			uidNum=null;
		if(tel=="手机号")
			tel=null;
	   var paramtersData = {  
	       "startTime" : $("#startTime").val(),
	       "endTime" : $("#endTime").val(),
	       "registerWay" : registerWay, 
	       "platform" :platform,      
	       "uidNum" : uidNum, 
	       "tel" : tel
	   };  
	   var postData = $("#myList").jqGrid("getGridParam", "postData");  
	   $.extend(postData, paramtersData);  
	   $("#myList").jqGrid("setGridParam", {search: true}).trigger("reloadGrid", [{page:1}]);  
	}); 

	
	//搜索失去焦点
	$("#tel").live("focus",function(){
		if($(this).val()=="手机号"){
			$(this).val("");	
		}
	});
	$("#tel").live("blur",function(){
		if($(this).val()==""){
			$(this).val("手机号");	
		}
	});
	
	//搜索失去焦点
	$("#uidNum").live("focus",function(){
		if($(this).val()=="UID"){
			$(this).val("");	
		}
	});
	$("#uidNum").live("blur",function(){
		if($(this).val()==""){
			$(this).val("UID");	
		}
	});
}

//获取最大时间
function compareTime(beginTime,endTime) {
	if(beginTime!=null&&endTime!=null){
		 var beginTimes = beginTime.substring(0, 10).split('-');
		    var endTimes = endTime.substring(0, 10).split('-');
		    beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
		    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
		    var a = beginTime-endTime;
		    if (a < 0) {
		        return secondToDate(endTime);
		    } else if (a > 0) {
		        return secondToDate(beginTime);
		    } else if (a == 0) {
		    	 return secondToDate(beginTime);
		    } else {
		        return "";
		    }
	}else if(beginTime!=null&&endTime==null){
		return secondToDate(beginTime);
	}else if(beginTime==null&&endTime!=null){
		return secondToDate(endTime);
	}else if(beginTime==null&&endTime==null){
		return "";
	}
}

//秒时间转换
function secondToDate(tempDateTime){
	var newTime = new Date(tempDateTime); //就得到普通的时间了 
	newTime= newTime.Format("yyyy-MM-dd hh:mm:ss");  //js时间转换格式
	return newTime;
}


//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
//例子： 
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
 var o = {
     "M+": this.getMonth() + 1, //月份 
     "d+": this.getDate(), //日 
     "h+": this.getHours(), //小时 
     "m+": this.getMinutes(), //分 
     "s+": this.getSeconds(), //秒 
     "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
     "S": this.getMilliseconds() //毫秒 
 };
 if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
 for (var k in o)
 if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
 return fmt;
}
