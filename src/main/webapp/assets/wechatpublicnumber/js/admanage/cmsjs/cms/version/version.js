/**版本更新list中的方法**/
var parame="";
function onloadVersionGrid(){
	jQuery("#myList").jqGrid({
	   	url:ctx+'/version/list/forJson.do',
		datatype: "json",
		jsonReader:{
				root: "result",
				page: "pageBean.page",
				total: "pageBean.pages",
				records: "pageBean.count",
				repeatitems: true,
		},
	   	colNames:[ '名称','状态', '适用平台','渠道','预升级版本','升级到版本','升级形式','生效时间','操作'],
	   	colModel:[
	   		{name:'versionName',index:'versionName',align:"center"},
	   		{name:'status',index:'status', formatter:function( cellval, rowModel , rowData){
	   			return cellval=='1'?'启用':'暂停'	;
	   		},align:"center",width:"65px"},
	   		{name:'platform',index:'platform', formatter:function( cellval, rowModel , rowData){
	   			return cellval=='0'?'Android':'IOS'	;
	   		},align:"center"},
	   	
	   		{name:'channelsArr',index:'channelsArr', formatter:function( cellval, rowModel , rowData){
	   		    var returnVal="所有";
	   		    if(cellval!=null){
	   		    	returnVal=cellval;
	   		    }
	   			return returnVal;
	   		},align:"center"},
	   		{name:'versionsArr',index:'versionsArr',align:"center"},
	   		{name:'targetVersionName',index:'targetVersionName',align:"center"},
	   		{name:'type',index:'type', formatter:function( cellval, rowModel , rowData){
	   			return cellval=='0'?'非强制升级':'强制升级'	;
	   		},align:"center"},
	   		{name:'effectiveBeginTimeStr',index:'effectiveBeginTimeStr',align:"center"},	
	   		{name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
	   		   var temp='<a href="javascript:void(0)" onclick="startOrPause(\''+cellval+'\',2)" title="暂停" >暂停</a>';
	   			if(rowData.status==2){
	   				temp='<a href="javascript:void(0)" onclick="startOrPause(\''+cellval+'\',1)" title="启用" >启用</a>';
	   			}
	   			return '<div>'+
	   					temp+
		            	'<a href="javascript:void(0)" onclick="delRecord(\''+cellval+'\')" title="删除" >删除</a>'+
	            	 	'<a href="javascript:void(0)" class="_editBtn" recordId="'+cellval+'" title="编辑" >编辑</a>'+
	            	 	'<a href="javascript:void(0)" onclick="showdiary(this,\''+cellval+'\')" title="日志" >日志</a>'+
		            '</div>';
	   		},align:"center",width:"240px"}	
	   	],
	   	height:"auto",
	   	page:$("#pageNum").val()?$("#pageNum").val():1,
	    rowNum:$("#pageSize").val()?$("#pageSize").val():20,
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
	var pageNum=$("#myList").jqGrid('getGridParam','page');
	var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
	parame='pageNum='+pageNum+'&pageSize='+pageSize;

	jQuery("#myList").jqGrid('navGrid','#myPager',{edit:false,add:false,del:false});
	$("#myList").setGridWidth($(".usermain").width()*1);
	 //查询
	$("#queryBtn").bind("click", function() {  
	   var paramtersData = {  
	       "platform" : $("#platform").val(),
	       "status" : $("#status").val(),
	       "type" : $("#type").val(),
	       "versionName" : $("#versionName").val()      
	   };  
	   var postData = $("#myList").jqGrid("getGridParam", "postData");  
	   $.extend(postData, paramtersData);  
	   $("#myList").jqGrid("setGridParam", {search: true}).trigger("reloadGrid", [{page:1}]);  
	   var pageNum=$("#myList").jqGrid('getGridParam','page');
	   var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
	   parame='pageNum='+pageNum+'&pageSize='+pageSize;
	}); 
	 $("#myList").on('click','._editBtn',function(){
		   var pageNum=$("#myList").jqGrid('getGridParam','page');
		   var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
		   parame='pageNum='+pageNum+'&pageSize='+pageSize;
		   openRight2(ctx+'/version/update.do?id='+$(this).attr('recordId')+"&"+parame);
		});
}
//删除方法
function delRecord(id){
	var pageNum=$("#myList").jqGrid('getGridParam','page');
	var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
	parame='pageNum='+pageNum+'&pageSize='+pageSize;
    if(confirm("此操作会将彻底删除选中的记录，删除后不能恢复，您确定吗？")){
	    if(id!=null){
	    	$.ajax({
				type : "get",
				url : ctx+"/version/delete.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("删除成功！",function(){
							openRight2(ctx+'/version/list.do?'+parame);
						});
				    }else{
				    	myDialog.showAlert("删除失败！");
				    }
				},
				error : function(){
					myDialog.showAlert("删除失败！");
				}
			});
	    }
	}
}
//批量删除
function batchdelete(){
    var records = $("#myList").jqGrid('getGridParam','selarrrow');;
    if (records.length < 1) {
        myDialog.showAlert("请至少选择一条记录！");
        return null;
    } else  {
				delRecord(records);
    }
} 

