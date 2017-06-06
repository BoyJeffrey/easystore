var mams_contentpic={		
		init:function(){$("#catalogList").jqGrid({
		   	url:ctx +'/catalog/arrange/list/forJson.do',
			datatype: "json",
			jsonReader:{
					root: "result",
					page: "pageBean.page",
					total: "pageBean.pages",
					records: "pageBean.count",
					repeatitems: true,
			},
		   	colNames:['名称','下级类型','状态','内容来源','操作'],
		   	colModel:[
		   		{name:'id',index:'id',formatter:function(cellval,rowModel,rowData){
		   				if(rowData['isLeaf']=='0'){
		   					return '<a href="javascript:void(0)" class="_uploadABtn" onclick="hasChild('+cellval+')" recordId="'+cellval+'" title="子节点"><span level="0" id="onOrOff_'+cellval+'" style="color: rgb(0, 0, 255);">+</span></a>'+rowData['name'];
		   				}else{
		   					return rowData['name'];
		   				}
		   			},align:"left",width:"90"
		   		},
		    	{name:'isLeaf',index:'isLeaf',formatter:function(cellval){
		    			if(cellval == '0'){
		    				return "子分类";
		    			}else if(cellval == '1'){
		    				return "内容资源";
		    			}		    			
		    		},align:"center",width:"50"
		    	},
		    	{name:'status',index:'status',formatter:function(cellval){
		    			if(cellval == '0'){
		    				return "暂停";
		    			}else if(cellval == '1'){
		    				return "启用";
		    			}		    			
		    		},align:"center",width:"50"
		    	},
		    	{name:'contentSources',index:'contentSources',formatter:function(cellval){
		    		if(cellval == '0'){
	    				return "自动获取";
	    			}else if(cellval == '1'){
	    				return "人工运营";
	    			}else {
	    				return "";
	    			}	
		    						
		    		},align:"center",width:"50"
		    	},
		    	{name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
		    		var edit = '';
		   			//if(splashScreen_UPDATE){
		   				edit = '<a href="javascript:void(0)" class="_uploadABtn" onclick="edit('+cellval+')" recordId="'+cellval+'" title="编辑">编辑</a>';
		   			//}
	   				var setContent = '';
		   			//if(splashScreen_UPDATE){
	   				if(rowData['isLeaf']=='1'){
	   					setContent = '<a href="javascript:void(0)" class="_uploadABtn" onclick="setContent('+cellval+')" recordId="'+cellval+'" title="内容设置">内容设置</a>';
	   				}
	   					//}
		   			var suppendOrValid = '';
		   			//if(splashScreen_SUPPEND){
		   				suppendOrValid = rowData['status'] == '0'? '<a href="javascript:void(0)" class="_uploadABtn" onclick="valid('+cellval+')" recordId="'+cellval+'" title="启用">启用</a>' : '<a href="javascript:void(0)" class="_uploadABtn" onclick="suspendOne('+cellval+')" recordId="'+cellval+'" title="暂停">暂停</a>';
		   			//}
	   				var moveUp = '';
		   			//if(splashScreen_SUPPEND){
	   					moveUp = '<a href="javascript:void(0)" class="_uploadABtn" onclick="moveUp('+cellval+')" recordId="'+cellval+'" title="上移">上移</a>';
		   			//}
   					var moveDown = '';
		   			//if(splashScreen_SUPPEND){
   						moveDown = '<a href="javascript:void(0)" class="_uploadABtn" onclick="moveDown('+cellval+')" recordId="'+cellval+'" title="下移">下移</a>';
		   			//}
		   			var log='<a href="javascript:void(0)" onclick="showdiary(this,\''+cellval+'\')" title="日志" >日志</a>'
		   			return edit+setContent+suppendOrValid+moveUp+moveDown+log;
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
		$("#catalogList").setGridWidth($(".usermain").width()*1);
	}
}

//单条删除
function deleteOne(id) {
	if(id!=null){
		$.ajax({
			type : "get",
			url : ctx+"/catalog/arrange/delete.do?ids="+id,
			data : "",
			dataType : "json",
			async : true,
			cache : false,
			success : function(data){
				if(data.success){
					myDialog.showAlert("删除成功！");
					jQuery("#catalogList").trigger('reloadGrid');
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
		myDialog.showConfirm("此操作会暂停此分类及其子分类，您确定吗？",function(){
			$.ajax({
				type : "get",
				url : ctx+"/catalog/arrange/suspend.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("暂停成功！");
						jQuery("#catalogList").trigger('reloadGrid');
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
		myDialog.showConfirm("此操作会启用此分类及其子分类，您确定吗？",function(){
			$.ajax({
				type : "get",
				url : ctx+"/catalog/arrange/valid.do?ids="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("启用成功！");
						jQuery("#catalogList").trigger('reloadGrid');
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
//上移
function moveUp(id) {
	if(id!=null){
		var a = $("#"+id);
		var b = a.prev().attr("id");
		if(b==null){
			myDialog.showAlert("不可以上移了！");
			return;
		}
		var ids = new Array();
		ids[0]=id;
		ids[1]=b;
		move(ids);
	}
}
//下移
function moveDown(id) {
	if(id!=null){
		var a = $("#"+id);
		var b = a.next().attr("id");
		if(b==null){
			myDialog.showAlert("不可以下移了！");
			return;
		}
		var ids = new Array();
		ids[0]=id;
		ids[1]=b;
		move(ids);
	}
}
//移动
function move(ids){
	if(ids!=null){
		myDialog.showConfirm("此操作会改变分类显示顺序，您确定吗？",function(){
			$.ajax({
				type : "get",
				url : ctx+"/catalog/arrange/move.do?ids="+ids,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						myDialog.showAlert("移动成功！");
						jQuery("#catalogList").trigger('reloadGrid');
				    }else{
				    	myDialog.showAlert(data.message);
				    }
				},
				error : function(){
				
				}
			});
    	});		
	}
}
function showdiary(obj,dataId){
	var url = ctx+"/catalog/arrange/operations.do?dataId="+dataId;
	$(".tips").load(url,function(){
		diary(obj);
	});
}
//孩子节点
function hasChild(id){
	var onOrOff = $("#onOrOff_"+id);
	var flag = onOrOff.text();
	if(flag.indexOf("+")>=0){		
		onOrOff.text(flag.replace("+","-"));
		var level = parseInt(onOrOff.attr("level"));
		level=level+1;
		if(id!=null){			
			$.ajax({
				type : "get",
				url : ctx+"/catalog/arrange/getChildren.do?parentId="+id,
				data : "",
				dataType : "json",
				async : true,
				cache : false,
				success : function(data){
					if(data.success){
						var child;
						var lastTr = $("#"+id);
						var blank = '';
						for(var i = 0; i<level;i++){
							blank=blank+'&nbsp;&nbsp;&nbsp;&nbsp;';
						}
						for(var i=0;i<data.data.length;i++){
							child = data.data[i];						
							var html='<tr id="'+child.id+'" class="ui-widget-content jqgrow ui-row-ltr" tabindex="-1" role="row" aria-selected="false">'
									 +'<td aria-describedby="catalogList_cb" style="text-align:center;width: 60px;" role="gridcell">'
									 +		'<input id="jqg_catalogList_'+child.id+'" class="cbox" type="checkbox" name="jqg_catalogList_'+child.id+'" role="checkbox">'
									 +'</td>';
							if(child.isLeaf=='0'){
								html=html
									 +'<td aria-describedby="catalogList_id" title="+'+child.name+'" style="text-align:left;" role="gridcell">'
									 +		'<a class="_uploadABtn" title="子节点" recordid="'+child.id+'" onclick="hasChild('+child.id+')" href="javascript:void(0)">'
									 +			'<span level="'+level+'" id="onOrOff_'+child.id+'"style="color: rgb(0, 0, 255);">'+blank+'+</span>'
									 +		'</a>'+child.name
									 +'</td>';
								html=html
									 +'<td aria-describedby="catalogList_isLeaf" title="子分类" style="text-align:center;" role="gridcell">子分类</td>';
							}else{
								html=html
									 +'<td aria-describedby="catalogList_id" title="1" style="text-align:left;" role="gridcell">'+blank+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+child.name;+'</td>';
								html=html
									 +'<td aria-describedby="catalogList_isLeaf" title="内容资源" style="text-align:center;" role="gridcell">内容资源</td>';
							}
							if(child.status=='0'){
								html=html
									 +'<td aria-describedby="catalogList_status" title="暂停" style="text-align:center;" role="gridcell">暂停</td>';
							}else{
								html=html
								 +'<td aria-describedby="catalogList_status" title="启用" style="text-align:center;" role="gridcell">启用</td>';
							}
							if(child.contentSources == '0'){
								html=html
								     +'<td aria-describedby="catalogList_contentSources" style="text-align:center;" role="gridcell">自动获取</td>';
							}else if(child.contentSources=='1'){
								html=html
								     +'<td aria-describedby="catalogList_contentSources" style="text-align:center;" role="gridcell">人工运营</td>';
							}else{
								html=html
									 +'<td aria-describedby="catalogList_contentSources" style="text-align:center;" role="gridcell"></td>';
							}
							var edit = '';
				   			//if(splashScreen_UPDATE){
				   				edit = '<a href="javascript:void(0)" class="_uploadABtn" onclick="edit('+child.id+')" recordId="'+child.id+'" title="编辑">编辑</a>';
				   			//}
			   				var setContent = '';
				   			//if(splashScreen_UPDATE){
			   				if(child.isLeaf=='1'){			   					
			   					setContent = '<a href="javascript:void(0)" class="_uploadABtn" onclick="setContent('+child.id+')" recordId="'+child.id+'" title="内容设置">内容设置</a>';
							}
			   				//}
				   			var suppendOrValid = '';
				   			//if(splashScreen_SUPPEND){
				   				suppendOrValid = child.status == '0'? '<a href="javascript:void(0)" class="_uploadABtn" onclick="valid('+child.id+')" recordId="'+child.id+'" title="启用">启用</a>' : '<a href="javascript:void(0)" class="_uploadABtn" onclick="suspendOne('+child.id+')" recordId="'+child.id+'" title="暂停">暂停</a>';
				   			//}
			   				var moveUp = '';
				   			//if(splashScreen_SUPPEND){
			   					moveUp = '<a href="javascript:void(0)" class="_uploadABtn" onclick="moveUp('+child.id+')" recordId="'+child.id+'" title="上移">上移</a>';
				   			//}
		   					var moveDown = '';
				   			//if(splashScreen_SUPPEND){
		   						moveDown = '<a href="javascript:void(0)" class="_uploadABtn" onclick="moveDown('+child.id+')" recordId="'+child.id+'" title="下移">下移</a>';
				   			//}
				   			var log='<a href="javascript:void(0)" onclick="showdiary(this,\''+child.id+'\')" title="日志" >日志</a>'
							html=html
								 +"<td>"
								 +edit + setContent + suppendOrValid + moveUp + moveDown + log;
				   				 +"</td>"
							html=html
								 +'</tr>';
							lastTr.after(html);
							lastTr=$("#"+child.id);							 
						}
				    }else{
				    	//myDialog.showAlert(data.message);
				    }
				},
				error : function(){
				
				}
			});
		}
	}else{
		onOrOff.text(flag.replace("-","+"));
		$.ajax({
			type : "get",
			url : ctx+"/catalog/arrange/getDescendant.do?parentId="+id,
			data : "",
			dataType : "json",
			async : true,
			cache : false,
			success : function(data){
				if(data.success){
					var child;
					var childTr;
					for(var i=0;i<data.data.length;i++){
						child = data.data[i];						
						childTr = $("#"+child.id);
						childTr.remove();
					}
			    }else{
			    	//myDialog.showAlert(data.message);
			    }
			},
			error : function(){
			
			}
		});
	}
	
}