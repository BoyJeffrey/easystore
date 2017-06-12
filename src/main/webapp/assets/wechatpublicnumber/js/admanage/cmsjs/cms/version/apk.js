/**apk上传list中的方法**/
function onloadApkGrid(){
	jQuery("#myList").jqGrid({
	   	url:ctx+'/version/apk/list/forJson.do',
		datatype: "json",
		jsonReader:{
				root: "result",
				page: "pageBean.page",
				total: "pageBean.pages",
				records: "pageBean.count",
				repeatitems: true,
		},
	   	colNames:['apk名称','版本号','操作'],
	   	colModel:[
	   		{name:'apkName',index:'apkName',align:"center"},
	   		{name:'versionName',index:'versionName',align:"center"},
	   		{name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
	   			return '<div>'+
	            	 	'<a href="javascript:void(0)" class="_editBtn" recordId="'+cellval+'" title="编辑" >编辑</a>'+
	            	 	'<a href="javascript:void(0)" onclick="delRecord(\''+cellval+'\')" title="删除" >删除</a>'+
	            	 	'<a href="javascript:void(0)" onclick="showdiary(this,\''+cellval+'\')" title="日志" >日志</a>'+
		            '</div>';
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
	   var paramtersData = {  
	       "apkName" : $("#apkName").val(),
	       "versionNum" : $("#versionNum").val()  
	   };  
	   var postData = $("#myList").jqGrid("getGridParam", "postData");  
	   $.extend(postData, paramtersData);  
	   $("#myList").jqGrid("setGridParam", {search: true}).trigger("reloadGrid", [{page:1}]);  
	}); 
}
//list绑定事件
function listBlinEnvent(){
	 $("#myList").on('click','._editBtn',function(){
			openRight2(ctx+'/version/apk/update.do?id='+$(this).attr('recordId'));
		});
}
//删除方法
function delRecord(id){
    myDialog.showConfirm("此操作会将彻底删除选中的记录，删除后不能恢复，您确定吗？",function(){
	    if(id!=null){
	    	$.ajax({
				type : "get",
				url : ctx+"/version/apk/delete.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("删除成功！");
						openRight2(ctx+'/version/apk/list.do');
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
//批量删除方法
function batchdelete(){
    var records = $("#myList").jqGrid('getGridParam','selarrrow');;
    if (records.length < 1) {
        myDialog.showAlert("请至少选择一条记录！");
        return null;
    } else  {
				delRecord(records);
    }
} 
//日志显示
function showdiary(obj,dataId){
	var url = ctx+"/version/apk/operations.do?dataId="+dataId;
	$(".tips").load(url,function(){
		diary(obj);
	});
}
/**以下为编辑或者新增的方法**/

//新增初始化方法
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
            $(this).attr('disabled', 'disabled');
		 	$.ajax({
				type : "post",
				url : ctx+"/version/apk/addInput.do",
				data : $('#inputForm').serialize(),
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
				if(data.success){
					myDialog.showAlert("创建成功！",function(){
							openRight2(ctx+'/version/apk/list.do');
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
	  
	$("#jyp_file").uploadify(upload.versionControllerUploadApkConfig);
    $("#jyp_fileUploader").css("float", "left");
    $("#jyp_fileQueue").css("clear", "both").before("<div class=\"Ufilent\" style=\"float:right\">（限定0.5-100M，仅支持Apk格）</div>");
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
	openRight2(ctx+'/version/apk/list.do');
} 

//修改加载方法
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
				url : ctx+"/version/apk/addInput.do",
				data : $('#inputForm').serialize(),
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
				if(data.success){
						myDialog.showAlert("修改成功！",function(){
							openRight2(ctx+'/version/apk/list.do');
						});
				    }
				},
				error : function(){
						myDialog.showAlert("修改失败！",function(){
							openRight2(ctx+'/version/apk/list.do');
						});
				}
			});
		}
	  });
	  
	$("#jyp_file").uploadify(upload.versionControllerUploadApkConfig);
    $("#jyp_fileUploader").css("float", "left");
    $("#jyp_fileQueue").css("clear", "both").before("<div class=\"Ufilent\" style=\"float:right\">（限定0.5-100M，仅支持Apk格）</div>");
}