//暂停或者显示
function startOrPause(id,status){
	var pageNum=$("#myList").jqGrid('getGridParam','page');
	var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
	parame='pageNum='+pageNum+'&pageSize='+pageSize;
	myDialog.showConfirm("确定操作该记录吗？",function(){
	    if(id!=null){
	    	$.ajax({
				type : "get",
				url : ctx+"/version/startOrPause.do?ids="+id+"&status="+status,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						if(status==2)
							myDialog.showAlert("暂停成功！",function(){
								openRight2(ctx+'/version/list.do?'+parame);
							});
						else
							myDialog.showAlert("启用成功！",function(){
								openRight2(ctx+'/version/list.do?'+parame);
							});
				    }else{
					    if(status==2)
					    	myDialog.showAlert("暂停失败！");
						else
							myDialog.showAlert("启用失败！");
				    }
				},
				error : function(){
				
				}
			});
	    }
	});
}
//批量暂停或者启动
function batchdStartOrPause(status){
    var records = $("#myList").jqGrid('getGridParam','selarrrow');;
    if (records.length < 1) {
        myDialog.showAlert("请至少选择一条记录！");
        return null;
    } else  {
				startOrPause(records,status);
    }
} 
//日志显示
function showdiary(obj,dataId){
var url = ctx+"/version/operations.do?dataId="+dataId;
$(".tips").load(url,function(){
	diary(obj);
});
}

/**以下是新增和编辑页面的js**/

//新增初始化页面
function onloadAddPage(){
	parame='pageNum='+$("#pageNum").val()+'&pageSize='+$("#pageSize").val();
	//ios和andriod指定渠道和版本
	onloadChannleRadio();
	  //页面验证
   	var valid = new Validation('inputForm',{immediate:true,useTitles:true});
	$("#addSaveBtn").click(function(){
	  	saveBeforSet();
		if(valid.validate()){
			    var flag=validateSave();
			    if(flag){
			    	$.ajax({
						type : "post",
						url : ctx+"/version/addInput.do",
						data : $('#inputForm').serialize(),
						dataType : "json",
						async : true,
						cache : false,
						success : function(data){
						if(data.success){
								myDialog.showAlert("创建成功！",function(){
									openRight2(ctx+'/version/list.do?'+parame);
								});
								
						    }
						},
						error : function(){
								myDialog.showAlert("创建失败！",function(){
					   				$(this).removeAttr('disabled');
					   			});
						}
					});
			    }else{
			    	myDialog.showAlert("预升级版本号大于等于升级版本号，请重新选择！");
			    }
		}
	  });
	//绑定andriod版本事件
	$("#andriodTargetVersion").click(function(){
		getAddress(1);
	});
}


