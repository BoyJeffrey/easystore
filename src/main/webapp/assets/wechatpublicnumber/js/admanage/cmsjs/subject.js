
	var mams_contentpic={
			init:function(){$("#subjectSellerList").jqGrid({
			   	url: cms.baseUrl + '/cms/seller/getSellerList.json',
				datatype: "json",
				jsonReader:{
						root: "result.records",
						page: "result.pageNO",
						total: "result.totalPage",
						records: "result.count",
						repeatitems: true,
				},
			   	colNames:['名称','地址','操作'],
			   	colModel:[
			   		{name:'sellerName',index:'sellerName',align:"center",width:"90"},
			    	{name:'sellerAddress',index:'sellerAddress',align:"center",width:"180"},
			    	{name:'sellerId',index:'sellerId', formatter: function(cellval, rowModel , rowData){
			   			var addSellerPhotoText = '<a href="#" onclick="addPhotoText(\''+rowData['sellerName']+'\',\''+rowData['sellerId']+'\')">选择</a>';
			   			return addSellerPhotoText;
			   		},align:"center",width:"100"}
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
			$("#subjectSellerList").setGridWidth(750);
		}
	}
  	
	function getCitylist(callback){
		$.ajax({
		 	url : "/cms/city/getYesByCity.json" ,
		   	type : "GET" ,
		    dataType: "json" ,
		    success:function(json){
		        if("200" === json["code"]){
		     	  $.isFunction(callback) && callback(json["result"]) ; 
		        }
		    } ,
	        error:function(){
	        	alert("获取城市列表失败!") ;
	        }
	 	}) ;
	} ;
	
	$("#queryBtn").bind("click", function() {  
	       var paramtersData = {
	       	  "name":$("#searchBar").val(),
	       	  "citycode":$("#citycode option:selected").val(),
	       	  "status":$("#status option:selected").val()
	       };
	       var postData = $("#subjectSellerList").jqGrid("getGridParam", "postData");  
	       $.extend(postData, paramtersData);  
	       $("#subjectSellerList").jqGrid("setGridParam", {search: true}).trigger("reloadGrid", [{page:1}]); 
	      
	    });
	
  	function selectSellerDialog(){
		mams_contentpic.init();
		getCitylist(function(result){
			var root = $("#cityArea") ;
			var selects = root.find("select") ;
			var cityElem = selects.eq(0) ;
			var areaElem = selects.eq(1) ;
			$("<option></option>")
			.attr("value","")
			.text("全部城市")
			.appendTo(cityElem) ;
			cityElem.change(function(){
				var cityId = $(this).val() ;
				getAreaList(cityId,function(result){
					areaElem.empty() ;
					
					
					$.each(result,function(i,item){
						$("<option></option>")
						.attr("value",item["id"])
						.text(item["name"])
						.appendTo(areaElem) ;
					}) ;
					
				}) ;
			}) ;
			$.each(result,function(i,item){
				$("<option></option>")
				.attr("value",item["id"])
				.text(item["name"])
				.appendTo(cityElem) ;
			}) ;
		}) ;
		
  		$("#div_show_order").show();
  		
  		$("#btn_order_close").off("click").on("click",function(){
  	    	maskce();
  	    	$("#div_show_order").hide();
  	    });
  	}
	
  	
  	function addPhotoText(sellerName,sellerId){
  		saveSubject(function(){
  			var html = '<div style="border-bottom:3px solid blue;margin-bottom:20px;padding-bottom:20px;" >';
  	  		if(sellerName){
  	  			html += '<p style="width:100%;float:left" id="seller_'+sellerId+'">商家名称：'+sellerName+'</p>';
  	  		}else{
  	  			html += '<p style="width:120px;float:left"></p>';
  	  		}
  	  		
  			html += '<div id="sellerPhotoTextId_'+_countPhotoText+'">';
  			html += '<div id="photoTextId_'+_countPhotoText+'" style="border-bottom:3px solid #336699;margin-bottom:20px;padding-bottom:20px;" sellerId="'+sellerId+'">';
  			html += '<p style="width:250px;float:left"><input type="text" class="title" /></p>';
  			html += '<p style="width:150px;">图片上传：</p>';
  			html += '<p style="display:block;width:400px;height:300px"><img alt="" src="" id="subjectImg_'+_countPhotoText+'" style="width:400px;"></p>';	
  			html += '<p style="width:150px;"><input type="file" name="subjectImgUpload_'+_countPhotoText+'" id="subjectImgUpload_'+_countPhotoText+'" value="图片上传" onchange="subjectPhotoUpload(\''+_countPhotoText+'\')"/></p>';	
  			html += '<p><textarea></textarea></p>';
  			html += '<p>排序：<input type="text" class="sort" /></p>';	
  			html += '<p><input type="button" value="保存" onclick="saveOnePhotoText(\'photoTextId_'+_countPhotoText+'\',\''+sellerId+'\')" /><input type="button" value="删除" onclick="delPhotoText(\'photoTextId_'+_countPhotoText+'\',1)" /></p>';
  			html += '</div>';
  			html += '</div>';
  			html += '<p><input type="button" value="新增一个" onclick="addSellerPhotoText(\'sellerPhotoTextId_'+_countPhotoText+'\',\''+sellerId+'\')"/><input type="button" value="新增商家" onclick="selectSellerDialog()"/></p>';
  			html += '</div>';
  				
  			$("#subjectPhotoText").append(html);
  			_countPhotoText += 1;
  			maskce();
  	    	$("#div_show_order").hide();
  		});
  	}
  	
  	function addSellerPhotoText(sellerPhotoTextId,sellerId){
  		saveSubject(function(){
  			var html = '<div id="photoTextId_'+_countPhotoText+'" style="border-bottom:3px solid #336699;margin-bottom:20px;padding-bottom:20px;" sellerId="'+sellerId+'">';
  			html += '<p style="width:250px;float:left"><input type="text" class="title" /></p>';
  			html += '<p style="width:150px;">图片上传：</p>';
  			html += '<p style="display:block;width:400px;height:300px"><img alt="" src="" id="subjectImg_'+_countPhotoText+'" style="width:400px;"></p>';
  			html += '<p style="width:150px;"><input type="file" name="subjectImgUpload_'+_countPhotoText+'" id="subjectImgUpload_'+_countPhotoText+'" value="图片上传" onchange="subjectPhotoUpload(\''+_countPhotoText+'\')"/></p>';	
  			html += '<p><textarea></textarea></p>';
  			html += '<p>排序：<input type="text" class="sort" /></p>';	
  			html += '<p><input type="button" value="保存" onclick="saveOnePhotoText(\'photoTextId_'+_countPhotoText+'\',\''+sellerId+'\')" /><input type="button" value="删除" onclick="delPhotoText(\'photoTextId_'+_countPhotoText+'\',0)" /></p>';
  			html += '</div>';
  	  		$("#"+sellerPhotoTextId).append(html);
  	  		_countPhotoText += 1;
  		});
  	}
  	
  	
  	function saveOnePhotoText(photoTextId,sellerId){
  		
  		var title = $("#"+photoTextId).find(".title").val();
  		var text = $("#"+photoTextId).find("textarea").val();
  		var imgId = $("#"+photoTextId).find("img").attr("imgId");
  		var parentId = $("#subjectTitle").attr("subjectId");
  		var subjectPhotoTextId = $("#"+photoTextId).attr("subjectPhotoTextId");
  		var sort = $("#"+photoTextId).find(".sort").val();
  		var onePhotoText = {
  				"subjectId":subjectPhotoTextId,
  				"title":title,
  				"text":text,
  				"imgId":imgId,
  				"parentId":parentId,
  				"sellerId":sellerId,
  				"sort":sort
  		};
  		$.ajax({
             url:"/cms/subject/saveOnePhotoText.ojson",
             type:"POST",
             dataType: "json",
             data:JSON.stringify(onePhotoText) ,
             success:function(json){
            	 $("#"+photoTextId).attr("subjectPhotoTextId",json.result);
		    	alert("保存成功");
		     } ,
	         error:function(){
	        	alert("保存失败");
	        }
         });
  		
  	}
  	
  	function subjectPhotoUpload(elemId){
  		window.setTimeout(function(){
	  		$.ajaxFileUpload({
				url           : "/jybb-upload/image/upload.do?imageCatalog=f14",
				secureuri     : false ,
				fileElementId : "subjectImgUpload_"+elemId ,
				dataType      : "json" ,
				success       : function (data){
					var photoId = data[0] ;
	      			$.ajax({
	      				url : "/jybb-upload/image/getImgById.json?imageId=" + photoId,
	      				dataType : "json" ,
	          			success : function(imgObj){
	          				$("#subjectImg_"+elemId).attr("src",imgObj.result.imageUrl);
	          				$("#subjectImg_"+elemId).attr("imgId",imgObj.result.id);
		          		}
	          		}) ;
				} ,
				error         : function (error)
				{
					alert("上传图片失败!") ;
				},
				
			}) ;
  		},1000) ;
  	}
  	
  	function saveSubject(callback){
  		var title = $("#subjectTitle").val();
  		var subjectId = $("#subjectTitle").attr("subjectId");
  		if(subjectId){
  			callback("");
  		}else{
  			if("" == title){
  	  			alert("专题标题不能为空");
  	  			return;
  	  		}else{
  	  			var onePhotoText = {
  	  	  				"title":title,
  	  	  				"parentId":0,
  	  	  		};
  	  	  		$.ajax({
  	  	             url:"/cms/subject/saveSubject.ojson",
  	  	             type:"POST",
  	  	             dataType: "json",
  	  	             data:JSON.stringify(onePhotoText) ,
  	  	             success:function(json){
  	  	            	$("#subjectTitle").attr("subjectId",json.result);
  	  	            	callback(json);
  	  			     } ,
  	  		         error:function(){
  	  		        	alert("保存失败");
  	  		        }
  	  	         });
  	  		}
  		}
  	}
  	
  	function delPhotoText(photoTextId,isDelParent){
  		
  		var subjectPhotoTextId = $("#"+photoTextId).attr("subjectPhotoTextId");
  		if(subjectPhotoTextId){
  			$.ajax({
  	             url:"/cms/subject/delSubject.ojson?id="+subjectPhotoTextId,
  	             type:"GET",
  	             dataType: "json",
  	             success:function(json){
  	            	if(isDelParent==1){
  	            		$("#"+photoTextId).parent().parent().remove();
  	            	}else{
  	            		$("#"+photoTextId).remove();
  	            	}
  			     } ,
  		         error:function(){
  		        	alert("保存失败");
  		        }
  	         });
  		}else{
  			if(isDelParent==1){
  				$("#"+photoTextId).parent().parent().remove();
          	}else{
          		$("#"+photoTextId).remove();
          	}
  		}
  	}
  	
  	function saveAllSubject(){
  		var photoTextList = [];
  		var subjectPhotoText = {
  				"subjectList":photoTextList
  		};
  		for(var i=0;i<_countPhotoText;i++){
  			var title = $("#photoTextId_"+i).find(".title").val();
  	  		var text = $("#photoTextId_"+i).find("textarea").val();
  	  		var imgId = $("#photoTextId_"+i).find("img").attr("imgId");
  	  		var sellerId = $("#photoTextId_"+i).attr("sellerId");
  	  		var subjectPhotoTextId = $("#photoTextId_"+i).attr("subjectPhotoTextId");
  	  		var parentId = $("#subjectTitle").attr("subjectId");
  	  		var sort = $("#photoTextId_"+i).find(".sort").val();
  	  		var onePhotoText = {
  	  				"subjectId":subjectPhotoTextId,
  	  				"title":title,
  	  				"text":text,
  	  				"imgId":imgId,
  	  				"parentId":parentId,
  	  				"sellerId":sellerId,
  	  				"sort":sort
  	  		};
  	  		if(text || title || imgId || sellerId){
  	  			photoTextList[i] = onePhotoText;
  	  		}
  		}
  		photoTextList[_countPhotoText] = {"subjectId": $("#subjectTitle").attr("subjectId"),"title":$("#subjectTitle").val(),"sort":"","text":"","imgId":"","parentId":"","sellerId":""};
  		$.ajax({
             url:"/cms/subject/saveOrUpdateSubjectList.ojson",
             type:"POST",
             dataType: "json",
             data:JSON.stringify(subjectPhotoText) ,
             success:function(json){
            	alert("保存成功");
		     } ,
	         error:function(){
	        	alert("保存失败");
	        }
         });
  		
  		
  	}