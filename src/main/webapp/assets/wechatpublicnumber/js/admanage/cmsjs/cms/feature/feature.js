/**专题包管理list中的方法**/
function onloadGrid(){
	jQuery("#myList").jqGrid({
	   	url:ctx+'/feature/list/forJson.do',
        datatype: "json",
		jsonReader:{
				root: "result",
				page: "pageBean.page",
				total: "pageBean.pages",
				records: "pageBean.count",
				repeatitems: true
		},
	   	colNames:['名称','内容数量','状态', '分类','专题类型','操作'],
	   	colModel:[
	   		{name:'name',index:'name',align:"center"},
	   		{name:'contentNum',index:'contentNum',align:"center",width:"65px"},
	   		{name:'status',index:'status', formatter:function( cellval, rowModel , rowData){
	   			return cellval=='1'?'上线':'未上线'	;
	   		},align:"center",width:"65px"},
	   		{name:'typeId',index:'typeId', formatter:function( cellval, rowModel , rowData){
	   		    var returnVal="";
	   		    $("#typeId").find("option").each(function(){
	   		    	//console.log($(this).val()+" "+$(this).text());
	   		    	if(cellval.indexOf($(this).val())>=0&&$(this).val()!=""){
	   		    		returnVal=returnVal+$(this).text()+",";
	   		    	}
	   		    });
	   		    if(returnVal!=""){
	   		    		returnVal=returnVal.substring(0,returnVal.length-1);
	   		    }
	   			return returnVal;
	   		},align:"center"},
	   		{name:'contentType',index:'contentType', formatter:function( cellval, rowModel , rowData){
	   		    var returnVal="电台";
	   		    if(cellval==0){
	   		    	returnVal="专辑";
	   		    }else if(cellval==1){
	   		    	returnVal="碎片";
	   		    }
	   			return returnVal;
	   		},align:"center",width:"65px"},
	   		{name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
	   		   var temp='<a href="javascript:void(0)" onclick="onOrOffLine(\''+cellval+'\',0)" title="下线" >下线</a>';
	   			if(rowData.status==0){
	   				temp='<a href="javascript:void(0)" onclick="onOrOffLine(\''+cellval+'\',1)" title="上线" >上线</a>';
	   			}
	   			var contentUrl=ctx+'/feature/content/list.do?featureId='+cellval+'&contentType='+rowData.contentType+'&featureName='+rowData.name;
	   			return '<div>'+
	   					temp+
	   					'<a href="javascript:void(0)" onclick="openRight2(\''+contentUrl+'\')"  title="内容管理" >内容管理</a>'+
		            	'<a href="javascript:void(0)" onclick="delRecord(\''+cellval+'\')" title="删除" >删除</a>'+
	            	 	'<a href="javascript:void(0)" class="_editBtn" recordId="'+cellval+'" title="编辑" >编辑</a>'+
	            	 	'<a href="javascript:void(0)" onclick="showdiary(this,\''+cellval+'\')" title="日志" >日志</a>'+
		            '</div>';
	   		},align:"center",width:"240px"}	
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
	
	 $("#myList").on('click','._editBtn',function(){
			openRight2(ctx+'/feature/update.do?id='+$(this).attr('recordId'));
		});

	jQuery("#myList").jqGrid('navGrid','#myPager',{edit:false,add:false,del:false});
	$("#myList").setGridWidth($(".usermain").width()*1);
	 //查询
	$("#queryBtn").bind("click", function() {  
	   var paramtersData = {  
	       "typeId" : $("#typeId").val(),
	       "status" : $("#status").val(),
	       "name" : $("#name").val()      
	   };  
	   var postData = $("#myList").jqGrid("getGridParam", "postData");  
	   $.extend(postData, paramtersData);  
	   $("#myList").jqGrid("setGridParam", {search: true}).trigger("reloadGrid", [{page:1}]);  
	}); 

}
//删除记录
function delRecord(id){
	myDialog.showConfirm("此操作会将彻底删除选中的记录，删除后不能恢复，您确定吗？",function(){
	    if(id!=null){
	    	$.ajax({
				type : "get",
				url : ctx+"/feature/delete.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("删除成功！");
						openRight2(ctx+'/feature/list.do');
				    }else{
				    	myDialog.showAlert("删除失败！");
				    }
				},
				error : function(){
					myDialog.showAlert("删除失败！");
				}
			});
	    }
	});
}
//批量删除记录
function batchdelete(){
    var records = $("#myList").jqGrid('getGridParam','selarrrow');;
    if (records.length < 1) {
        myDialog.showAlert("请至少选择一条记录！");
        return null;
    } else  {
				delRecord(records);
    }
} 