function myError(responseText, statusText){
	myDialog.showAlert("操作失败！");
}
function showRequest(formData, jqForm, options) { 
    var queryString = $.param(formData); 
    myDialog.showAlert('About to submit: \n\n' + queryString);
    return true; 
}
function showResponse(responseText, statusText)  { 
	openRight2(ctx+'/version/list.do?'+parame);
} 
//全选
function allSelect(obj,divId){
		$(obj).parent().parent().find("input").attr("checked","checked");
		oncheckBox(obj,divId);
}
//取消全选
function delSelect(obj,divId){
		$(obj).parent().parent().find("input").removeAttr("checked");
		oncheckBox(obj,divId);
}	
//ios和andriod平台
function selectPlatform(obj,casid){
	 var isinput = $(obj).is(":checked");
	 if(isinput == true){
	 	$(".selectabcont1").hide();
	 	$(".selectabcont2").hide();
		$(obj).parents(".userlist").find(casid).show(); 
		if(casid.indexOf("selectabcont2")>=0){//判断是否是安卓
				var selectVal=$(".selectabcont2").find("input[name='androidChannel']:checked").val();
				if(selectVal=="1"){
					$("#putTacticsDiv").hide();
					$("#android-channel-validate").attr("value","checked");
					$("#android-channel-validate").next().hide();
				}else{
					$("#putTacticsDiv").show();
					validateAndroidChannel(1)
				}
			  getAddress(0);
			  var versionsArr=$(".selectabcont2").find("input[name='versionsArr']:checked");
			  if(versionsArr.length==0){
			  	$("#anroid-version-validate").attr("value","");
			  }
			  $("#ios-version-validate").attr("value","checked");
			  checkPutTactics(1);//判断实施策略是否被选中
			  $("#ios-channel-validate").attr("value","checked");
			  $("#ios-channel-validate").next().hide();
			}else{//判断是否是ios
				  var versionsArr=$(".selectabcont1").find("input[name='versionsArr']:checked");
				  if(versionsArr.length==0){
				  	$("#ios-version-validate").attr("value","");
				  }
					$("#anroid-version-validate").attr("value","checked");
					$("#put-tactics-validate").attr("value","checked");
					$("#put-tactics-validate").next().hide();
					var selectVal=$(".selectabcont1").find("input[name='iosChannel']:checked").val();
					if(selectVal=="1"){//判断渠道是否是所有
						$("#ios-channel-validate").attr("value","checked");
						$("#ios-channel-validate").next().hide();
					}else{
						validateIosChannel(1);
					}
					
					$("#android-channel-validate").attr("value","checked");
					$("#android-channel-validate").next().hide();
			}
	 }else{
	 	$(".selectabcont1").hide();
	 	$(".selectabcont2").hide();
		$(obj).parents(".userlist").find(casid).hide();
	 }
}
//保存前设置值
function saveBeforSet(){
	var checkedPlate=$("#platformDiv").find("input[name='platform']:checked").val();
	var selectabcont1=$(".selectabcont1");
	var selectabcont2=$(".selectabcont2");
	if(checkedPlate==0){//判断平台类型是否是安卓
		var radioVal=$(selectabcont2).find("input[name='androidChannel']:checked").val();//获取安卓渠道号
		if(radioVal=="1"){//判断是否是所有渠道
			$(selectabcont2).find("input[name='channelsArr']").removeAttr("checked");
		}
		$(selectabcont1).find("input[name='channelsArr']").removeAttr("checked");//删除IOS渠道复选框
		$(selectabcont1).find("input[name='versionsArr']").removeAttr("checked");//删除IOS版本复选
		var targetVersion=$("#andriodTargetVersion").find("option:selected").val();//获取升级到的版本号
		$("#targetVersion").val(targetVersion);
		var iosVersionSelect=$("#iosTargetVersion").find("option").eq(1);//获取ios版本对象
		$(iosVersionSelect).attr("selected","selected");
		$(iosVersionSelect).parent().parent().find(".selectxt").val($(iosVersionSelect).text());
		var putTacticsDiv=$("#putTacticsDiv").find("input[name='inputPutTactics']:checked");
		if(putTacticsDiv.length==2){
			$("#putTactics").val(2);//设置实施策略
		}else{
			$(putTacticsDiv).each(function(){
				$("#putTactics").val($(this).val());
			});
		}
		
	}else{//判断平台类型是否是ios
		var radioVal=$(selectabcont1).find("input[name='iosChannel']:checked").val();//获取安卓渠道号
		if(radioVal=="1"){//判断是否是所有渠道
			$(selectabcont1).find("input[name='channelsArr']").removeAttr("checked");
		}
		$(selectabcont2).find("input[name='channelsArr']").removeAttr("checked").val();//删除安卓渠道复选框
		$(selectabcont2).find("input[name='versionsArr']").removeAttr("checked");//删除安卓版本复选
		
		var androidVersionSelect=$("#andriodTargetVersion").find("option").eq(1);//获取ios版本对象
		$(androidVersionSelect).attr("selected","selected");
		$(androidVersionSelect).parent().parent().find(".selectxt").val($(androidVersionSelect).text());
		
		var targetVersion=$("#iosTargetVersion").find("option:selected").val();//获取升级到的版本号
		$("#targetVersion").val(targetVersion);
		$("#putTactics").val("");//设置实施策略
	}
}

