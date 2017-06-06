(function($){
	var win = window ;
	var doc = document ;
	var navigator = win.navigator ;
	var dc = win.dc = win.dc || {} ;
	dc.showMessage = function(elem,message){
		elem.show().text(message) ;
		win.setTimeout(function(){
			elem.hide() ;
		},3000) ;
	} ;
	dc.throwError = function(message){
		throw new Error(message) ;
	} ;
	dc.getNetwork = function(){
		return navigator ;
	} ;
	dc.geo = function(callback){
		navigator.geolocation.getCurrentPosition(function(position){
        	callback && callback({
        		longitude : position.coords.longitude ,
        		latitude  : position.coords.latitude
        	}) ;
		},function(error){
			var errorMsg = "" ;
			switch(error.code){
		    	case error.PERMISSION_DENIED :
		      		errorMsg += "用户拒绝对地理位置要求。。。" ;
		      	break ;
		    	case error.POSITION_UNAVAILABLE :
		      		errorMsg += "地理位置信息是不可用的。。。" ;
		      	break ;
		    	case error.TIMEOUT :
		      		errorMsg += "雷达定位超时。" ;
		      	break ;
		    	case error.UNKNOWN_ERROR :
		      		errorMsg += "出现未知错误，定位失败，请打开网络设备重试或者手动填写信息。" ;
		      	break ;
		    }
		    alert(errorMsg) ;
		},{
			timeout            : 30000 ,
			enableHighAccuracy : true ,
			maximumAge         : 3000
		}) ;
	} ;
	var dbInstance = null ;
	var db = dc.database = {
		config : {
			name : "dc" ,
			ver : "1.0" ,
			desc : "dc_1.0" ,
			size : 2 * 1024 * 1024
		}
	} ;
	db.support = function(){
		return !! win.openDatabase ;
	} ;
	db.getDataBase = function(){
		if(db.support()){
			return dbInstance || (dbInstance = win.openDatabase(db.config["name"],db.config["ver"],db.config["desc"],db.config["size"])) ;
		}
	} ;
	var tableSQL = [
			"id integer primary key autoincrement" ,
	        "name text" ,
	        "position text" ,
	        "tel text" ,
	        "address text" ,
	        "ability text" ,
	        "type text" ,
	        "areaLevel text" ,
	        "scence text" ,
	        "ageGroup text" ,
	        "parentChildText text" ,
	        "dayCount text" ,
	        "collectDate text" ,
        	"hasFinished text" ,
	        "fullDesc text" ,
	        "playWhat text" ,
	        "tags text" ,
	        "parentChildContent text" ,
	        "merchantIcon text" ,
	        "productIcon text" ,
	        "latitude text" ,
	        "longitude text" ,
	        "radius text" ,
	        "unit text" ,
	        "highSeasonTime text" ,
	        "lowSeasonTime text" ,
	        "highSeasonPrice text" ,
	        "lowSeasonPrice text" ,
	        "highPolicy text" ,
	        "wasteTime text" ,
	        "sourceIcon text" ,
	        "avgPersonPrice text" ,
	        "specialList text" ,
	        "specialIcon text" ,
	        "roomName text" ,
	        "roomPrice text" ,
	        "roomArea text",
	        "roomSingle text" ,
	        "roomDouble text" ,
	        "roomService text" ,
	        "roomIcon text" ,
			"roomEntity text"
         ].join(",") ;
	/*db.createTable = function(){
		db.getDataBase().transaction(function(tx){
			tx.executeSql("create table if not exists merchant (" + tableSQL + ")",[],function(tx,result){
				
			},function(tx,error){
				dc.throwError(error) ;
			}) ;
		}) ;
	} ;*/
	var model = dc.model = {} ;
	model.Merchant = function(
		name ,
		position ,
		tel ,
		address ,
		ability ,
		type ,
		areaLevel ,
		scence ,
		ageGroup ,
		parentChildText ,
		dayCount ,
		collectDate ,
		hasFinished ,
		fullDesc ,
		playWhat ,
		tags ,
		parentChildContent ,
		merchantIcon ,
		productIcon ,
		latitude ,
	    longitude ,
	    radius ,
	    unit ,
	    highSeasonTime ,
	    lowSeasonTime ,
	    highSeasonPrice ,
	    lowSeasonPrice ,
	    highPolicy ,
	    wasteTime ,
	    sourceIcon ,
	    avgPersonPrice ,
	    specialList ,
	    specialIcon ,
	    roomName ,
	    roomPrice ,
	    roomArea ,
	    roomSingle ,
	    roomDouble ,
	    roomService ,
	    roomIcon ,
		roomEntity
	){
		this.name = name ;
		this.position = position ;
		this.tel = tel ;
		this.address = address ;
		this.ability = ability ;
		this.type = type ;
		this.areaLevel = areaLevel ;
		this.scence = scence ;
		this.ageGroup = ageGroup ;
		this.parentChildText = parentChildText ;
		this.dayCount = dayCount ;
		this.collectDate = collectDate ;
		this.hasFinished = hasFinished ;
		this.fullDesc = fullDesc ;
		this.playWhat = playWhat ;
		this.tags = tags ;
		this.parentChildContent = parentChildContent ;
		this.merchantIcon = merchantIcon ;
		this.productIcon = productIcon ;
		this.latitude = latitude ;
	    this.longitude = longitude ;
	    this.radius = radius ;
	    this.unit = unit ;
	    this.highSeasonTime = highSeasonTime ;
	    this.lowSeasonTime = lowSeasonTime ;
	    this.highSeasonPrice = highSeasonPrice ;
	    this.lowSeasonPrice = lowSeasonPrice ;
	    this.highPolicy = highPolicy ;
	    this.wasteTime = wasteTime ;
	    this.sourceIcon = sourceIcon ;
	    this.avgPersonPrice = avgPersonPrice ;
	    this.specialList = specialList ;
	    this.specialIcon = specialIcon ;
	    this.roomName = roomName ;
	    this.roomPrice = roomPrice ;
	    this.roomArea = roomArea ;
	    this.roomSingle = roomSingle ;
	    this.roomDouble = roomDouble  ;
	    this.roomService = roomService  ;
	    this.roomIcon = roomIcon ;
		this.roomEntity = roomEntity ;
	} ;
	var MerchantProto = model.Merchant.prototype ;
    MerchantProto.getName = function(){
    	return this.name ;
    } ;
    MerchantProto.getPosition = function(){
    	return this.position ;
    } ;
    MerchantProto.getTel = function(){
    	return this.tel ;
    } ;
    MerchantProto.getAddress = function(){
    	return this.address ;
    } ;
    MerchantProto.getAbility = function(){
    	return this.ability ;
    } ;
    MerchantProto.getType = function(){
    	return this.type ;
    } ;
    MerchantProto.getAreaLevel = function(){
    	return this.areaLevel ;
    } ;
    MerchantProto.getScence = function(){
    	return this.scence ;
    } ;
    MerchantProto.getAgeGroup = function(){
    	return this.ageGroup ;
    } ;
    MerchantProto.getParentChildText = function(){
    	return this.parentChildText ;
    } ;
    MerchantProto.getDayCount = function(){
    	return this.dayCount ;
    } ;
    MerchantProto.getCollectDate = function(){
    	return this.collectDate ;
    } ;
    MerchantProto.getHasFinished = function(){
    	return this.hasFinished ;
    } ;
    MerchantProto.getFullDesc = function(){
    	return this.fullDesc ;
    } ;
    MerchantProto.getPlayWhat = function(){
    	return this.playWhat ;
    } ;
    MerchantProto.getTags = function(){
    	return this.tags ;
    } ;
    MerchantProto.getParentChildContent = function(){
    	return this.parentChildContent ;
    } ;
    MerchantProto.getMerchantIcon = function(){
    	return this.merchantIcon ;
    } ;
    MerchantProto.getProductIcon = function(){
    	return this.productIcon ;
    } ;
    MerchantProto.getLatitude = function(){
    	return this.latitude ;
    } ;
    MerchantProto.getLongitude = function(){
    	return this.longitude ;
    } ;
    MerchantProto.getRadius = function(){
    	return this.radius ;
    } ;
    MerchantProto.getUnit = function(){
    	return this.unit ;
    } ;
    MerchantProto.getHighSeasonTime = function(){
    	return this.highSeasonTime ;
    } ;
    MerchantProto.getLowSeasonTime = function(){
    	return this.lowSeasonTime ;
    } ;
    MerchantProto.getHighSeasonPrice = function(){
    	return this.highSeasonPrice ;
    } ;
    MerchantProto.getLowSeasonPrice = function(){
    	return this.lowSeasonPrice ;
    } ;
    MerchantProto.getHighPolicy = function(){
    	return this.highPolicy ;
    } ;
    MerchantProto.getWasteTime = function(){
    	return this.wasteTime ;
    } ;
    MerchantProto.getSourceIcon = function(){
    	return this.sourceIcon ;
    } ;
    MerchantProto.getAvgPersonPrice = function(){
    	return this.avgPersonPrice ;
    } ;
    MerchantProto.getSpecialList = function(){
    	return this.specialList ;
    } ;
    MerchantProto.getSpecialIcon = function(){
    	return this.specialIcon ;
    } ;
    MerchantProto.getRoomName = function(){
    	return this.roomName ;
    } ;
    MerchantProto.getRoomPrice = function(){
    	return this.roomPrice ;
    } ;
    MerchantProto.getRoomArea = function(){
    	return this.roomArea ;
    } ;
    MerchantProto.getRoomSingle = function(){
    	return this.roomSingle ;
    } ;
    MerchantProto.getRoomDouble = function(){
    	return this.roomDouble ;
    } ;
    MerchantProto.getRoomService = function(){
    	return this.roomService ;
    } ;
    MerchantProto.getRoomIcon = function(){
    	return this.roomIcon ;
    } ;
	MerchantProto.getRoomEntity = function(){
    	return this.roomEntity ;
    } ;
	
	var service = dc.service = {} ;
	service.insertMerchant = function(merchant,callback){
		/*
		var sql = "" ;
		sql += "name" ;
        sql += "position" ;
        sql += "tel" ;
        sql += "address" ;
        sql += "ability" ;
        sql += "type" ;
        sql += "areaLevel" ;
        sql += "scence" ;
        sql +="ageGroup" ;
        sql += "parentChildText" ;
        sql += "dayCount" ;
        sql += "collectDate" ;
        sql += "hasFinished" ;
        sql += "fullDesc" ;
        sql += "playWhat" ;
        sql += "tags" ;
        sql += "parentChildContent" ;
        sql += "merchantIcon" ;
        sql += "productIcon" ;
        sql += "latitude" ;
        sql += "longitude" ;
        sql += "radius" ;
        sql += "unit" ;
        sql += "highSeasonTime" ;
        sql += "lowSeasonTime" ;
        sql += "highSeasonPrice" ;
        sql += "lowSeasonPrice" ;
        sql += "highPolicy" ;
        sql += "wasteTime" ;
        sql +=  "sourceIcon" ;
        sql += "avgPersonPrice" ;
        sql += "specialList" ;
        sql += "specialIcon" ;
        sql += "roomName" ;
        sql += "roomPrice" ;
        sql += "roomArea" ;
        sql += "roomSingle" ;
        sql += "roomDouble" ;
        sql += "roomService" ;
        sql += "roomIcon" ;
        */
        var sql = [
	        "name" ,
	        "position" ,
	        "tel" ,
	        "address" ,
	        "ability" ,
	        "type" ,
	        "areaLevel" ,
	        "scence" ,
	        "ageGroup" ,
	        "parentChildText" ,
	        "dayCount" ,
	        "collectDate" ,
        	"hasFinished" ,
	        "fullDesc" ,
	        "playWhat" ,
	        "tags" ,
	        "parentChildContent" ,
	        "merchantIcon" ,
	        "productIcon" ,
	        "latitude" ,
	        "longitude" ,
	        "radius" ,
	        "unit" ,
	        "highSeasonTime" ,
	        "lowSeasonTime" ,
	        "highSeasonPrice" ,
	        "lowSeasonPrice" ,
	        "highPolicy" ,
	        "wasteTime" ,
	        "sourceIcon" ,
	        "avgPersonPrice" ,
	        "specialList" ,
	        "specialIcon" ,
	        "roomName" ,
	        "roomPrice" ,
	        "roomArea",
	        "roomSingle" ,
	        "roomDouble" ,
	        "roomService" ,
	        "roomIcon" ,
			"roomEntity"
         ].join(",") ;
		db.getDataBase().transaction(function(tx){
			tx.executeSql("insert into merchant (" + sql + ") values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[
				merchant.getName() ,
				merchant.getPosition() ,
				merchant.getTel() ,
				merchant.getAddress() ,
				merchant.getAbility() ,
				merchant.getType() ,
				merchant.getAreaLevel() ,
				merchant.getScence() ,
				merchant.getAgeGroup() ,
				merchant.getParentChildText() ,
				merchant.getDayCount() ,
				merchant.getCollectDate() ,
				merchant.getHasFinished() ,
				merchant.getFullDesc() ,
				merchant.getPlayWhat() ,
				merchant.getTags() ,
				merchant.getParentChildContent() ,
				merchant.getMerchantIcon() ,
				merchant.getProductIcon() ,
				merchant.getLatitude() ,
				merchant.getLongitude() ,
				merchant.getRadius() ,
				merchant.getUnit() ,
				merchant.getHighSeasonTime() ,
				merchant.getLowSeasonTime() ,
				merchant.getHighSeasonPrice() ,
				merchant.getLowSeasonPrice() ,
				merchant.getHighPolicy() ,
				merchant.getWasteTime() ,
				merchant.getSourceIcon() ,
				merchant.getAvgPersonPrice() ,
				merchant.getSpecialList() ,
				merchant.getSpecialIcon() ,
				merchant.getRoomName() ,
				merchant.getRoomPrice() ,
				merchant.getRoomArea() ,
				merchant.getRoomSingle() ,
				merchant.getRoomDouble() ,
				merchant.getRoomService() ,
				merchant.getRoomIcon() ,
				merchant.getRoomEntity()
			],function(tx,result){
				$.isFunction(callback) && callback(result) ;
			},function(tx,error){
				alert("插入商户信息失败!") ;
				dc.throwError(error) ;
			}) ;
		}) ;
	} ;
	service.getMerchantById = function(id,callback){
		db.getDataBase().transaction(function(tx){
			tx.executeSql("select * from merchant where id=?",[id],function(tx,result){
				$.isFunction(callback) && callback(result.rows.item(0)) ;
			},function(tx,error){
				dc.throwError(error) ;
				alert("通过ID查询商户信息失败!") ;
			}) ;
		}) ;
	} ;
	service.updateMerchant = function(id,merchant,callback){
		var sql = "update merchant set " ;
		sql += "name = ? ,position = ? ,tel = ? ,address = ? ,ability = ? ,type = ? ,areaLevel = ? ,scence = ? ,ageGroup = ? ,parentChildText = ? ,dayCount = ? ,collectDate = ? ," ;
		sql += "hasFinished = ? ,fullDesc = ? ,playWhat = ? ,tags = ? ,parentChildContent = ?,merchantIcon = ? ,productIcon = ? ,latitude = ? ,longitude = ? ,radius = ? ,unit = ? ,highSeasonTime = ? ," ;
		sql += "lowSeasonTime = ? ,highSeasonPrice = ? ,lowSeasonPrice = ? ,highPolicy = ? ,wasteTime = ? ,sourceIcon = ? ,avgPersonPrice = ? ,specialList = ? ,specialIcon = ? ," ;
		sql += "roomName = ? ,roomPrice = ? , roomArea = ? ,roomSingle = ? ,roomDouble = ? ,roomService = ? ,roomIcon = ? ,roomEntity = ?" ;
		db.getDataBase().transaction(function(tx){
			tx.executeSql(sql + "where id= ?",[
				merchant.getName() ,
				merchant.getPosition() ,
				merchant.getTel() ,
				merchant.getAddress() ,
				merchant.getAbility() ,
				merchant.getType() ,
				merchant.getAreaLevel() ,
				merchant.getScence() ,
				merchant.getAgeGroup() ,
				merchant.getParentChildText() ,
				merchant.getDayCount() ,
				merchant.getCollectDate() ,
				merchant.getHasFinished() ,
				merchant.getFullDesc() ,
				merchant.getPlayWhat() ,
				merchant.getTags() ,
				merchant.getParentChildContent() ,
				merchant.getMerchantIcon() ,
				merchant.getProductIcon() ,
				merchant.getLatitude() ,
				merchant.getLongitude() ,
				merchant.getRadius() ,
				merchant.getUnit() ,
				merchant.getHighSeasonTime() ,
				merchant.getLowSeasonTime() ,
				merchant.getHighSeasonPrice() ,
				merchant.getLowSeasonPrice() ,
				merchant.getHighPolicy() ,
				merchant.getWasteTime() ,
				merchant.getSourceIcon() ,
				merchant.getAvgPersonPrice() ,
				merchant.getSpecialList() ,
				merchant.getSpecialIcon() ,
				merchant.getRoomName() ,
				merchant.getRoomPrice() ,
				merchant.getRoomArea() ,
				merchant.getRoomSingle() ,
				merchant.getRoomDouble() ,
				merchant.getRoomService() ,
				merchant.getRoomIcon() ,
				merchant.getRoomEntity() ,
				id
			],function(tx,result){
				$.isFunction(callback) && callback(result) ;
			},function(tx,error){
				dc.throwError(error) ;
			}) ;
		}) ;
	} ;
	service.deleteMerchantById = function(id,callback){
		db.getDataBase().transaction(function(tx){
			tx.executeSql("delete from merchant where id=?",[id],function(tx,result){
				$.isFunction(callback) && callback() ;
			},function(tx,error){
				dc.throwError(error) ;
			}) ;
		}) ;
	} ;
	service.getMerchantList = function(callback){
		db.getDataBase().transaction(function(tx){
			tx.executeSql("select * from merchant",[],function(tx,result){
				$.isFunction(callback) && callback(result.rows) ;
			},function(tx,error){
				dc.throwError(error) ;
			}) ;
		}) ;
	} ;
	var util = dc.util = {} ;
	util.getCheckedValue = function(elem,hack){ // old api
		var ret = [] ;
		elem.each(function(){
			var value = (true === hack) ? $(this).text() : $(this).val() ;
			ret.push(value) ;
		}) ;
		return ret.join("-") ;
	} ;
	util.setOrGetFormValue = function(data){
		var jsondata = {} ;
        $.each(data,function(i,value){
	        var elem = $.isPlainObject(data) ? $("#" + i) : $("#" + value) ;
	        var type = elem.data("type") + "" ;
	        if("-1" === type){
	          if($.isPlainObject(data)){
	              elem.val(value) ;
	          }
	          else{
	              jsondata[value] = elem.val() ;
	          }
	        }
	        else if("0" === type){
	          if($.isPlainObject(data)){
	            elem.find("option").eq(parseInt(value)).prop("selected",true) ;
	          }
	          else{
	            jsondata[value] = elem.val() || "" ;
	          }
	        }
	        else if("1" === type){
	          if($.isPlainObject(data) ){
	            elem.find("input[type=radio]").eq(parseInt(value)).prop("checked",true) ;
	          }
	          else{
	            jsondata[value] = elem.find("input:checked").val() || "" ;
	          }
	        }
	        else if("2" === type){
	          if($.isPlainObject(data)){
	            $.each(value,function(i,val){
	            elem.find("input[type=checkbox]").each(function(){
	                if($(this).val() === val){
	                  $(this).prop("checked",true) ;
	                }
	              })
	            }) ;
	          }
	          else{
	            jsondata[value] = dc.util.getCheckedValue(elem.find("input:checked")) ;
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
	            	var p = $("<div class='photo'></div>").appendTo(elem.find(".item")) ;
	            	var pw = $("<div class='photo-wrap'></div>").appendTo(p) ;
					var delIcon = $("<span class='del'>X</span>").appendTo(p) ;
					delIcon.on("click",function(e){
						$(this).parent().remove() ;
						e.preventDefault() ;
					}) ;
	            	$("<img />").attr("src",icon).appendTo(pw) ;
	            	$("<div class='text'></div>").text("商家图片").appendTo(pw) ;
	            }) ;
	          }
	          else{
	            var ret = [] ;
	            elem.find("img").each(function(){
	              ret.push($(this).attr("src")) ;
	            }) ;
	            jsondata[value] = ret.join("-") ;
			//	alert(ret.join("-"))
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
	     }) ;
	    return jsondata ;
	} ;
	util.createRoom = function(elem,data){
		var rooms = data.split("|") ;
		var tmpString = "" ;
		var tpl = "" ;
		$.each(rooms,function(i,room){
			if(!room) return false;
			var items = room.split("-") ;
			var name = items[0] ;
			var price = items[1] ;
			var area = items[2] ;
			var single = items[3] ;
			var sDouble = items[4] ;
			var service = items[5] || "" ;
			var rf = $("<div class='roomInfo'></div>").appendTo(elem) ;
			if(service){
				$.each(service.split(","),function(j,v){
					if(!v) return false;
					tmpString += "<span>" + v + "</span>" ;
				}) ;
			}
			tpl = "<div><span>房间名称：</span><span>" + (name || "") + "</span></div>" ;
			tpl += "<div><span>价格：</span><span>" + (price || "") + "</span></div>" ;
			tpl += "<div><span>面积：</span><span>" + (area || "") + "</span></div>" ;
			tpl += "<div><span>单人床位数量：</span><span>" + (single || "") + "</span></div>" ;
			tpl += "<div><span>双人床位数量：</span><span>" + (sDouble || "") + "</span></div>" ;
			tpl += "<div id='moreText'><span>配套服务：</span>" + (tmpString || "") +"</div>" ;
			rf.html(tpl) ;
			var del = $("<span class='del'>X</span>").appendTo(rf).on("click",function(){
			  $(this).parent().remove() ;
			}) ;
		}) ;
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
		delIcon.on("click",function(){
			$(this).parent().remove() ;
			e.preventDefault() ;
		}) ;
		var pwrap = $("<div class='photo-wrap'></div>").appendTo(photo) ;
		$("<img />").attr("src",fullPath).appendTo(pwrap) ;
		$("<div class='text'></div>").text("商家图片").appendTo(pwrap) ;
	} ;
	util.playCamera = function(){
		var myVideo = doc.querySelector("#myvideo") ;
		var videoObj = { "video" : true } ;
		var errorCallback = function(error){
			console.log("Video capture error: ",error.code ) ; 
		};
        if(navigator.getUserMedia){
			navigator.getUserMedia(videoObj,function(stream){
				myVideo.src = stream ;
				myVideo.play() ;
			},errorCallback) ;
		}else if(navigator.webkitGetUserMedia){
			navigator.webkitGetUserMedia(videoObj,function(stream){
				myVideo.src = window.webkitURL.createObjectURL(stream) ;
				myVideo.play() ;
				
			},errorCallback) ;
		}else if(navigator.mozGetUserMedia){
			navigator.mozGetUserMedia(videoObj,function(stream){
				myVideo.src = window.URL.createObjectURL(stream) ;
				myVideo.play() ;
			},errorCallback) ;
		}
	} ;
	util.getPicture = function(elem,onlyGet,callback){
		var pictureSource = navigator.camera.PictureSourceType ;
        var destinationType = navigator.camera.DestinationType ;
		var opts = (true === onlyGet) ? {
			quality : 50 ,
            destinationType : destinationType.FILE_URI ,
            sourceType : pictureSource.PHOTOLIBRARY
		} : {
			quality : 80 ,
			destinationType : destinationType.FILE_URI ,
			sourceType : Camera.PictureSourceType.CAMERA ,
			allowEdit : true ,
			encodingType : Camera.EncodingType.JPEG ,
			popoverOptions : CameraPopoverOptions ,
			targetWidth : 1366 , 
			targetHeight : 768 ,
			saveToPhotoAlbum : true
		} ;
		navigator.camera.getPicture(function(imageURI){
			var m_imageURI = imageURI ;
			window.resolveLocalFileSystemURI(imageURI,function(fileEntry){
				var fullPath = fileEntry.fullPath ;
				dc.util.createPhoto(fullPath,elem) ;
				callback && callback() ;
			},function(error){
				dc.throwError(message) ;
			});
		},function(message){
			dc.throwError(message) ;
		},opts) ;
	} ;
})(jQuery) ;