//操作上线即下线
function onOrOffLine(id,status){
	myDialog.showConfirm("确定操作该记录吗？",function(){
	    if(id!=null){
	    	$.ajax({
				type : "get",
				url : ctx+"/feature/onOrOffLine.do?ids="+id+"&status="+status,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						if(status==0)
                            myDialog.showAlert("下线成功！");
						else
                            myDialog.showAlert("上线成功！");
						openRight2(ctx+'/feature/list.do');
				    }else{
                        myDialog.showAlert("内容数不能为零，请选择内容数不为0的记录！");
				    }
				},
				error : function(){
                    myDialog.showAlert("操作失败！");
				}
			});
	    }
	});
}
//披露操作上线或下线
function batchdonOrOffLine(status){
    var records = $("#myList").jqGrid('getGridParam','selarrrow');;
    if (records.length < 1) {
        myDialog.showAlert("请至少选择一条记录！");
        return null;
    } else  {
				onOrOffLine(records,status);
    }
} 
//日志操作
function showdiary(obj,dataId){
	var url = ctx+"/feature/operations.do?dataId="+dataId;
	$(".tips").load(url,function(){
		diary(obj);
	});
}

/**以下方法提供新增及修改调用**/

//页面加载调用方法
function onloadAddPage(){
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
				url : ctx+"/feature/addInput.do",
				data : $('#inputForm').serialize(),
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
				if(data.success){
						myDialog.showAlert("创建成功！",function(){
							openRight2(ctx+'/feature/list.do');
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
function onloadUpdatePage(){
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
				url : ctx+"/feature/updateInput.do",
				data : $('#inputForm').serialize(),
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
				if(data.success){
						myDialog.showAlert("修改成功！",function(){
							openRight2(ctx+'/feature/list.do');
						});
						
				    }
				},
				error : function(){
						myDialog.showAlert("修改失败！",function(){
							openRight2(ctx+'/feature/list.do');
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
    alert('About to submit: \n\n' + queryString); 
    return true; 
}
function showResponse(responseText, statusText)  { 
	openRight2(ctx+'/feature/list.do');
} 

//编辑页面初始化
function inputEditInit(){
	var jyp_file = $(".jyp_file");
	jyp_file.each(function() {
		var _this = $(this);
		_this.uploadify(upload.initTitlePackageUploadImageConfig(_this));
		_this.css("float", "left");
		_this.css("clear", "both").before("<div class=\"Ufilent\" style=\"float:right\">（图片支持JPG格式，不超过1000K）</div>");
	});

}

//全选
function allSelect(obj){
		$(obj).parent().parent().find("input").attr("checked","checked");
		$("#type-id-validate").val("checked");
		$("#type-id-validate").next().hide();
}
//取消全选
function delSelect(obj){
		$(obj).parent().parent().find("input").removeAttr("checked");
		$("#type-id-validate").val("");
		$("#type-id-validate").next().show();
}
//选择分类
function selectCheckBox(obj){
		var length=$(obj).parent().parent().find("input[name='typeIdArr']:checked").length;
		if(length>0){
			$("#type-id-validate").val("checked");
			$("#type-id-validate").next().hide();
		}else{
			$("#type-id-validate").val("");
			$("#type-id-validate").next().show();
		}
}