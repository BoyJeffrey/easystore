/* Common api */
(function($){
	var win = window ;
	var doc = document ;
	var cms = win.cms = win.cms || {
		//baseUrl : "" 
        baseUrl : ""
	} ;
	var util = cms.util = {} ;
	/* update cms code*/
	util.datePicker = function(elem){
		var datePickerOptions = {
			dateFormat      : "yy-mm-dd" ,
			currentText     : "今天" ,
			prevText        : "前一月" ,
			nextText        : "后一月" ,
			closeText       : "关闭" ,
			monthNames      : ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","一十月","十二月"] ,
			monthNamesShort : ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"] ,
			dayNamesMin     : ["日","一","二","三","四","五","六"] ,
			dayNames        : ["日","一","二","三","四","五","六"] ,
			showButtonPanel : true ,
			showOn          : "button" ,
			buttonImage     : "images/calendar.gif" ,
			buttonImageOnly : true ,
			buttonText      : "请选择日期" 
		} ;
		elem.datepicker(datePickerOptions) ;
	} ;
	util.kindEditor = function(elem,callback){
		var kindEditorOptions = {
			width  : "100%" ,
			height :"220px" ,
			items  : [
				"source" , "|" , "undo" , "redo" , "cut" , "copy" , "paste" ,
				"plainpaste"  , "wordpaste" , "|" , "justifyleft" , "justifycenter" , 
				"justifyright" ,"justifyfull" , "insertorderedlist" , "insertunorderedlist" , 
				"indent" , "outdent" , "subscript" ,"superscript" , "|" , "selectall" , "-" ,
				"title" , "fontname" , "fontsize" , "|" , 'textcolor' , "bgcolor" , "bold" ,
				"italic" , "underline" , "strikethrough" , 'removeformat' , "hr"
			]
		} ;
		KindEditor.ready(function(K){
			$.isFunction(callback) && callback(K.create(elem,kindEditorOptions)) ;

		}) ;
	} ;
	util.cmsBox = function(data,type,opts,flag){
		var title = opts["title"] || "CMS_BOX" ;
		var root = $("#cms_box").fadeIn();
		var title = root.find(".t").text(title) ;
		var content = root.find(".c").empty() ;
		var cls = root.find(".cls").on("click",function(){
			root.fadeOut() ;		
		}) ;
		var typeHooks = {
			"photo_list" : function(data){
				var photoListWrap = $("<div class='photo-list-wrap'></div>").appendTo(content) ;
				var photoContent = $("<div class='photo-content'></div>").appendTo(photoListWrap) ;
				//var imageUrl = "http://203.100.80.150/img/" ;
				$.each(data,function(i,item){
					var photoInfo = $("<div class='photo-info'></div>").appendTo(photoContent) ;
					var delIcon = $("<span class='close'>X</span>").attr("id",item["id"])
					.appendTo(photoInfo)
					.on("click",function(){
						$.ajax({ 
						 	url : cms.baseUrl + "/jybb-upload/image/delete.json?imageId=" + delIcon.attr("id") ,
						   	type : "GET" ,
						    dataType: "json" ,
						    success:function(data){
						    	photoInfo.remove() ;
						    } ,
					        error:function(){
					        	alert("图片删除失败!") ;
					        }
				 		}) ;
					}) ;console.log(item)
					var photoIcon = $("<div class='icon'></div>").appendTo(photoInfo) ;
					var photoImage = $("<img width='320' height='240' />")
					//.attr("src",imageUrl + item["imageDirName"] + "/" + item["imageName"])
                    .attr("src", "http://" + item["imageDirName"] + ".oss-cn-beijing.aliyuncs.com/" + item["imageName"])
					.appendTo(photoIcon) ;
					var photoName = $("<div class='name'></div>").appendTo(photoInfo) ;
					if(true === flag){
						photoName.text("序号1：") ;
						var sortEdit = $("<input class='sort-edit' type='text' />").val(item["sortBy"]).appendTo(photoName) ;
						var descEdit = $("<input type='text' />");
						descEdit.val(item["imageDesc"]).appendTo(photoName);
						var editButt = $("<a href=''>确定</a>")
						.appendTo(photoName)
						.on("click",function(e){
							var imageData = {
									"imageId":""+item["id"],
									"imageDesc":encodeURI(descEdit.val()),
									"imageSortBy":sortEdit.val()
							};
							console.log(descEdit);
							$.ajax({ 
							 	url : cms.baseUrl + "/jybb-upload/image/addDesc.json",
							   	type : "POST" ,
							    dataType: "json" ,
							    data : JSON.stringify(imageData) ,
							    success:function(result){
							    	alert("图片信息编辑成功!") ;
							    } ,
						        error:function(){
						        	alert("图片信息编辑失败!") ;
						        }
					 		}) ;
							e.preventDefault() ;
						}) ;
					}
					else{
						var radioIconButt = $("<a href='' class='radio-icon-button'>设为封面</a>")
						.appendTo(photoName)
						.on("click",function(e){
							$("#imageId").data("imgId",item["id"]) ;
							root.hide() ;
							var iconRoot = $("#iconView").fadeIn() ;
							iconRoot.find("img").attr("src",item["imageUrl"]) ;
							e.preventDefault() ;
						}) ;
					}
				}) ;
			}
		} ;
		var hooks = typeHooks[type] ;
		if(hooks){
			hooks(data) ;
		}
		else{
			throw new Error("无效的参数类型：" + "<" + type + ">") ;
		}
	} ;
	/* update cms code*/
	util.renderForm = function(name,items,paramArray,sellerId,serverId,strategyId,frame){
		var root = $("#dcContent") ;
		var infoMain = $("<div class='info-main'></div>").attr("id",serverId).appendTo(root) ;
		var infoTag = $("<div class='info-tag'></div>").text(name).appendTo(infoMain) ;
		var infoWrap = $("<div class='info-wrap'></div>").appendTo(infoMain) ;
		var _iframe;
		var formHooks = {
			"textbox"  : function(id,elem,type,text,comment){
				var item = $("<div class='item'></div>").attr("id",id + "_1").appendTo(infoWrap) ;
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var uiCon = $("<div class='ui-con'></div>").appendTo(item) ;
				var input = $("<input class='input-text' type='text' />")
				.attr("id",id)
				.attr("name",id)
				.attr("data-type",type)
				.appendTo(uiCon) ;
				var cmt = $("<div style='color:#ff3300'></div>").text(comment || "").appendTo(uiCon) ;
			} ,
			"select"   : function(id,elem,type,text){
				var item = $("<div class='item'></div>").appendTo(infoWrap)
				.attr("id",id + "_1")
				.attr("data-type",type) ;
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var uiCon = $("<div class='ui-con'></div>").appendTo(item) ;
				var select = $("<select></select>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(uiCon) ;
				var list = elem.find("item") ;
				list.each(function(){
					var text = $(this).text() ;
					var value = $(this).attr("value") ;
					var option = $("<option></option>")
					.text(text)
					.val(value)
					.appendTo(select) ;
				}) ;
			} ,
			"checkbox" : function(id,elem,type,text){
				var item = $("<div class='item'></div>").appendTo(infoWrap)
				.attr("id",id)
				.attr("data-type",type);
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var uiCon = $("<div class='ui-con'></div>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(item) ;
				var list = elem.find("item") ;
				list.each(function(i){
					var text = $(this).text() ;
					var value = $(this).attr("value") ;
					var spanWrap = $("<span></span>").appendTo(uiCon) ;
					var input = $("<input type='checkbox' />")
					.attr("name",value)
					.attr("value",value)
					.appendTo(spanWrap) ;
					uiCon.append("<span class='fuck" + value + "'>"+ text + "</span>") ;
					if("sellerFeature" === id){
						input.attr("id","check_" + i) ;
					}
				}) ;
			} ,
			"radio"    : function(id,elem,type,text){
				var item = $("<div class='item'></div>").appendTo(infoWrap)
				.attr("id",id)
				.attr("data-type",type);
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var uiCon = $("<div class='ui-con'></div>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(item) ;
				var list = elem.find("item") ;
				list.each(function(){
					var text = $(this).text() ;
					var value = $(this).attr("value") ;
					var spanWrap = $("<span></span>").appendTo(uiCon) ;
					var input = $("<input type='radio' />")
					.attr("name",type + "_" + id)
					.attr("value",value)
					.appendTo(spanWrap) ;
					uiCon.append(text) ;
				}) ;
			} ,
			"textarea" : function(id,elem,type,text,comment){
				var item = $("<div class='item'></div>").appendTo(infoWrap).attr("id",id + "_1") ;
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var other = $("<div class='other'></div>").appendTo(item) ;
				var textarea = $("<textarea></textarea>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(other) ;
				var cmt = $("<div style='color:#ff3300'></div>").text(comment || "").appendTo(other) ;
			} ,
			"date" : function(id,elem,type,text){
				var item = $("<div class='item'></div>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(infoWrap) ;
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var other = $("<div class='other'></div>").appendTo(item) ;
				var dateText = $("<input style='border:1px solid #00a8ff;margin-right:5px;height:32px;border-radius: 11px' type='text' readonly='readonly' id='datepicker'>").appendTo(other) ;
			} ,
			"selectFile" : function(id,elem,type,text){
			//	var belongId = (strategyId) ? strategyId : sellerId ;
				var item = $("<div class='item'></div>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(infoWrap) ;
				var uiCon = $("<div class='ui-con' id='iconView' style='text-align:center;display:none'></div>").appendTo(item) ;
				var iconContent = $("<img width=320 height=240 />").appendTo(uiCon) ;
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var viewListButton = $("<a href='' style='margin-right:10px'></a>").text("查看图片").appendTo(item) ;
				viewListButton.on("click",function(e){
					$.ajax({
					 	url : "/jybb-upload/image/list.json?belongId=" + strategyId + "&imageCatalog=f10" ,
					   	type : "GET" ,
					    dataType: "json" ,
					    success:function(data){
					    	var images = null ;
					    	if("200" === data["code"]){
					    		images = data["result"] ;
					    		util.cmsBox(images,"photo_list",{title:text},false) ;  		
					    	}
					    } ,
				        error:function(){
				        	alert("图片列表获取失败!") ;
				        }
			 		}) ;
					e.preventDefault() ;
				}) ;
			} ,
			"htmlEditer" : function(id,elem,type,text){
				var item = $("<div class='item'></div>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(infoWrap) ;
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var other = $("<div class='other'></div>").appendTo(item) ;
				var belongId = (strategyId) ? strategyId : sellerId ;
			
				var editorText = $("<iframe id='frameContent' width='80%' height='400' scrolling=no src='/cms/strategy/getStrategyEditor?id="+sellerId+"&strategyId="+strategyId+"'></iframe>").appendTo(other) ;
				_iframe = $("#frameContent")[0].contentWindow;
			} ,
			"roomlist" : function(id,elem,type,text){
				var item = $("<div class='item'></div>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(infoWrap)
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var uiCon = $("<div class='ui-con'></div>")
				.appendTo(item) ;
				
				var creatorRoom = $("<a href=''></a>").text("添加房间")
				.appendTo(item)
				.on("click",function(e){
					var roomElem = $("#roomName") ;
					if($.trim(roomElem.val())){
						postdata = cms.util.setOrGetFormValue(paramArray) ;
				        postdata["collectDate"] = new Date().toLocaleString() ;
				        postdata["hasFinished"] = "0" ;
				        postdata["sellerId"] = sellerId + "" ;
				        var roomData = {
					   		"roomName" : postdata["roomName"] , 
					   		"roomPrice": postdata["roomPrice"] , 
			   				"roomSize" : postdata["roomSize"] , 
			   				"doubleBedCount" : postdata["doubleBedCount"] , 
			   				"singleBedCount" : postdata["singleBedCount"] , 
			   				"roomFacility" : postdata["roomFacility"] , 
			   				"introduction" : postdata["introduction"] , 
			   				"collectDate" : postdata["collectDate"] , 
			   				"hasFinished" : postdata["hasFinished"] , 
			   				"bedType" : postdata["bedType"] ,
			   				"roomNum" : postdata["roomNum"] ,
			   				"sellerId" : postdata["sellerId"]
						} ;
				        $.ajax({
						 	url : cms.baseUrl + "/cms/seller/room/add.json" ,
						   	type : "POST" ,
						   	data : JSON.stringify(roomData) ,
						    dataType: "json" ,
						    success:function(json){
						    	roomData["id"] = json["result"] + "" ;
						    	util.roomCreator(uiCon,roomData) ;
						    } ,
					        error:function(){
					        	alert("房间信息失败!") ;
					        	roomElem.focus() ;
					        }
				 		}) ;
					}
					else{
						alert("房间名称不能为空!") ;
					}
					e.preventDefault() ;
				}) ;
			} ,
			"file" : function(id,elem,type,text){
				
				var belongId = (strategyId) ? strategyId : sellerId ;
				var item = $("<div class='item'></div>")
				.attr("id",id)
				.attr("data-type",type)
				.appendTo(infoWrap) ;
				var tag = $("<div class='tag'></div>").text(text + "：").appendTo(item) ;
				var uploadButton = $("<a id='" + id + "_button' href=''></a>").text(text).appendTo(item) ;
				var viewListButton = $("<a href='' style='margin-right:10px'></a>").text("查看图片").appendTo(item) ;
				viewListButton.on("click",function(e){
					$.ajax({
					 	url : "/jybb-upload/image/list.json?belongId=" + belongId + "&imageCatalog=" + elem.attr("value") ,
					   	type : "GET" ,
					    dataType: "json" ,
					    success:function(data){
					    	var images = null ;
					    	if("200" === data["code"]){
					    		images = data["result"] ;
					    		util.cmsBox(images,"photo_list",{title:text},true) ;  		
					    	}
					    } ,
				        error:function(){
				        	alert("图片列表获取失败!") ;
				        }
			 		}) ;
					e.preventDefault() ;
				}) ;
				var uiCon = $("<div class='ui-con'></div>").appendTo(item) ;
				var iconWrap = $("<div class='icon-wrap'></div>").appendTo(uiCon) ;
				var iconRoot = $("#upload-wrap") ;
				var doUploadButt = iconRoot.find(".upload-butt") ;
				iconRoot.find(".cls").on("click",function(){
					$(this).parent().fadeOut();
				}) ;
				
				var uploader = new plupload.Uploader({
				    browse_button: id + "_button" ,
				    url: cms.baseUrl +  "/jybb-upload/image/upload.do?belongId=" + belongId + "&imageCatalog=" + elem.attr("value")
				}) ;
				uploader.init() ;
				
				function delIcon(elem){
					elem.parent().remove() ;
				} ;
				uploader.bind('FilesAdded', function(up, files) {
					iconRoot.find("ul").empty() ;
					doUploadButt.show() ;
					iconRoot.show("slow") ;
					iconRoot.find(".text").text(uploadButton.text()) ;
					iconWrap.hide() ;
				    plupload.each(files, function(file) {
				        var li = $("<li></li>").attr("id",file.id).text(file.name + plupload.formatSize(file.size)).appendTo(iconRoot.find("ul")) ;
				        var delSpan = $("<span>X</span>")
				        .appendTo(li)
				        .on("click",function(){
				        	$(this).parent().remove() ;
				        	if(!iconRoot.find("ul > li").size()){
				        		doUploadButt.hide() ;
				        		iconRoot.hide() ;
				        	}
				        }) ;
				    });
				    
				});
				uploader.bind('UploadProgress', function(up, file) {
				    //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
					iconRoot.hide() ;
					iconWrap.fadeIn().text("图片已成功上传!") ;
					
				});
				uploader.bind('Error', function(up,err) {
				    alert("文件上传发生错误，请重试!") ;
				});
				uploadButton.on("click",function(){
					doUploadButt.on("click",function(){
						uploader.start() ;
						$(this).unbind("click") ;
					}) ;
				
				}) ;
			}
		} ;
		items.each(function(){
			var propId = $(this).attr("name") ;
			if(
				"roomType" != propId && 
				"roomPrice" != propId &&
				"roomSize" != propId && 
				"doubleBedCount" != propId &&
				"singleBedCount" != propId && 
				"roomFacility" != propId &&
				"introduction" != propId && 
				"roomImage" != propId &&
				"perConsume" != propId && 
				"specialFood" != propId &&
				"specialFoodImage" != propId && 
				"foodMenu" != propId
			){
				try{
					dsoRule["check_0"].push(propId) ;
				}catch(e){
					
				}
			}
			if(
				"scenicLevel" != propId && 
				"advisePlayDays" != propId &&
				"sellerBestPlayTime" != propId && 
				"boomSeasonOpenTime" != propId &&
				"dullSeasonOpenTime" != propId && 
				"boomSeasonTicketPrice" != propId &&
				"dullSeasonTicketPrice" != propId && 
				"preferential" != propId &&
				"playConstHour" != propId && 
				"playMapImage" != propId &&
				"roomType" != propId && 
				"roomPrice" != propId &&
				"roomSize" != propId && 
				"doubleBedCount" != propId &&
				"singleBedCount" != propId && 
				"roomFacility" != propId &&
				"introduction" != propId && 
				"roomImage" != propId
			){
				
				try{
					dsoRule["check_1"].push(propId) ;
				}catch(e){
					
				}
			}
			if(
				"scenicLevel" != propId && 
				"advisePlayDays" != propId &&
				"sellerBestPlayTime" != propId &&
				"sellerFoodInfo" != propId && 
				"perConsume" != propId && 
				"specialFood" != propId &&
				"specialFoodImage" != propId && 
				"foodMenu" != propId&&
				"scenicLevel" != propId && 
				"advisePlayDays" != propId &&
				"sellerBestPlayTime" != propId && 
				"boomSeasonOpenTime" != propId &&
				"dullSeasonOpenTime" != propId && 
				"boomSeasonTicketPrice" != propId &&
				"dullSeasonTicketPrice" != propId && 
				"preferential" != propId &&
				"playConstHour" != propId && 
				"playMapImage" != propId		
			){
				try{
					dsoRule["check_2"].push(propId) ;
				}catch(e){
					
				}
			}
			paramArray.push(propId) ;
			var elem = $(this) ;
			var tagText = $(this).attr("showText") ;
			var inputType = $(this).attr("type") ;
			var comment = $(this).attr("comment") ;
			var hooks = formHooks[inputType](propId,elem,inputType,tagText,comment) ;
		}) ;
	} ;
	util.roomCreator = function(elem,data){
		var serviceList = !data["roomFacility"] || !data["roomFacility"].split("-") ? "" : data["roomFacility"].split("-") ;
		var serviceText = [] ;
		if(serviceList){
			$.each(serviceList,function(i,service){
				var classId =  ".fuck" + service ;
				serviceText.push($(classId).text()) ;
			}) ;
		}
		var tpl = "" ;
		tpl += "<div><span>房间名称：</span><input type='text' value='" + (data["roomName"] || '') + "' /></div>" ;
		tpl += "<div><span>房间数量：</span><input type='text' value='" + (data["roomNum"] || '') + "' /></div>" ;
		tpl += "<div><span>价格：</span><input type='text' value='" + (data["roomPrice"] || '') + "' /></div>" ;
		tpl += "<div><span>面积：</span><input type='text' value='" + (data["roomSize"] || '') + "' /></div>" ;
		
		var bedType = data["bedType"] || '';
		if(bedType == 1){
			bedType = "<option value='0'>无</option><option value='1' selected='selected'>大床</option><option value='2'>多床</option><option value='3'>双床</option><option value='4'>单人床</option><option value='5'>大/双</option>";
		}else if(bedType == 2){
			bedType = "<option value='0'>无</option><option value='1'>大床</option><option value='2' selected='selected'>多床</option><option value='3'>双床</option><option value='4'>单人床</option><option value='5'>大/双</option>";
		}else if(bedType == 3){
			bedType = "<option value='0'>无</option><option value='1'>大床</option><option value='2'>多床</option><option value='3' selected='selected'>双床</option><option value='4'>单人床</option><option value='5'>大/双</option>";
		}else if(bedType == 4 ){
			bedType = "<option value='0' selected='selected'>无</option><option value='1'>大床</option><option value='2'>多床</option><option value='3'>双床</option><option value='4' selected='selected'>单人床</option><option value='5'>大/双</option>";
		}else if(bedType == 5){
			bedType = "<option value='0' selected='selected'>无</option><option value='1'>大床</option><option value='2'>多床</option><option value='3'>双床</option><option value='4'>单人床</option><option value='5' selected='selected'>大/双</option>";
		}else{
			bedType = "<option value='0' selected='selected'>无</option><option value='1'>大床</option><option value='2'>多床</option><option value='3'>双床</option><option value='4'>单人床</option><option value='5'>大/双</option>";
		}
		tpl += "<div><span>床型：</span><select id=''>"+bedType+"</select></div>" ;
		tpl += "<div><span>单人床位数量：</span><input type='text' value='" + (data["singleBedCount"] || '') + "' /></div>" ;
		tpl += "<div><span>双人床位数量：</span><input type='text' value='" + (data["doubleBedCount"] || '') + "' /></div>" ;	
		tpl += "<div id='moreText'><span>配套服务：</span><input type='text' readonly='readonly' value='" + (serviceText || serviceText.join(",") || "") + "' /></div>" ;	
		//tpl += "<div id='moreText'><span>配套服务：</span><input type='text' value='" + (serviceText.join(",") || "") + "' /></div>" ;
		tpl += "<div><span>房间简介：</span><input type='text' value='" + (data["introduction"] || '') + "' /></div>" ;
		var roomInfo = null ;
		if("ui-con" !== elem.attr("class")){
			elem = elem.find(".ui-con") ;
		}
		roomInfo = $("<div class='roomInfo'></div>").appendTo(elem) ;
		roomInfo.html(tpl) ;
		
		
		
		var delRoom = $("<span class='del'>X</span>")
		.attr("id",data["id"])
		.appendTo(roomInfo)
		.on("click",function(e){
			$.ajax({ 
			 	url : cms.baseUrl + "/cms/seller/room/delete.json?id=" + delRoom.attr("id") ,
			   	type : "GET" ,
			    dataType: "json" ,
			    success:function(data){
			    	roomInfo.remove() ;
			    } ,
		        error:function(){
		        	alert("房间删除失败!") ;
		        }
	 		}) ;
			e.preventDefault() ;
		}) ;
		var editRoom = $("<span class='edit'>...</span>")
		.attr("id",data["id"])
		.appendTo(roomInfo)
		.on("click",function(e){
            var inputs = roomInfo.find("input[type=text]") ;
            var selects = roomInfo.find("select") ;
			var roomData = {
			   		"roomName" : inputs.eq(0).val() , 
			   		"roomNum" : inputs.eq(1).val() , 
			   		"roomPrice": inputs.eq(2).val() , 
	   				"roomSize" : inputs.eq(3).val() ,
	   				"bedType" : selects.eq(0).val() ,
	   				"doubleBedCount" : inputs.eq(5).val() , 
	   				"singleBedCount" : inputs.eq(4).val() , 
	   				"roomFacility" : "" , 
	   				"introduction" : inputs.eq(7).val() ,  
	   				"collectDate" : new Date().toLocaleString(),
	   				"hasFinished" : "0"
				} ;
			$.ajax({ 
			 	url : cms.baseUrl + "/cms/seller/room/update.json?id=" + editRoom.attr("id") ,
			   	type : "post" ,
			    dataType: "json" ,
			    data : JSON.stringify(roomData) ,
			    success:function(data){
			    	alert("房间信息编辑成功!") ;
			    } ,
		        error:function(){
		        	alert("房间信息编辑失败!") ;
		        }
	 		}) ;
			e.preventDefault() ;
		}) ;

		var viewIcon = $("<span class='view-icon'>*_*</span>")
		.attr("id",data["id"])
		.appendTo(roomInfo)
		.on("click",function(e){
			$.ajax({
			 	url : cms.baseUrl + "/jybb-upload/image/list.json?belongId=" + data["id"] + "&imageCatalog=f9" ,
			   	type : "GET" ,
			    dataType: "json" ,
			    success:function(data){
			    	var images = null ;
			    	if("200" === data["code"]){
			    		images = data["result"] ;
			    		util.cmsBox(images,"photo_list",{title:"房间图片"},true) ;  		
			    	}
			    } ,
		        error:function(){
		        	alert("图片列表获取失败!") ;
		        }
	 		}) ;
			e.preventDefault() ;
		}) ;

		var iconRoot = $("#upload-wrap") ;
		var doUploadButt = iconRoot.find(".upload-butt") ;
		iconRoot.find(".cls").on("click",function(){
			$(this).parent().fadeOut();
		}) ;
		var postIcon = $("<span class='post-icon'>↑</span>")
		.attr("id","postIcon_" + data["id"])
		.appendTo(roomInfo) ;
		var uploader = new plupload.Uploader({
		    browse_button: "postIcon_" + data["id"]  ,
		    url: cms.baseUrl +  "/jybb-upload/image/upload.do?belongId=" + data["id"] + "&imageCatalog=f9"
		}) ;
		uploader.init() ;
		function delIcon(elem){
			elem.parent().remove() ;
		} ;
		uploader.bind('FilesAdded', function(up, files) {
			iconRoot.find("ul").empty() ;
			doUploadButt.show() ;
			//iconWrap.hide() ;
		    plupload.each(files, function(file) {
		        var li = $("<li></li>").attr("id",file.id).text(file.name + plupload.formatSize(file.size)).appendTo(iconRoot.find("ul")) ;
		        var delSpan = $("<span>X</span>")
		        .appendTo(li)
		        .on("click",function(){
		        	$(this).parent().remove() ;
		        	if(!iconRoot.find("ul > li").size()){
		        		doUploadButt.hide() ;
		        		iconRoot.hide() ;
		        	}
		        }) ;
		    });
		    
		});
		uploader.bind('UploadProgress', function(up, file) {
		    //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			iconRoot.hide() ;
			//iconWrap.fadeIn().text("图片已成功上传!") ;
			
		});
		uploader.bind('Error', function(up,err) {
		    alert("文件上传发生错误，请重试!") ;
		}) ;
		iconRoot.find(".cls").on("click",function(){
			$(this).parent().fadeOut();
		}) ;
		postIcon.on("click",function(e){
			iconRoot.show("slow") ;
			iconRoot.find(".text").text("房间图片展示") ;
			doUploadButt.on("click",function(){
				uploader.start() ;
				$(this).unbind("click") ;
			}) ;
			e.preventDefault() ;
		}) ;
	} ;
	util.getCheckedValue = function(elem,hack){ // old api
		var ret = [] ;
		elem.each(function(){
			var value = (true == hack) ? $(this).text() : $(this).val() ;
			ret.push(value) ;
		}) ;
		return ret.join("-") ;
	} ;
	util.setOrGetFormValue = function(data){
		var jsondata = {} ;
        $.each(data,function(i,value){
	        var elem = $.isPlainObject(data) ? $("#" + i) : $("#" + value) ;
	        var type = elem.data("type") + "" ;
	        if("textbox" === type || "textarea" === type){
	          if($.isPlainObject(data)){
	              elem.val(value) ;
	          }
	          else{
	              jsondata[value] = elem.val() ;
	          }
	        }
	        else if("select" === type){
	          if($.isPlainObject(data)){
	         elem.find("option").eq(parseInt(value)).prop("selected",true) ;
	            
	            elem.find("option").each(function(){
	            	
	            	if($(this).attr("value") === data["coordinateSystemType"] + ""){
	            		$(this).prop("selected",true) ;
	            	}
	            }) ;
	            
	            elem.data("areaValue",value);
	          }
	          else{
	            jsondata[value] = elem.val() || "" ;
	          }
	        }
	        else if("radio" === type){
	          if($.isPlainObject(data) ){ // edit
	            if(!value) return ;
	            $.each(value.split("-"),function(i,val){
	            elem.find("input[type=radio]").each(function(){
					if($(this).val() == val){
						$(this).prop("checked",true) ;	
					}
	              })
	            }) ;
	          }
	          else{
	            jsondata[value] = elem.find("input:checked").val() || "" ;
	          }
	        }
	        else if("checkbox" === type){
	          if($.isPlainObject(data)){
	        	if(!value) return ;
	            $.each(value.split("-"),function(i,val){
	            elem.find("input[type=checkbox]").each(function(){
					if($(this).val() == val){
						$(this).prop("checked",true) ;	
					}
	              })
	            }) ;
	          }
	          else{
	            jsondata[value] = cms.util.getCheckedValue(elem.find("input:checked")) ;
	          }
	        }
	        else if("3" === type){
	          if($.isPlainObject(data)){
	          	if(1 === value.split("-").length && !value) return ;
	            $.each(value.split("-"),function(i,tag){
	              $("<span></span>").text(tag).insertBefore(elem.find("a")) ;
	            }) ;    
	          }
	          else{
	            var ret = [] ;
	            elem.find("span").each(function(){
	              ret.push($(this).text()) ;
	            }) ;
	            jsondata[value] = ret.join("-") ;
	          }
	        }
	        else if("4" === type){
	          if($.isPlainObject(data)){
	          	if(1 === value.split("-").length && !value) return ;
				
	            $.each(value.split("-"),function(i,icon){
	            	var p = $("<div class='photo'></div>").appendTo(elem.find(".item").eq(0)) ;
	            	var pw = $("<div class='photo-wrap'></div>").appendTo(p) ;
					var delIcon = $("<span class='del'>X</span>").appendTo(p) ;
					var contentUrl = icon.split(".")[0] ;
					/* photo upload */
					var fileId = "id_" + new Date().getTime() ;
					var formElem = $("<form name='form' action='' method='POST' enctype='multipart/form-data'></form>").appendTo(pw) ;
					var inputFileElem = $("<input id='" + fileId + "' type='file' size='45' name='" + fileId + "' style='display:none' value='" + icon + "'/>").appendTo(formElem) ;
					var uploadButton = $("<a href=''>上传</a>") ;

					delIcon.on("click",function(e){
						$(this).parent().remove() ;
						e.preventDefault() ;
					}) ;
	            	$("<img />").attr("src",icon).appendTo(pw) ;
	            	$("<div class='text'></div>").text(contentUrl.split("/")[contentUrl.split("/").length-1]).appendTo(pw) ;
					uploadButton.appendTo(pw) ; 
					uploadButton.on("tap",function(e){
						util.uploadPhoto(fileId,"#",function(){
							
						}) ;
						e.preventDefault() ;
					}) ;  
	            }) ;
	          }
	          else{
	            var ret = [] ;
	            elem.find("img").each(function(){
	              ret.push($(this).attr("src")) ;
	            }) ;
	            jsondata[value] = ret.join("-") ;
	          }
	        }
			else if("5" === type){
				if($.isPlainObject(data)){
					util.createRoom(elem,value)
				}
				else{
					jsondata[value] = util.getRoomData(elem.find(".roomInfo div")) ;		
				}
			}
			else if("file" === type){

			}
			else if("date" === type){
				if($.isPlainObject(data)){
					elem.find("input[type=text]").val(data["data2Str"]) ;
				}
				else{
					jsondata[value] = elem.find("input[type=text]").val() ;		
				}
			}
			else if("htmlEditer" === type){
				if($.isPlainObject(data)){
					//frame.contentWindow.test(value) ;
				}
				else{
					jsondata[value] = elem.find("#editorContent").val() ;		
				}
			}
	     }) ;
	    return jsondata ;
	} ;
	
	util.getRoomData = function(elem){
		var roomData = "" ;
		var pushArray = [] ;
		elem.each(function(i,v){
			if("moreText" === $(this).attr("id")){	
				$(this).find("span").each(function(i,v){
					if(i != 0){
						pushArray.push($(this).text()) ;
					}
				}) ;
				roomData += pushArray.join(",") ;
				roomData += (i === elem.size()-1) ? "" : "|" ;
			}
			else{	
				roomData +=  $(this).find("span").eq(1).text() + "-" ; 
			}	
		}) ;
		return roomData ;
	} ;
	util.createPhoto = function(fullPath,elem,text){
		var root = elem.find(".item").eq(0) ;
		var photo = $("<div class='photo'></div>").appendTo(root) ;
		var delIcon = $("<span class='del'>X</span>").appendTo(photo) ;
		var contentUrl = fullPath.split(".")[0] ;
		var pwrap = $("<div class='photo-wrap'></div>").appendTo(photo) ;
		/* photo upload */
		var fileId = "id_" + new Date().getTime() ;
		var formElem = $("<form name='form' action='' method='POST' enctype='multipart/form-data'></form>").appendTo(pwrap) ;
		var inputFileElem = $("<input id='" + fileId + "' type='file' size='45' name='" + fileId + "' style='display:none' value='" + fullPath + "'/>").appendTo(formElem) ;
		var uploadButton = $("<a href=''>上传</a>") ;
		delIcon.on("click",function(){
			$(this).parent().remove() ;
			e.preventDefault() ;
		}) ;
		$("<img />").attr("src",fullPath).appendTo(pwrap) ;
		$("<div class='text'></div>").text(contentUrl.split("/")[contentUrl.split("/").length-1]).appendTo(pwrap) ;
		uploadButton.appendTo(pwrap) ; 
		uploadButton.on("tap",function(e){
			util.uploadPhoto(fileId,"#",function(){
				alert("上传成功!") ;
			}) ;
			e.preventDefault() ;
		}) ;  
	} ;
})(jQuery) ;

/* Business Servcie */

(function($){
	
})(jQuery) ;




$.extend({
        myTime: {
            /**
             * 当前时间戳
             * @return <int>        unix时间戳(秒)   
             */
            CurTime: function(){
                return Date.parse(new Date())/1000;
            },
            /**               
             * 日期 转换为 Unix时间戳 
             * @param <string> 2014-01-01 20:20:20  日期格式               
             * @return <int>        unix时间戳(秒)               
             */
            DateToUnix: function(string) {
                var f = string.split(' ', 2);
                var d = (f[0] ? f[0] : '').split('-', 3);
                var t = (f[1] ? f[1] : '').split(':', 3);
                return (new Date(
                        parseInt(d[0], 10) || null,
                        (parseInt(d[1], 10) || 1) - 1,
                        parseInt(d[2], 10) || null,
                        parseInt(t[0], 10) || null,
                        parseInt(t[1], 10) || null,
                        parseInt(t[2], 10) || null
                        )).getTime() / 1000;
            },
            /**               
             * 时间戳转换日期               
             * @param <int> unixTime    待时间戳(秒)               
             * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)               
             * @param <int>  timeZone   时区               
             */
            UnixToDate: function(unixTime, isFull, timeZone) {
                if (typeof (timeZone) == 'number')
                {
                    unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
                }
                var time = new Date(unixTime * 1000);
                var ymdhis = "";
                ymdhis += time.getUTCFullYear() + "-";
                ymdhis += (time.getUTCMonth()+1) + "-";
                ymdhis += time.getUTCDate() + 1;
                if (isFull === true)
                {
                    ymdhis += " " + time.getUTCHours() + ":";
                    ymdhis += time.getUTCMinutes() + ":";
                    ymdhis += time.getUTCSeconds();
                }
                return ymdhis;
            }
        }
    });
