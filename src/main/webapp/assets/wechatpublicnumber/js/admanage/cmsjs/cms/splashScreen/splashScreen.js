var mams_contentpic={
		init:function(){$("#splashScreenList").jqGrid({
		   	url:ctx +'/splashscreen/list/forJson.do',
			datatype: "json",
			jsonReader:{
					root: "result",
					page: "pageBean.page",
					total: "pageBean.pages",
					records: "pageBean.count",
					repeatitems: true,
			},
		   	colNames:['名称','状态','适用平台','渠道','版本','生效时间','操作'],
		   	colModel:[
		   		{name:'name',index:'name',align:"center",width:"90"},
		    	{name:'status',index:'status',formatter:function(cellval){
		    			if(cellval == '0'){
		    				return "暂停";
		    			}else if(cellval == '1'){
		    				return "启用";
		    			}		    			
		    		},align:"center",width:"90"
		    	},
		    	{name:'platform',index:'platform',formatter:function(cellval){
		    			if(cellval == '0'){
		    				return "Android";
		    			}else if(cellval == '1'){
		    				return "IOS";
		    			}		    			
		    		},align:"center",width:"90"
		    	},
		    	{name:'channelDTO',index:'channelDTO',formatter:function(cellval){
		    			if(cellval == null){
		    				return "所有";    
		    			}else{
		    				return cellval.channelName;
		    			}
		    						
		    		},align:"center",width:"90"
		    	},
		    	{name:'versionDTO',index:'versionDTO',formatter:function(cellval){
		    		if(cellval == null){
	    				return "所有";    
	    			}else{
	    				return cellval.versionName;
	    			} 			
		    		},align:"center",width:"90"
		    	},
		    	{name:'validStartDate',index:'validStartDate',align:"center",width:"115",formatter:"date",formatoptions: {srcformat:'u',newformat:'Y-m-d H:i:s'}},
		   		{name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
		   			var suppendOrValid = '';
		   			//if(splashScreen_SUPPEND){
		   				suppendOrValid = rowData['status'] == '0'? '<a href="javascript:void(0)" class="_uploadABtn" onclick="valid('+cellval+')" recordId="'+cellval+'" title="启用">启用</a>&nbsp;&nbsp;&nbsp;' : '<a href="javascript:void(0)" class="_uploadABtn" onclick="suspendOne('+cellval+')" recordId="'+cellval+'" title="暂停">暂停</a>&nbsp;&nbsp;&nbsp;';
		   			//}
		   			var edit = '';
		   			//if(splashScreen_UPDATE){
		   				edit = '<a href="javascript:void(0)" class="_uploadABtn" onclick="edit('+cellval+')" recordId="'+cellval+'" title="编辑">编辑</a>&nbsp;&nbsp;&nbsp;';
		   			//}
		   			var log='<a href="javascript:void(0)" onclick="showdiary(this,\''+cellval+'\')" title="日志" >日志</a>&nbsp;&nbsp;&nbsp;'
		   			return edit+suppendOrValid+log;
		   		},align:"center"}	
		   	],
		   	height:"auto",
		   	rowNum:20,
		   	rowList:[20,50,100],
		   	pager: '#pager2',
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
		$("#splashScreenList").setGridWidth($(".usermain").width()*1);
	}
}
//ios和andriod内容
function selectTypes(obj,casid){
	 var isinput = $(obj).is(":checked");
	 var ios=$("#labelId_1").is(":checked");
	 var android=$("#labelId_2").is(":checked");
	 
	 if(ios==false&&android==false){
		 //$("#platformValidation").show();
		 $("#platformInput").val("");		 
	 }else{
		 //$("#platformValidation").hide();
		 $("#platformInput").val("checked");
		// $("#platformInput").attr("class","validate-one-required validation-passed");
		 $("#advice-validate-one-required-platformInput").hide();
	 }
	 if(isinput == true){
		$(obj).parents(".userlist").find(casid).show();
		$(obj).parents(".userlist").find(casid).find(".appoint").find("input[value='0']").attr("checked",true);		
	 }else{
		 $(obj).parents(".userlist").find(casid).hide();
		 $(obj).parents(".userlist").find(casid).find(".appoint").find("input[value='0']").attr("checked",false);
		 
	 }
		 
}

//单条删除
function deleteOne(id) {
	if(id!=null){
		$.ajax({
			type : "get",
			url : ctx+"/splashscreen/delete.do?ids="+id,
			data : "",
			dataType : "json",
			async : true,
			cache : false,
			success : function(data){
				if(data.success){
					myDialog.showAlert("删除成功！");
					jQuery("#splashScreenList").trigger('reloadGrid');
			    }else{
			    	myDialog.showAlert("删除失败！");
			    }
			},
			error : function(){
			
			}
		});
	}
}
//单条暂停
function suspendOne(id) {
	if(id!=null){
		myDialog.showConfirm("此操作会暂停此闪屏，您确定吗？",function(){
			$.ajax({
				type : "get",
				url : ctx+"/splashscreen/suspend.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("暂停成功！");
						jQuery("#splashScreenList").trigger('reloadGrid');
				    }else{
				    	myDialog.showAlert("暂停失败！");
				    }
				},
				error : function(){
				
				}
			});
    	});				
	}
}

//单条启用
function valid(id) {
	if(id!=null){
		myDialog.showConfirm("此操作会启用此闪屏，您确定吗？",function(){
			$.ajax({
				type : "get",
				url : ctx+"/splashscreen/valid.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("启用成功！");
						jQuery("#splashScreenList").trigger('reloadGrid');
				    }else{
				    	myDialog.showAlert("启用失败！");
				    }
				},
				error : function(){
				
				}
			});
    	});		
	}
}
//ios和andriod指定渠道和版本
function channelNum(obj,e){
	var txt=$(obj).next("span").text();	
	var vl=$(obj).attr("data");
	var e=$(obj).parent().parent().next(".splashAll").find(".allNum li").last().find("input");
	//console.log(e.next().html());
	e.addClass("validate-one-required");
	if(vl==0||vl==2){
		$(obj).parent().parent().next(".splashAll").show();
		if(vl==0){
			$(obj).parents(e).find(".appointChannel").html(txt);	
			//$(this).parents(".selectabcont").find(".AndroidChannel").html(txt);
		}else{
			$(obj).parents(e).find(".appointVersion").html(txt);	
			//$(this).parents(".selectabcont").find(".AndroidVersion").html(txt);
		}
	}else{
		
		$(obj).parent().parent().next(".splashAll").hide();
		var e=$(obj).parent().parent().next(".splashAll").find(".allNum li").last().find("input");
		//console.log(e.next().html());
		e.removeClass("validate-one-required");
		if(vl==1){
			$(obj).parents(e).find(".appointChannel").html(txt);	
			//$(this).parents(".selectabcont").find(".AndroidChannel").html(txt);
		}else{
			$(obj).parents(e).find(".appointVersion").html(txt);	
			//$(this).parents(".selectabcont").find(".AndroidVersion").html(txt);
		}	
	}
}	




  