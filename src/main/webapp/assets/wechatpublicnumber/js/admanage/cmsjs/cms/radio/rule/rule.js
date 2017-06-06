var mams_contentpic={
		init:function(){$("#ruleList").jqGrid({
		   	url:ctx +'/radio/rule/list/forJson.do',
			datatype: "json",
			jsonReader:{
					root: "result",
					page: "pageBean.page",
					total: "pageBean.pages",
					records: "pageBean.count",
					repeatitems: true,
			},
		   	colNames:['名称','规则类型','状态','操作'],
		   	colModel:[
		   		{name:'ruleName',index:'ruleName',align:"center",width:"90"},
		    	{name:'ruleTypeDTO',index:'ruleTypeDTO',formatter:function(cellval){
		    			return cellval.typeName;	    			
		    		},align:"center",width:"90"
		    	},
		    	{name:'status',index:'status',formatter:function(cellval){
		    			if(cellval == '0'){
		    				return "暂停";
		    			}else if(cellval == '1'){
		    				return "启用";
		    			}		    			
		    		},align:"center",width:"90"
		    	},
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
		$("#ruleList").setGridWidth($(".usermain").width()*1);
	}
}


//单条删除
function deleteOne(id) {
	if(id!=null){
		$.ajax({
			type : "get",
			url : ctx+"/radio/rule/delete.do?ids="+id,
			data : "",
			dataType : "json",
			async : true,
			cache : false,
			success : function(data){
				if(data.success){
					myDialog.showAlert("删除成功！");
					jQuery("#ruleList").trigger('reloadGrid');
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
		myDialog.showConfirm("此操作会暂停此规则，您确定吗？",function(){
			$.ajax({
				type : "get",
				url : ctx+"/radio/rule/suspend.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("暂停成功！");
						jQuery("#ruleList").trigger('reloadGrid');
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
		myDialog.showConfirm("此操作会启用此规则，您确定吗？",function(){
			$.ajax({
				type : "get",
				url : ctx+"/radio/rule/valid.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("启用成功！");
						jQuery("#ruleList").trigger('reloadGrid');
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