//获取下载地址 optionType操作类型，0切类型加载，1下拉框切换加载
function getAddress(optionType){
		 var androidSelect=$("#andriodTargetVersion").find("option").eq(1);
	      if(optionType==1){
	    	  androidSelect=$("#andriodTargetVersion").find("option:selected");
	      }else{
	    	  $(androidSelect).attr("selected","selected");
			  $(androidSelect).parent().parent().find(".selectxt").val($(androidSelect).text());
	      }
		   var versionNum=$(androidSelect).val();
		    if(versionNum!=""){
		    	$.ajax({
					type : "get",
					url : ctx+"/version/getAddress.do?versionNum="+versionNum,
					data : "",
					dataType : "json",
					async : true,
					cache : false,
					success : function(data){
					debugger;
					   if(data!=null){
					   		$(".tipsColor").html("下载地址："+wsBaseUrl+data.apkUrl);
					  		$("#url").val(data.id);
					   }
					},
					error : function(){
					
					}
				});
		    }
}
//选择校验
function oncheckBox(obj,casid){
    if(casid!=null){
    		var length=$(obj).parent().parent().find("input[name='channelsArr']").length;
    		if(length>0){//判断是否是选中渠道信息
    			getChannleInfo(casid);
    		}else{
    			getVersionInfo(casid);
    		}
			
		}
}
function getChannleInfo(casid){
	if(casid.indexOf("selectabcont2")>=0){//判断是否是安卓
			 var channelsArr=$(".selectabcont2").find("input[name='channelsArr']:checked");
			  if(channelsArr.length==0){
			  	$("#android-channel-validate").attr("value","");
			  	$("#android-channel-validate").next().show();
			  }else{
			  	 $("#android-channel-validate").attr("value","checked");
			  	 $("#android-channel-validate").next().hide();
			  }
			  $("#ios-channel-validate").attr("value","checked");
		}else{
			var channelsArr=$(".selectabcont1").find("input[name='channelsArr']:checked");
			  if(channelsArr.length==0){
			  	$("#ios-channel-validate").attr("value","");
			  	$("#ios-channel-validate").next().show();
			  }else{
			  	$("#ios-channel-validate").attr("value","checked");
			  	$("#ios-channel-validate").next().hide();
			  }
			$("#android-channel-validate").attr("value","checked");
		}
}
function getVersionInfo(casid){
	if(casid.indexOf("selectabcont2")>=0){//判断是否是安卓
			 var versionsArr=$(".selectabcont2").find("input[name='versionsArr']:checked");
			  if(versionsArr.length==0){
			  	$("#anroid-version-validate").attr("value","");
			  	$("#anroid-version-validate").next().show();
			  }else{
			  	 $("#anroid-version-validate").attr("value","checked");
			  	 $("#anroid-version-validate").next().hide();
			  }
			  $("#ios-version-validate").attr("value","checked");
		}else{
			var versionsArr=$(".selectabcont1").find("input[name='versionsArr']:checked");
			  if(versionsArr.length==0){
			  	$("#ios-version-validate").attr("value","");
			  	$("#ios-version-validate").next().show();
			  }else{
			  	$("#ios-version-validate").attr("value","checked");
			  	$("#ios-version-validate").next().hide();
			  }
			$("#anroid-version-validate").attr("value","checked");
		}
}
//修改页面初始化方法
function onloadUpdatePage(){
	parame='pageNum='+$("#pageNum").val()+'&pageSize='+$("#pageSize").val();
	//ios和andriod指定渠道和版本
	onloadChannleRadio();
	  //页面验证
   	var valid = new Validation('inputForm',{immediate:true,useTitles:true});
	$("#updateSaveBtn").click(function(){
	  	saveBeforSet();
		if(valid.validate()){
			 var flag=validateSave();
			    if(flag){
				 	$.ajax({
						type : "post",
						url :  ctx+"/version/updateInput.do",
						data : $('#inputForm').serialize(),
						dataType : "json",
						async : true,
						cache : false,
						success : function(data){
						if(data.success){
								myDialog.showAlert("修改成功！",function(){
									openRight2(ctx+'/version/list.do?'+parame);
								});
						    }
						},
						error : function(){
								myDialog.showAlert("修改失败！",function(){
									openRight2(ctx+'/version/list.do?'+parame);
								});
						}
					});
			    }else{
			    	myDialog.showAlert("预升级版本号大于等于升级版本号，请重新选择！");
			    }
		}
	  });
	//绑定andriod版本事件
	$("#andriodTargetVersion").click(function(){
		getAddress(1);
	});
}
//检查实施策略是否被选中  0:选择实施策略时触发，1：选择平台类型时触发
function checkPutTactics(optionType){
	var length=$("#putTacticsUl").find("li").find("input[name='inputPutTactics']:checked").length;
	if(length==0){
		$("#put-tactics-validate").attr("value","");
		if(optionType==0){
			$("#put-tactics-validate").next().show();
		}
	}else{
		$("#put-tactics-validate").attr("value","checked");
		if(optionType==0){
			$("#put-tactics-validate").next().hide();
		}
		
	}
}
//校验ios渠道
function validateIosChannel(optionType){
	 var channelsArr=$(".selectabcont1").find("input[name='channelsArr']:checked");
	  if(channelsArr.length==0){
	  	$("#ios-channel-validate").attr("value","");
	  	if(optionType==0){
	  		$("#ios-channel-validate").next().show();
		}
	  }else{
		  $("#ios-channel-validate").attr("value","checked");
		  if(optionType==0){
			  $("#ios-channel-validate").next().hide();
			}
	  }
	 
}

