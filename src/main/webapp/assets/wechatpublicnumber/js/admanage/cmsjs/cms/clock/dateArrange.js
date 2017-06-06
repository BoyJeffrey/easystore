var clockSetTablePageConfig;
var parame="";
//编辑页面初始化
function onloadClockInfo(){
	//获取日常版信息
//	$("#clockSetTable").find("input[type='text']").each(function(i,e1){
//		 var hiddenInputId=$(this).parent().find("input[type='hidden']").attr("id");
//		 clockSetTablePageConfig=associativeQuery.selectClockIdkAssociative($(this).attr("id"), hiddenInputId,collectData);
//	});
//	function collectData(key, data) {
//	}
	 clockSetTablePageConfig=associativeQuery.selectClockIdkAssociative("1_1", "1_1_clockId",collectData);//第一个文本框加载联想
	
	 //页面验证
	$("#saveBtn").click(function(){
		var flag=validatClock();
		if(flag){
				setClockIdInfo();//设置clock值
			 	$.ajax({
					type : "post",
					url : ctx+"/clock/dateArrangeInput.do",
					data : $('#inputForm').serialize(),
					dataType : "json",
					async : true,
					cache : false,
					success : function(data){
					if(data.success){
						myDialog.showAlert("保存成功！",function(){
								openRight2(ctx+'/clock/dateArrange.do?'+parame);
							});
					    }
					},
					error : function(){
							myDialog.showAlert("保存失败！",function(){
				   				$(this).removeAttr('disabled');
				   			});
					}
				});
		}
	  });
	parame="radioId="+$("#radioId").val()+'&radioType='+$("#radioType").val()+'&compareId='+$("#compareId").val();
}
//加载配置信息
function setInputText(obj){
	 var hiddenInputId=$(obj).parent().find("input[type='hidden']").attr("id");
	 clockSetTablePageConfig=associativeQuery.selectClockIdkAssociative($(obj).attr("id"), hiddenInputId,collectData);
}
function collectData(key, data) {
}
//验证clock版本信息
function validatClock(){
  var flag=true;
  var clockIdTablePageConfig="";
  for (var i = 0; i <  clockSetTablePageConfig.dataArray.length; ++ i) {
	  clockIdTablePageConfig=clockIdTablePageConfig+clockSetTablePageConfig.dataArray[i].id+",";
	}
   $("#clockSetTable").find("input[type='hidden']").each(function(i,e1){//循环遍历id值
	   var inputColockIdArr=$(this).attr("id").split("_");
	   if($(this).val()==""){
		   alert("第"+inputColockIdArr[0]+"行第"+inputColockIdArr[1]+"列值不能为空，请重新选择");
		   $(this).next().focus();
		   flag=false;
		   return flag;
	   }
	   if(clockIdTablePageConfig.indexOf($(this).val())<0){
			   alert("第"+inputColockIdArr[0]+"行第"+inputColockIdArr[1]+"列值不存在，请重新选择");
			   $(this).next().focus();
			   flag=false;
			  return flag;
	   }
   });
   return flag;
}

//保存设置clock日期编排
function setClockIdInfo(){
	  var clockIdArr="";
	  $("#clockSetTable").find("input[type='hidden']").each(function(i,e1){//循环遍历id值
		  var trText=$(this).parent().parent().find("td").eq(0).html();
		  var tdText=$(this).attr("id").split("_")[1];
		  clockIdArr=clockIdArr+trText+"_"+tdText+"_"+$(this).val()+",";
	  });
	  if(clockIdArr!=""){
		  clockIdArr=clockIdArr.substring(0,clockIdArr.length-1);
	  }
	  $("#clockIdArr").val(clockIdArr);
}
//复制
function copyClock(obj){
	var copyId=parseInt($(obj).attr("copyId"));
	$("#clockSetTable").find("td").each(function(i,e1){
		var tdId=$(this).find("input[type='text']").attr("id");
		if(tdId!=null){
			var tempTdId=parseInt(tdId.split("_")[1]);
			if(tempTdId==copyId){
				$(this).find("input[type='hidden']").val($(this).prev().find("input[type='hidden']").val());
				$(this).find("input[type='text']").val($(this).prev().find("input[type='text']").val());
			}
		}
	});
}


