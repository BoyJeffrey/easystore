/**加载专题内容list信息**/
function onloadContentList(){
	jQuery("#myList").jqGrid({
	   	url:ctx+'/feature/content/list/forJson.do?featureId='+featureId+'&contentType='+contentType+'&featureName='+featureName,
		datatype: "json",
		jsonReader:{
				root: "result",
				page: "pageBean.page",
				total: "pageBean.pages",
				records: "pageBean.count",
				repeatitems: true,
		},
	   	colNames:['名称','类型','状态','引用时间','操作'],
	   	colModel:[
            {name:'contentName',index:'contentName', formatter:function( cellval, rowModel , rowData){
                return rowData['top']>=1?'<font style="color: gray">[已置顶]</font>'+rowData['contentName']:rowData['contentName'];
            },align:"center"},
	   		{name:'contentType',index:'contentType', formatter:function( cellval, rowModel , rowData){
	   		    var returnVal="电台";
	   		    if(contentType==0){
	   		    	returnVal="专辑";
	   		    }else if(contentType==1){
	   		    	returnVal="碎片";
	   		    }
	   			return returnVal;
	   		},align:"center"},
	   		{name:'status',index:'status', formatter:function( cellval, rowModel , rowData){
	   			return cellval=='1'?'上线':'未上线'	;
	   		},align:"center",width:"65px"},
            {name:'createDate',index:'createDate',align:"center",width:"115",formatter:"date",formatoptions: {srcformat:'u',newformat:'Y-m-d H:i:s'}},
	   		{name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
	   			var tempOption='<a href="javascript:void(0)" class="_editBtn" onclick="topRecord(\''+cellval+'\',1)" recordId="'+cellval+'" title="置顶" >置顶</a>';
	   				if(rowData.top>=1)
	   					tempOption='<a href="javascript:void(0)" class="_editBtn" onclick="topRecord(\''+cellval+'\',0)" recordId="'+cellval+'" title="取消置顶" >取消置顶</a>';
	   			return '<div>'+
	            	 	tempOption+
	            	 	'<a href="javascript:void(0)" onclick="delRecord(\''+cellval+'\')" title="删除" >删除</a>'+
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
	jQuery("#myList").jqGrid('navGrid','#myPager',{edit:false,add:false,del:false});
	$("#myList").setGridWidth($(".usermain").width()*1);
	 //查询
	$("#queryBtn").bind("click", function() {  
	   var paramtersData = {  
	       "featureId" :featureId,
	       "contentType" :contentType,
	       "contentName" : $("#contentName").val(),
	       "featureName" : featureName,
	            
	   };  
	   var postData = $("#myList").jqGrid("getGridParam", "postData");  
	   $.extend(postData, paramtersData);  
	   $("#myList").jqGrid("setGridParam", {search: true}).trigger("reloadGrid", [{page:1}]);  
	}); 
}

/**list操作方法**/

function delRecord(id){
	   myDialog.showConfirm("此操作会将彻底删除选中的记录，删除后不能恢复，您确定吗？",function(){
		    if(id!=null){
		    	$.ajax({
					type : "get",
					url : ctx+"/feature/content/delete.do?ids="+id+"&featureId="+featureId,
					data : "",
					dataType : "json",
					async : true,
					cache : false,
					success : function(data){
						if(data.success){
							myDialog.showAlert("删除成功！");
							openRight2(ctx+'/feature/content/list.do?featureId='+featureId+'&contentType='+contentType+'&featureName='+featureName);
					    }else{
					    	myDialog.showAlert("删除失败！");
					    }
					},
					error : function(){
					
					}
				});
		    }
		});
}
function batchdelete(){
	    var records = $("#myList").jqGrid('getGridParam','selarrrow');;
     if (records.length < 1) {
         myDialog.showAlert("请至少选择一条记录！");
         return null;
     } else  {
				delRecord(records);
     }
} 


function showdiary(obj,dataId){
	var url = ctx+"/feature/content/operations.do?dataId="+dataId;
	$(".tips").load(url,function(){
		diary(obj);
	});
}
//置顶及取消置顶
function topRecord(id,top){
	myDialog.showConfirm("确定操作该条记录吗？",function(){
		    if(id!=null){
		    	$.ajax({
					type : "get",
					url : ctx+"/feature/content/topOrNoTop.do?featureId="+featureId+"&ids="+id+"&top="+top,
					data : "",
					dataType : "json",
					async : true,
					cache : false,
					success : function(data){
						if(data.success){
						   if(top==0)
								myDialog.showAlert("取消置顶成功！");
							else
								myDialog.showAlert("置顶成功！");
							openRight2(ctx+'/feature/content/list.do?featureId='+featureId+'&contentType='+contentType+'&featureName='+featureName);
					    }else{
					    	if(top==0)
								myDialog.showAlert("取消置顶失败！");
							else
								myDialog.showAlert("置顶失败！");
					    }
					},
					error : function(){
					
					}
				});
		    }
		});
}

/**以下是添加方法页面js**/
function onloadContentAddPage(){
	jQuery("#contMyList").jqGrid({
	   	url:ctx+'/feature/content/add/forJson.do?featureId='+featureId+'&contentType='+contentType+'&featureName='+featureName,
		datatype: "json",
		jsonReader:{
				root: "result",
				page: "pageBean.page",
				total: "pageBean.pages",
				records: "pageBean.count",
				repeatitems: true,
		},
	   	colNames:['名称','频道','状态', '操作'],
	   	colModel:[
	   		{name:'contentName',index:'contentName',align:"center", formatter:function( cellval, rowModel , rowData){
	   			var returnVal='<input name="contentIdArr" type="hidden" value="'+rowData.contentId+'">'+cellval;
	   			return returnVal;
	   		},align:"center",width:"65px"},
	   		{name:'catalogIdArr',index:'catalogIdArr',formatter:function( cellval, rowModel , rowData){
	   			var contentType=$("#contentType").val();
	   		    var catalogName="";
	   		    if(contentType==3){
	   		    	$("#catalogDTOList").find("option").each(function(){
		   		    	if(cellval.indexOf($(this).val())>=0){
		   		    		catalogName=catalogName+$(this).text()+",";
		   		    	}
	   		    	});
		   		    if(catalogName!=""){
		   		    		catalogName=catalogName.substring(0,catalogName.length-1);
		   		    	}
	   		    }else{
	   		    	$("#catalogDTOList").find("option").each(function(){
		   		    	if($(this).val()==cellval)
		   		    	catalogName=$(this).text();
	   		    	});
	   		    }
	   			return catalogName;
	   		},align:"center"},
	   		{name:'status',index:'status', formatter:function( cellval, rowModel , rowData){
	   		    var contentType=$("#contentType").val();
	   		    if(contentType==0){
	   		    	return cellval=='1'?'上线':'未上线';
	   		    }else if(contentType==1){
	   		    	return cellval=='1'?'上线':'未上线';
	   		    }else if(contentType==3){
	   		    	return cellval=='1'?'启用':'停用';
	   		    }
	   		},align:"center",width:"65px"},
	   		{name:'contentId',index:'contentId', formatter: function(cellval, rowModel , rowData){
	   		    var inputStr='<input type="button" class="selectCopy " value="选择" >';
	   		    var flag=true;
	   			$("#featureContentList").find("option").each(function(){
	   				if($(this).val()==rowData.contentId)
	   		    		flag=false;
	   			});
	   			if(!flag)
	   				inputStr='<input type="button" class="selectCopy " value="已选择" disabled="disabled" style="background:#999">';
	   			return '<div>'+inputStr+
		               '</div>';
	   		},align:"center"}	
	   	],
	   	height:"auto",
	   	rowNum:20,
	   	rowList:[20,50,100],
	   	pager: '#myAddPager',
	   	sortname: 'id',
	   	multiselect:false,
	    viewrecords: true,
	    sortorder: "desc",
	    prmNames: {page:"pageNum",rows:"pageSize"},
	    caption:"JSON Example",
	    onPaging:function(){
	    	window.parent.document.documentElement.scrollTop= 0;//页面滚动条处于最顶端
			window.parent.document.body.scrollTop= 0;//谷歌
	    }
	});
    $("#contMyList").setGridWidth($(".floatlt").width()*1);
}

function blindEventBtn(){
	//全部删除
	$(".delrecommed").click(function(){
		$(".selectUl").find("li").each(function(){
			var vl=$(this).find(".pdName").find("input[name='contentIdArr']").val();
			$("#contMyList").find("input[name='contentIdArr']").each(function(i,e){
				var oldvl=$(e).val();
				if(oldvl==vl){
					$(e).parent().parent().find(".selectCopy").attr("disabled",false);
					$(e).parent().parent().find(".selectCopy").val("选择").css("background","#00a8ff");
				}	
			});
		});
		$(".selectUl").find("li").remove();
	});
	//选择
	$("#contMyList").on("click",".selectCopy",function(){

		var txt=$(this).parent().parent().parent().find("td").eq(0).html();
		var txt1=$(this).parent().parent().parent().find("td").eq(1).html();
		var li=$('<li onmouseover="showDel(this)"><span class="pindao"></span><span class="pdName"></span><img src="'+ctx+'/images/close.png" onclick="del(this)"</li>');
		li.appendTo(".selectUl");
		li.find(".pindao").html("["+txt1+"]");
		li.find(".pdName").html(txt);
		$(this).attr("disabled",true);
		$(this).val("已选择").css("background","#999");
		//$(this).off("click");
	});
	
	$("#addSaveBtn").click(function(){
		var tempLi=$(".selectUl").find("li").length;
		if(tempLi==0){
		    myDialog.showAlert("请选择记录！");
		   return;
		}else{
		 	$.ajax({
				type : "post",
				url : ctx+"/feature/content/addInput.do",
				data : $('#inputForm').serialize(),
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
				if(data.success){
						myDialog.showAlert("创建成功！");
						openRight2(ctx+'/feature/content/list.do?featureId='+featureId+'&contentType='+contentType+'&featureName='+featureName);
				    }
				},
				error : function(){
						myDialog.showAlert("创建失败！");
				}
			});
		}
	  });
	  
	 //查询
	$("#queryAddBtn").bind("click", function() {  
	   var contentName=$("#contentName").val();
	   if(contentName=="名称"){
	   		contentName="";
	   }
	   var paramtersData = {  
	       "channelType" :$("#channelType").val(),
	       "contentType" :$("#contentType").val(),
	       "contentName" : contentName     
	   };  
	   var postData = $("#contMyList").jqGrid("getGridParam", "postData");  
	   $.extend(postData, paramtersData);  
	   $("#contMyList").jqGrid("setGridParam", {search: true}).trigger("reloadGrid", [{page:1}]);  
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
	$(obj).parent().remove();
	var vl=$(obj).parent().find(".pdName").find("input").val();
	//console.log(vl);
	$("#contMyList").find("input[name='contentIdArr']").each(function(){
		var oldvl=$(this).val();
		if(oldvl==vl){
			$(this).parent().parent().find(".selectCopy").attr("disabled",false);
			$(this).parent().parent().find(".selectCopy").val("选择").css("background","#00a8ff");
		}	
	});
}