//校验android渠道
function validateAndroidChannel(optionType){
	 var channelsArr=$(".selectabcont2").find("input[name='channelsArr']:checked");
	  if(channelsArr.length==0){
	  	$("#android-channel-validate").attr("value","");
	  	 if(optionType==0){
			  $("#android-channel-validate").next().show();
			}
	  }else{
		  $("#android-channel-validate").attr("value","checked");
		  if(optionType==0){
			  $("#android-channel-validate").next().hide();
			}
	  }
	
}
//加载渠道radio
function onloadChannleRadio(){
	$(".appoint").find("input[type='radio']").change(function(){
		var txt=$(this).next("span").text();	
		var vl=$(this).val();
		if(vl==0){
			$(this).parent().parent().next(".splashAll").show();
		}else{
			$(this).parent().parent().next(".splashAll").hide();
		}
		if($(this).attr("name").indexOf("androidChannel")>=0){
					if(vl=="0"){
						$("#putTacticsDiv").show();
						checkPutTactics(1);
						validateAndroidChannel(1);
					}else{
						$("#putTacticsDiv").hide();
						$("#put-tactics-validate").attr("value","checked");
						$("#put-tactics-validate").next().hide();
						 $("#android-channel-validate").attr("value","checked");
						 $("#android-channel-validate").next().hide();
					}
					$("#ios-channel-validate").attr("value","checked");
					$("#ios-channel-validate").next().hide();
		}else{
			if(vl=="0"){//判断是否是指定渠道
				validateIosChannel(1);
			}else{
				 $("#ios-channel-validate").attr("value","checked");
				 $("#ios-channel-validate").next().hide();
			}
				$("#put-tactics-validate").attr("value","checked");
				$("#put-tactics-validate").next().hide();
				$("#android-channel-validate").attr("value","checked");
				$("#android-channel-validate").next().hide();
			}
	});
}
//判断预升级版本号是否大于升级版本号
function validateTargetVersion(obj,divId){
	var currentVal=$(obj).find("option:selected").text();
	var flag=true;
		$("."+divId).find("input[name='versionsArr']:checked").each(function(){
			if($(this).next().text()>=currentVal){
				flag=false;
			}
		});
		return flag;
}
//保存校验预升级版本号是否大于升级版本号
function validateSave(){
	var checkedPlate=$("#platformDiv").find("input[name='platform']:checked").val();
	var readyVersion="";
	var divId="";
	if(checkedPlate==0){
		divId="selectabcont2";
		readyVersion=$(".selectabcont2").find("select[name='andriodTargetVersion']");;
	}else{
		divId="selectabcont1";
		readyVersion=$(".selectabcont1").find("select[name='iosTargetVersion']");
	}
	var flag=validateTargetVersion(readyVersion,divId);
	return flag;
}
