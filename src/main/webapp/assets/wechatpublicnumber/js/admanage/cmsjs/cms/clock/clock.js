var parame="";
/**list中的方法**/
function onloadGrid(){
	jQuery("#myList").jqGrid({
	   	url:ctx+'/clock/list/forJson.do?radioId='+$("#radioId").val(),
		datatype: "json",
		jsonReader:{
				root: "result",
				page: "pageBean.page",
				total: "pageBean.pages",
				records: "pageBean.count",
				repeatitems: true,
		},
	   	colNames:['clock名称','时长','状态','操作'],
	   	colModel:[
	   		{name:'clockName',index:'clockName',align:"center"},
	   		{name:'timeLength',index:'timeLength', formatter:function( cellval, rowModel , rowData){
	   			var tempTimeLength=formatDuring(cellval);
	   			return tempTimeLength;
	   		},align:"center"},
	   		{name:'status',index:'status', formatter:function( cellval, rowModel , rowData){
	   			return cellval=='1'?'启用':'暂停'	;
	   		},align:"center",width:"65px"},
	   		{name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
	   			var temp='<a href="javascript:void(0)" onclick="startOrPause(\''+cellval+'\',0)" title="暂停" >暂停</a>';
	   			if(rowData.status==0){
	   				temp='<a href="javascript:void(0)" onclick="startOrPause(\''+cellval+'\',1)" title="启用" >启用</a>';
	   			}
	   			return '<div>'+
	   					'<a href="javascript:void(0)"  class="_contentSetBtn" recordId="'+cellval+'" title="内容设置" >内容设置</a>'+
	            	 	'<a href="javascript:void(0)" class="_editBtn" recordId="'+cellval+'" title="编辑" >编辑</a>'+
	            	 	temp+
	            	 	'<a href="javascript:void(0)" onclick="showdiary(this,\''+cellval+'\')" title="日志" >日志</a>'+
		            '</div>';
	   		},align:"center"}	
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
	jQuery("#myList").jqGrid('navGrid','#myPager',{edit:false,add:false,del:false});
	$("#myList").setGridWidth($(".usermain").width()*1);
	 //查询
	$("#queryBtn").bind("click", function() {  
	   var paramtersData = {  
	       "apkName" : $("#apkName").val(),
	       "versionNum" : $("#versionNum").val()  
	   };  
	   var postData = $("#myList").jqGrid("getGridParam", "postData");  
	   $.extend(postData, paramtersData);  
	   $("#myList").jqGrid("setGridParam", {search: true}).trigger("reloadGrid", [{page:1}]);  
	}); 
	var pageNum=$("#myList").jqGrid('getGridParam','page');
	var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
	parame="radioId="+$("#radioId").val()+'&radioType='+$("#radioType").val()+'&compareId='+$("#compareId").val()+'&pageNum='+pageNum+'&pageSize='+pageSize;
}
//list绑定事件
function listBlinEnvent(){
	 $("#myList").on('click','._editBtn',function(){
			openRight2(ctx+'/clock/update.do?id='+$(this).attr('recordId')+'&'+parame);
		});
	 $("#myList").on('click','._contentSetBtn',function(){
		 	var pageNum=$("#myList").jqGrid('getGridParam','page');
			var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
			openRight2(ctx+'/clock/contentSet.do?id='+$(this).attr('recordId')+'&'+parame);
		});
	 $("#addClockBtn").on("click",function(){
			var pageNum=$("#myList").jqGrid('getGridParam','page');
			var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
			openRight2(ctx+'/clock/add.do?'+parame)
		}); 
	 $("#clockMgmt").on("click",function(){
			var pageNum=$("#myList").jqGrid('getGridParam','page');
			var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
			openRight2(ctx+'/clock/list.do?'+parame)
		}); 
	 $("#clockDateArrange").on("click",function(){
			var pageNum=$("#myList").jqGrid('getGridParam','page');
			var pageSize=$("#myList").jqGrid('getGridParam','rowNum');
			openRight2(ctx+'/clock/dateArrange.do?'+parame)
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
//暂停或者显示
function startOrPause(id,status){
	myDialog.showConfirm("确定操作该记录吗？",function(){
	    if(id!=null){
	    	$.ajax({
				type : "get",
				url : ctx+"/clock/startOrPause.do?ids="+id+"&status="+status,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						if(status==0)
							myDialog.showAlert("暂停成功!");
						else
							myDialog.showAlert("启用成功!");
						openRight2(ctx+'/clock/list.do?'+parame);
				    }else{
					    if(status==0)
					    	myDialog.showAlert("暂停失败!");
						else
							myDialog.showAlert("启用失败!");
				    }
				},
				error : function(){
				
				}
			});
	    }
	});
}

//日志显示
function showdiary(obj,dataId){
	var url = ctx+"/clock/operations.do?dataId="+dataId;
	$(".tips").load(url,function(){
		diary(obj);
	});
}
/**以下为编辑或者新增的方法**/

//新增初始化方法
function onloadAddPage(){
	parame="radioId="+$("#radioId").val()+'&radioType='+$("#radioType").val()+'&compareId='+$("#compareId").val()+'&pageNum='+$("#pageNum").val()+'&pageSize='+$("#pageSize").val();
	//ajax提交属性
    var options = { 
        success:       showResponse,
        type:'post',
        error: myError
    }; 
    
    $('#inputForm').submit(function() { 
        $(this).ajaxSubmit(options); 
        return false; 
    }); 
    
    //页面验证
   	var valid = new Validation('inputForm',{immediate:true,useTitles:true});
   	
	$("#addSaveBtn").click(function(){
	  	if(valid.validate()){
		 	$.ajax({
				type : "post",
				url : ctx+"/clock/addInput.do",
				data : $('#inputForm').serialize(),
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
				if(data.success){
					myDialog.showAlert("创建成功！",function(){
							openRight2(ctx+'/clock/list.do?'+parame);
						});
				    }
				},
				error : function(){
						myDialog.showAlert("创建失败！",function(){
			   				$(this).removeAttr('disabled');
			   			});
				}
			});
		}
	  });
	
}

function myError(responseText, statusText){
	myDialog.showAlert(statusText,function(){
			   				$(this).removeAttr('disabled');
			   		});
	myDialog.showAlert("操作失败！",function(){
			$(this).removeAttr('disabled');
	});
}
function showRequest(formData, jqForm, options) { 
    var queryString = $.param(formData); 
    myDialog.showAlert('About to submit: \n\n' + queryString);
    return true; 
}
function showResponse(responseText, statusText)  { 
	openRight2(ctx+'/clock/list.do');
} 

//修改加载方法
function onloadUpdatePage(){
	parame="radioId="+$("#radioId").val()+'&radioType='+$("#radioType").val()+'&compareId='+$("#compareId").val()+'&pageNum='+$("#pageNum").val()+'&pageSize='+$("#pageSize").val();
	//ajax提交属性
    var options = { 
        success:       showResponse,
        type:'post',
        error: myError
    }; 
    
    $('#inputForm').submit(function() { 
        $(this).ajaxSubmit(options); 
        return false; 
    }); 
    
    //页面验证
   	var valid = new Validation('inputForm',{immediate:true,useTitles:true});
   	
	$("#updateSaveBtn").click(function(){
	  	if(valid.validate()){
		 	$.ajax({
				type : "post",
				url : ctx+"/clock/updateInput.do",
				data : $('#inputForm').serialize(),
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
				if(data.success){
						myDialog.showAlert("修改成功！",function(){
							openRight2(ctx+'/clock/list.do?'+parame);
						});
				    }
				},
				error : function(){
						myDialog.showAlert("修改失败！",function(){
							openRight2(ctx+'/clock/list.do?'+parame);
						});
				}
			});
		}
	  });
}


/**以下是添加方法页面js**/
function onloadContentAddPage(ruleType,ruleName){
	parame="radioId="+$("#radioId").val()+'&radioType='+$("#radioType").val()+'&compareId='+$("#compareId").val()+'&pageNum='+$("#pageNum").val()+'&pageSize='+$("#pageSize").val();
	$.ajax({
		type : "get",
		url : ctx+"/clock/edit/forJson.do?ruleType="+ruleType+"&ruleName="+ruleName,
		data : "",
		dataType : "json",
		async : true,
		cache : false,
		success : function(data){
			var leftPanel=$("#leftPanel");
			if(data!=null){
				$("#leftPanel").find("li").remove();
				var flag=true;
				for(var i=0;i<data.length;i++){
					var id=data[i].id;
					$("#rightPanel1").find(".noagainstUl").find("input").each(function(){
						if(id==$(this).val()){
							flag=false;
						}
					});
					if(flag){
						$("#rightPanel2").find(".againstUl").find("input").each(function(){
							if(id==$(this).val()){
								flag=false;
							}
						});
					}
					if(flag){
						var li=$('<li><input type="checkbox" value="'+id+'"><span class="pdName">'+data[i].ruleName+'</span></li>');
						li.appendTo(leftPanel);
					}
				}
		    }else{
		    	myDialog.showAlert("加载失败！");
		    }
		},
		error : function(){
			myDialog.showAlert("加载失败！");
		}
	});
}

function blindEventBtn(){
	//全部删除
	$("#rightDelAll1").click(function(){
		var rightPanel1=$("#rightPanel1").find(".noagainstUl");
		var leftPanel=$("#leftPanel");
		$(rightPanel1).find("input").each(function(){
			var tempValue=$(this).val();
			var tempText=$(this).parent().find("span").html();
			var tempLi=$('<li> <input type="checkbox" value="'+tempValue+'"><span class="pdName">'+tempText+'</span></li>');
			tempLi.appendTo(leftPanel);	
		});
		$(rightPanel1).find("li").remove();
	});
	//全部删除
	$("#rightDelAll2").click(function(){
		var rightPanel2=$("#rightPanel2").find(".againstUl");
		var leftPanel=$("#leftPanel");
		$(rightPanel2).find("input").each(function(){
			var tempValue=$(this).val();
			var tempText=$(this).parent().find("span").html();
			var tempLi=$('<li> <input type="checkbox" value="'+tempValue+'"><span class="pdName">'+tempText+'</span></li>');
			tempLi.appendTo(leftPanel);
			});
		$(rightPanel2).find("li").remove();
	});
	//选择
	$("#noagainstBtn").click(function(){
		var rightPanel1=$("#rightPanel1").find(".noagainstUl");
		 var currentLeftPane = $("#leftPanel");
		   currentLeftPane.find(":checked").each(function (i, el) {
				var tempValue=$(this).val();
				var tempText=$(this).parent().find("span").html();
				var tempLi=$('<li onmouseover="showDel(this)" > <input type="hidden" value="'+tempValue+'" name="noViolate"><span class="pdName">'+tempText+'</span><img src="'+ctx+'/images/close.png" onclick="del(this)"/></li>');
				tempLi.appendTo(rightPanel1);
				$(this).parent().remove();
			});
	});
	//选择
	$("#againstBtn").click(function(){
		var rightPanel2=$("#rightPanel2").find(".againstUl");
		 var currentLeftPane = $("#leftPanel");
		   currentLeftPane.find(":checked").each(function (i, el) {
				var tempValue=$(this).val();
				var tempText=$(this).parent().find("span").html();
				var tempLi=$('<li onmouseover="showDel(this)" > <input type="hidden" value="'+tempValue+'" name="yesViolate"><span class="pdName">'+tempText+'</span><img src="'+ctx+'/images/close.png" onclick="del(this)"/></li>');
				tempLi.appendTo(rightPanel2);
				$(this).parent().remove();
			});
	});
	  
	 //查询
	$("#queryAddBtn").bind("click", function() {  
	   var ruleType=$("#ruleType").val();
	   var ruleName=$("#ruleName").val();
	   if(ruleName=="名称"){
		   ruleName="";
	   }
	   onloadContentAddPage(ruleType,ruleName);
	}); 
}
//选择后删除
function showDel(obj){
	$(obj).parent().find("img").hide();
	$(obj).find("img").show();
	$(obj).css("background","#ededed").siblings().css("background","#fff");	
}
//删除
function del(obj){
	var rightPanel=$(obj).parent();
	var leftPanel=$("#leftPanel");
		var tempValue=$(rightPanel).find("input").val();
		var tempText=$(rightPanel).find("span").html();
		var tempLi=$('<li> <input type="checkbox" value="'+tempValue+'"><span class="pdName">'+tempText+'</span></li>');
		tempLi.appendTo(leftPanel);	
	
	$(rightPanel).remove();
}
//时间转换方法
var formatDuring = function(mss) {
	var minutes = parseInt(mss / (1000 * 60));
	var seconds = parseInt((mss % (1000 * 60)) / 1000);

	var result = '';

	result = result + (minutes >= 10 ? minutes : '0' + minutes) + ":";
	result = result + (seconds >= 10 ? seconds : '0' + seconds);

	return result;
}