function sellerPhotoTextDialog(data,type,opts,flag){
		var title = opts["title"] || "CMS_BOX" ;
		var root = $("#cms_box").fadeIn();
		var title = root.find(".t").text(title) ;
		var content = root.find(".c").empty() ;
		var cls = root.find(".cls").on("click",function(){
			root.fadeOut() ;		
		}) ;
		var typeHooks = {
			"photo_list" : function(data){
				var photoListWrap = $("<div class='seller-photo-list-wrap'></div>").appendTo(content) ;
				var photoContent = $("<div class='seller-photo-content'></div>").appendTo(photoListWrap) ;
				//var imageUrl = "http://203.100.80.150/img/" ;
				$.each(data,function(i,item){
					var photoInfo = $("<div class='seller-photo-info'></div>").appendTo(photoContent) ;
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
						photoName.text("序号：") ;
						var sortEdit = $("<input class='sort-edit' type='text' />").val(item["sortBy"]).appendTo(photoName) ;
						var editButt = $("<a href=''>保存</a>")
						.appendTo(photoName)
						.on("click",function(e){
							var imageData = {
									"imageId":""+item["id"],
									"imageDesc":encodeURI($("#textPhotoDesc"+i).val()),
									"imageSortBy":sortEdit.val()
							};
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
						
						var clickPhotoTextButton = $("<a href='' id='photoTextButton_"+item["id"]+"'  ></a>").appendTo(photoName);
						var clickPhotoTextButtonText = "图文";
						var imageCatalog = "f1";
						var isPhotoText = item["imageCatalog"];
						if(isPhotoText =="f1"){
							clickPhotoTextButtonText = "设定图文";
							imageCatalog = "f15";
							$("#photoTextButton_"+item["id"]).html("设定图文");
							$("#photoTextButton_"+item["id"]).attr("value","f15");
						}else if(isPhotoText == "f15"){
							clickPhotoTextButtonText = "取消图文";
							imageCatalog = "f1";
							$("#photoTextButton_"+item["id"]).css({background:'#ccc'});
							$("#photoTextButton_"+item["id"]).html("取消图文");
							$("#photoTextButton_"+item["id"]).attr("value","f1");
						}
						
						clickPhotoTextButton.on("click",function(e){
							$.ajax({ 
							 	url : cms.baseUrl + "/jybb-upload/image/updateImageCatalog.json?imageId=" + item["id"] + "&imageCatalog="+$("#photoTextButton_"+item["id"]).attr("value"),
							   	type : "GET" ,
							    dataType: "json" ,
							    success:function(result){
							    	var photoTextButton = "取消图文";
							    	imageCatalog = $("#photoTextButton_"+item["id"]).attr("value");
							    	var imageCatalogValue = "f1";
							    	if(imageCatalog=="f1"){
							    		photoTextButton = "设定图文";
							    		imageCatalogValue = "f15";
							    		$("#photoTextButton_"+item["id"]).css({background:'#00A8FF'});
							    	}else if(imageCatalog=="f15"){
							    		photoTextButton = "取消图文";
							    		imageCatalogValue = "f1";
							    		$("#photoTextButton_"+item["id"]).css({background:'#ccc'});
							    	}
							    	$("#photoTextButton_"+item["id"]).html(photoTextButton);
							    	$("#photoTextButton_"+item["id"]).attr("value",imageCatalogValue);
							    	
							    	alert("操作成功!");
							    } ,
						        error:function(){
						        	alert("设定图文失败!") ;
						        }
					 		}) ;
							e.preventDefault() ;
							
						});
						var descEdit = $("<textarea id='textPhotoDesc"+i+"'></textarea>").val(item["imageDesc"]).appendTo(photoName) ;
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
	
	
	function sellerPhotoText(sellerId){
		var sellerBaseImage = $("#sellerBaseImage");
		sellerBaseImage.empty();
		
		var tag = $("<div class='tag'></div>").text("商家图片" + "：").appendTo(sellerBaseImage) ;
  		var uploadButton = $("<a id='sellerBaseImage_button' href=''></a>").text("商家图片上传").appendTo(sellerBaseImage) ;
		var viewListButton = $("<a href='' style='margin-right:10px'></a>").text("查看图片").appendTo(sellerBaseImage) ;
		
		viewListButton.on("click",function(e){
			$.ajax({
			 	url : cms.baseUrl+"/jybb-upload/image/listBycatalogs.json?belongId=" + sellerId + "&imageCatalog=f1,f15" ,
			   	type : "GET" ,
			    dataType: "json" ,
			    success:function(data){
			    	var images = null ;
			    	if("200" === data["code"]){
			    		images = data["result"] ;
			    		
			    		sellerPhotoTextDialog(images,"photo_list",{title:"商家的图片"},true);
			    		
			    	}
			    } ,
		        error:function(){
		        	alert("图片列表获取失败!") ;
		        }
	 		}) ;
			e.preventDefault() ;
		}) ;
		
		var uiCon = $("<div class='ui-con'></div>").appendTo(sellerBaseImage) ;
		var iconWrap = $("<div class='icon-wrap'></div>").appendTo(uiCon) ;
		var iconRoot = $("#upload-wrap") ;
		
		var doUploadButt = iconRoot.find(".upload-butt") ;
		
		iconRoot.find(".cls").on("click",function(){
			$(this).parent().fadeOut();
		}) ;
		
  		var sellerBaseImageUploader = new plupload.Uploader({
		    browse_button: "sellerBaseImage" + "_button" ,
		    url: cms.baseUrl +  "/jybb-upload/image/upload.do?belongId=" + sellerId + "&imageCatalog=f1" 
		}) ;
  		
  		sellerBaseImageUploader.init() ;
		
  		
  		sellerBaseImageUploader.bind('FilesAdded', function(up, files) {
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
  		sellerBaseImageUploader.bind('UploadProgress', function(up, file) {
		    //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			iconRoot.hide() ;
			iconWrap.fadeIn().text("图片已成功上传!") ;
		});
  		
  		sellerBaseImageUploader.bind('FileUploaded', function(up, file,result) {
  			
  			var fileId = eval(result.response)[0]
  			$.ajax({
			 	url :cms.baseUrl+ "/jybb-upload/image/getImgById.json?imageId=" +fileId ,
			   	type : "GET" ,
			    dataType: "json" ,
			    success:function(data){
			    	var images = null ;
			    	if("200" === data["code"]){
			    		image = data["result"] ;
			    		writeEditor("</br><img src='"+image["imageUrl"]+"' /></br>");
			    	}
			    } ,
		        error:function(){
		        	alert("图片列表获取失败!") ;
		        }
	 		}) ;
  		
  		});
  		
  		sellerBaseImageUploader.bind('Error', function(up,err) {
		    alert("文件上传发生错误，请重试!") ;
		});
  		
  		uploadButton.on("click",function(){
			
			doUploadButt.on("click",function(){
				sellerBaseImageUploader.start() ;
				$(this).unbind("click") ;
			}) ;
		
		}) ;
	}
	
	function sellerPlayPhotoTextDialog(data,type,opts,flag){
		var title = opts["title"] || "CMS_BOX" ;
		var root = $("#cms_box").fadeIn();
		var title = root.find(".t").text(title) ;
		var content = root.find(".c").empty() ;
		var cls = root.find(".cls").on("click",function(){
			root.fadeOut() ;		
		}) ;
		var typeHooks = {
			"photo_list" : function(data){
				var photoListWrap = $("<div class='seller-photo-list-wrap'></div>").appendTo(content) ;
				var photoContent = $("<div class='seller-photo-content'></div>").appendTo(photoListWrap) ;
				//var imageUrl = "http://203.100.80.150/img/" ;
				$.each(data,function(i,item){
					var photoInfo = $("<div class='seller-photo-info'></div>").appendTo(photoContent) ;
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
						photoName.text("序号：") ;
						var sortEdit = $("<input class='sort-edit' type='text' />").val(item["sortBy"]).appendTo(photoName) ;
						var editButt = $("<a href=''>保存</a>")
						.appendTo(photoName)
						.on("click",function(e){
							var imageData = {
									"imageId":""+item["id"],
									"imageDesc":encodeURI($("#descEdit"+i).val()),
									"imageSortBy":sortEdit.val()
							};
							$.ajax({ 
							 	url : cms.baseUrl + "/jybb-upload/image/addDesc.json" ,
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
						
						var descEdit = $("<textarea id='descEdit"+i+"'></textarea>").val(item["imageDesc"]).appendTo(photoName) ;
						
						
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
	
	
	function sellerPlayPhotoText(sellerId){
		var sellerPlayImage = $("#sellerPlayWhatImage");
		sellerPlayImage.empty();
		
		var tag = $("<div class='tag'></div>").text("游玩图片" + "：").appendTo(sellerPlayImage) ;
  		var uploadButton = $("<a id='sellerPlayImage_button' href=''></a>").text("游玩图片上传").appendTo(sellerPlayImage) ;
		var viewListButton = $("<a href='' style='margin-right:10px'></a>").text("查看图片").appendTo(sellerPlayImage) ;
		
		viewListButton.on("click",function(e){
			$.ajax({
			 	url : cms.baseUrl+"/jybb-upload/image/listBycatalogs.json?belongId=" + sellerId + "&imageCatalog=f0" ,
			   	type : "GET" ,
			    dataType: "json" ,
			    success:function(data){
			    	var images = null ;
			    	if("200" === data["code"]){
			    		images = data["result"] ;
			    		
			    		sellerPlayPhotoTextDialog(images,"photo_list",{title:"玩什么图片"},true);
			    		
			    	}
			    } ,
		        error:function(){
		        	alert("图片列表获取失败!") ;
		        }
	 		}) ;
			e.preventDefault() ;
		}) ;
		
		var uiCon = $("<div class='ui-con'></div>").appendTo(sellerPlayImage) ;
		var iconWrap = $("<div class='icon-wrap'></div>").appendTo(uiCon) ;
		var iconRoot = $("#upload-wrap") ;
		
		var doUploadButt = iconRoot.find(".upload-butt") ;
		
		iconRoot.find(".cls").on("click",function(){
			$(this).parent().fadeOut();
		}) ;
		
  		var sellerPlayImageUploader = new plupload.Uploader({
		    browse_button: "sellerPlayImage" + "_button" ,
		    url: cms.baseUrl +  "/jybb-upload/image/upload.do?belongId=" + sellerId + "&imageCatalog=f0" 
		}) ;
  		
  		sellerPlayImageUploader.init() ;
		
  		
  		sellerPlayImageUploader.bind('FilesAdded', function(up, files) {
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
  		sellerPlayImageUploader.bind('UploadProgress', function(up, file) {
		    //document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
			iconRoot.hide() ;
			iconWrap.fadeIn().text("图片已成功上传!") ;
		});
  		
  		sellerPlayImageUploader.bind('FileUploaded', function(up, file,result) {
  			
  			var fileId = eval(result.response)[0]
  			$.ajax({
			 	url :cms.baseUrl+ "/jybb-upload/image/getImgById.json?imageId=" +fileId ,
			   	type : "GET" ,
			    dataType: "json" ,
			    success:function(data){
			    	var images = null ;
			    	if("200" === data["code"]){
			    		image = data["result"] ;
			    		writeEditor("</br><img src='"+image["imageUrl"]+"' /></br>");
			    	}
			    } ,
		        error:function(){
		        	alert("图片列表获取失败!") ;
		        }
	 		}) ;
  		
  		});
  		
  		sellerPlayImageUploader.bind('Error', function(up,err) {
		    alert("文件上传发生错误，请重试!") ;
		});
  		
  		uploadButton.on("click",function(){
			
			doUploadButt.on("click",function(){
				sellerPlayImageUploader.start() ;
				$(this).unbind("click") ;
			}) ;
		
		}) ;
	}