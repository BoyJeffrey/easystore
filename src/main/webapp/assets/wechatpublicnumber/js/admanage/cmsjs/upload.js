/**
 * 文件上传js
 * @author bai xin
 */
;(function($, exports) {
	var upload = {
		//ctx: exports.ctx || exports.parent.ctx,
		//jsessionid: exports.jsessionid || exports.parent.jsessionid,
	    ctx: ctx ,
	    jsessionid:sessionId,
		method: 'get',
		modelType: {
			music: 'music',		//音乐
			news: 'news',		//资讯
			platform_declare_mgmt: 'platform_declare_mgmt',	//台宣
			programe_audio_audio: 'programe_audio_audio',	//节目碎片音频
			programe_audio_image: 'programe_audio_image',	//节目碎片图片
			programe_compere_photo: 'programe_compere_photo',	//节目主持人照片
			programe_compere_picture_path:'programe_compere_picture_path',//音乐节目主持人照片
			front_cover: 'front_cover',			//老版图片管理
			image_cover:'image_cover',  //图片管理
			intercut: 'intercut',				//插播音频
            recommended_app_image: 'recommended_app_image',				//推荐应用
			time_audio: 'time_audio',		//报时音频表
			talkingbook_image: 'talkingbook_image',	//有声读物图片
			talkingbook_audio: 'talkingbook_audio',	//有声读物音频

			ai_che_tian_tian_hui_image: 'ai_che_tian_tian_hui_image',	//爱车天天汇图片
			ai_che_tian_tian_hui_audio: 'ai_che_tian_tian_hui_audio',	//爱车天天汇音频
			splash_screen_image:'splash_screen_image',  //闪屏图片
				
			version_controller_apk:'version_controller_apk',  //版本控制apk
			
			happy_library_audio:'happy_library_audio',  //乐库管理音频
			happy_library_image:'happy_library_image',  //乐库管理图片
			title_package_image:'title_package_image',  //主题包管理图片
			music_channel_image:'music_channel_image',  //频道管理图片
			info_source_image:'info_source_image',  //信息源管理图片
			app_group_upgrade_target:'app_group_upgrade_target',  //升级产品管理
			channel_settings_image:'channel_settings_image',  //频道设置图片
			live_telecast_flow_image:'live_telecast_flow_image',  //直播流管理图片
            program_rss_image:'program_rss_image',  //节目RSS图片
            cms_catalog_image:'cms_catalog_image',  //cms分类模块图片管理
            radio_info_cover_image:'radio_info_cover_image',  //电台信息管理->封面
            radio_info_logo_image:'radio_info_logo_image',  //电台信息管理->logo
            image_cut_one_to_three:'image_cut_one_to_three',//用于将一张550*550的图片切割为340*340,250*250,100*100时使用
            image_no_cut:'image_no_cut'//上传指定尺寸图片，并不截图
		},
		fileDataName: {
			uploadImageFile: 'uploadImageFile',
			uploadAudioFile: 'uploadAudioFile',
			uploadApkFile: 'uploadApkFile',
			uploadHappyLibraryImageFile: 'uploadHappyLibraryImageFile'
		},
		sizeLimit: {
			audio: 104857600, //100M 104857600
			image: 5242880 ,//5M 104857600
			apk: 104857600, //100M 104857600
			happyLibraryImage: 102400 //100K 102400
		},
		fileExt: {
			audio: "*.mp3",
			image: "*.jpg;*.gif;*.png;",
			apk:"*.apk;*.txt",
			happyLibraryImage: "*.jpg;"
		},
		fileDesc: {
			audio: "音频(MP3)",
			image: "图片(JPG、GIF、PNG)",
			apk:"apk、txt",
			happyLibraryImage: "图片(JPG)"
		},
		validateUploadSuccess: function() {			//提交前验证文件是否上传成功
			if ($("#uploadFileSuccess").val() == '0') {
				alert("文件上传失败，不能保存，请重试！");
				return false;
			}
			return true;
		},
		/**
		 * 上传文件完成回调方法
		 * @param response 服务器返回
		 * @param callback 回调函数 根据模块传入不同实现
		 */
		uploadFinish : function(response, callback) {
			var parseJSONSuccess = true;
			try {
				var dataObj = eval("(" + response + ")");
			} catch(e) {
				parseJSONSuccess = false;
			}

			//reinitIframe();
			if (!parseJSONSuccess || !dataObj.success) {
				alert('服务器端上传失败');
				$("#uploadFileSuccess").val("0");
				return false;
			} else {
				$("#uploadFileSuccess").val("1");
			}
			var result = {
				success : dataObj.success,
				uploadFilePath : dataObj.uploadFilePath,
				fileName : dataObj.fileName,
				fileSize : dataObj.fileSize,
				status : dataObj.status,
				message : dataObj.message
			};

			if (dataObj.audioTimeLength != undefined) {
				result.audioTimeLength = dataObj.audioTimeLength;
			}

			if (callback) {
				callback(result);
			}
		}
	};

	/**
	 * 上传基本配置项
	 */
	upload.baseUploadConfig = {
	    'uploader': upload.ctx + '/js/uploadify/uploadify.swf',
	    'method': upload.method,
	    'cancelImg': upload.ctx + '/js/uploadify/cancel.png',
	    'folder':  upload.ctx + '/js/uploads',
	    'auto': true,
	    'buttonImg':  upload.ctx + '/js/uploadify/btn_upic.jpg',
	    'rollover': true,
	    'scriptAccess': 'always', //本地测试用，上线后请关闭
	    'multi': false,
	    'removeCompleted': true,
	    'width': 71,
	    'height': 26
	};

	/**
	 * 音频上传基本配置项
	 */
	upload.baseAudioUploadConfig = $.extend(false, upload.baseUploadConfig, {
	    'fileDataName': upload.fileDataName.uploadAudioFile, //和以下input的name属性一致
	    'fileExt': upload.fileExt.audio,
	    'fileDesc': upload.fileDesc.audio,
	    'sizeLimit': upload.sizeLimit.audio
	});

	/**
	 * 图片上传基本配置项
	 */
	upload.baseImageUploadConfig = $.extend(false, upload.baseUploadConfig, {
	    'fileDataName': upload.fileDataName.uploadImageFile, //和以下input的name属性一致
	    'fileExt': upload.fileExt.image,
	    'fileDesc': upload.fileDesc.image,
	    'sizeLimit': upload.sizeLimit.image
	});
	/**
	 * apk上传基本配置项
	 */
	upload.baseApkUploadConfig = $.extend(false, upload.baseUploadConfig, {
	    'fileDataName': upload.fileDataName.uploadApkFile, //和以下input的name属性一致
	    'fileExt': upload.fileExt.apk,
	    'fileDesc': upload.fileDesc.apk,
	    'sizeLimit': upload.sizeLimit.apk
	});
	/**
	 * 乐库管理图片上传基本配置项
	 */
	upload.baseHappyLibraryImageUploadConfig = $.extend(false, upload.baseUploadConfig, {
	    'fileDataName': upload.fileDataName.uploadHappyLibraryImageFile, //和以下input的name属性一致
	    'fileExt': upload.fileExt.happyLibraryImage,
	    'fileDesc': upload.fileDesc.happyLibraryImage,
	    'sizeLimit': upload.sizeLimit.happyLibraryImage
	});

	/**
	 * 碎片管理上传音频配置
	 */
	upload.programAudioUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
		'scriptData': {
			oldUploadFile: $("#oldProgrameAudio").val(),
			modelType: upload.modelType.programe_audio_audio
		},
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var audioTimeLength = result.audioTimeLength;

				var audio_url = $("#audio_url");
				var audio_http = $("#audio_http");

	    		$("#baseAudioName").val(fileName);
	            if (audio_url.val() != '') {
	            	$("#oldProgrameAudio").val(audio_url.val());
	            }

	            audio_url.val(uploadFilePath);
	            $("#audioPath").val(uploadFilePath);
	            $("#audioSize").val(fileSize);
	            $("#audioTimeLength").val(audioTimeLength);
	            audio_http.val(uploadFilePath);
	
	            $("#jyp_file").uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.programe_audio_audio
	            });
	            $("#erroRaudioPath").html("");
	            $("#title").val(fileName.substring(0, fileName.lastIndexOf(".")));
	            $("#audio_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	            musicPlayer.playAudio(audio_http.val(), 'audioPlay');
	    	};

	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});

	/**
	 * 碎片管理上传图片配置项
	 */
	upload.programAudioUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
		'scriptData': {
			oldUploadFile: $("#oldProgrameAudioImage").val(),
			modelType: upload.modelType.programe_audio_image
		},
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
	
				var audioImg_url = $("#audioImg_url");
	    		if (audioImg_url.val() != '') {
	    			$("#oldProgrameAudioImage").val(audioImg_url.val());
	        	}
	        	audioImg_url.val(uploadFilePath);
	        	$("#audioImg").val(uploadFilePath);
				$("#sp_file").uploadifySettings('scriptData', {
					oldUploadFile: uploadFilePath,
					modelType: upload.modelType.programe_audio_image
				}); 
	
				var showImgPath = $('#showImgPath');
				showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" width=\"100px\"/>");
				showImgPath.show();
	    	};
	
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});

	/**
	 * 节目管理上传节目主持人照片配置项
	 */
	upload.operListContentImgConfig = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldProgrameComperePhoto").val(),
	    	modelType: upload.modelType.programe_audio_image
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	        var callback = function(result) {	        	
	        	var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var index=$("#fileIndex").val();
				var operListContent_url = $("#operListContent_url_"+index);

				if (operListContent_url.val() != '') {
					$("#oldProgrameComperePhoto").val(operListContent_url.val());
				}
				operListContent_url.val(uploadFilePath);
				$("#programeComperePhoto").val(uploadFilePath);

				$("#jyp_file_"+index).uploadifySettings('scriptData', {
					oldUploadFile: uploadFilePath,
					modelType: upload.modelType.programe_audio_image
				});
				var showImgPath = $('#showImgPath_'+index); 
				showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" />");
				showImgPath.show();
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
    /**
     * banner管理上传banner配置项
     */
    upload.bannerImgConfig = $.extend(false, upload.baseImageUploadConfig, {
        'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
        'scriptData': {
            oldUploadFile : $("#oldProgrameComperePhoto").val(),
            modelType: upload.modelType.image_no_cut,
            imageId: "jyp_file_22_default"
        },
        'onComplete': function (event, ID, fileObj, response, data) {
            var callback = function(result) {
            	if(result.status=='0000'){
            		var fileName = result.fileName;            		
            		var uploadFilePath =storeBasePath+ result.uploadFilePath;
                    var fileSize = result.fileSize;
                    var index=$("#fileIndex").val();
                    var banner_url = $("#banner_url_"+index);

                    if (banner_url.val() != '') {
                        $("#oldProgrameComperePhoto").val(banner_url.val());
                    }
                    banner_url.val(uploadFilePath);
                    $("#programeComperePhoto").val(uploadFilePath);

                    $("#jyp_file_"+index).uploadifySettings('scriptData', {
                        oldUploadFile: uploadFilePath,
                        modelType: upload.modelType.image_no_cut
                    });

                    var showImgPath = $('#showImgPath_'+index);
                    showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"87px\"  width=\"275px\" />");
                    showImgPath.show();
            	}else{
            		alert(result.message);
            	}
                
            };
            upload.uploadFinish(response, callback);
        },
        'onSelectOnce': function () {
            $(".cancel").hover(function () {
                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
            }, function () {
                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
            });
            $(".cancel a").attr("title", "删除");
        }
    });
	/**
	 * 资讯管理上传节目主持人照片配置项
	 */
	upload.programUploadInformationComperePhotoConfig = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldProgrameComperePhoto").val(),
	    	modelType: upload.modelType.programe_compere_photo
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	        var callback = function(result) {
	        	var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var index=$("#fileIndex").val();
				
				var programeComperePhoto_url = $("#programeComperePhoto_url_"+index);

				if (programeComperePhoto_url.val() != '') {
					$("#oldProgrameComperePhoto").val(programeComperePhoto_url.val());
				}
				programeComperePhoto_url.val(uploadFilePath);
				$("#programeComperePhoto").val(uploadFilePath);

				$("#jyp_file_"+index).uploadifySettings('scriptData', {
					oldUploadFile: uploadFilePath,
					modelType: upload.modelType.programe_compere_photo
				});

				var showImgPath = $('#showImgPath_'+index); 
				showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"70px\" width=\"70px\"/>");
				showImgPath.show();
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});

	/**
	 * 音乐管理上传节目主持人照片配置项
	 */
	upload.programUploadMusicComperePhotoConfig = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldMusicProgrameComperePicturePath").val(),
	    	modelType: upload.modelType.programe_compere_picture_path
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	        var callback = function(result) {
	        	var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var index=$("#fileIndex").val();
				
				var musicProgrameComperePicturePath_url = $("#musicProgrameComperePicturePath_url_"+index);

				if (musicProgrameComperePicturePath_url.val() != '') {
					$("#oldMusicProgrameComperePicturePath").val(musicProgrameComperePicturePath_url.val());
				}
				musicProgrameComperePicturePath_url.val(uploadFilePath);
				$("#musicProgrameComperePicturePath").val(uploadFilePath);

				$("#jyp_file_"+index).uploadifySettings('scriptData', {
					oldUploadFile: uploadFilePath,
					modelType: upload.modelType.programe_compere_picture_path
				});

				var showImgPath = $('#showImgPath_'+index); 
				showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"70px\" width=\"70px\"/>");
				showImgPath.show();
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	
	/**
	 * 音乐管理上传配置项
	 */
	upload.musicUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
			oldUploadFile:$("#previousMusicUrl").val(),
	    	modelType: upload.modelType.music
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {	//TODO
	    		//音频文件的各项属性
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var audioTimeLength = result.audioTimeLength;
				//音频地址
				var audio_url = $("#musicFragmentPath");
				var audio_http = $("#music_http");
	            if (audio_url.val() != '') {
	            	$("#previousMusicUrl").val(audio_url.val());
	            }
	            audio_url.val(uploadFilePath);
	            
                $("#musicFragmentPlayName").val(fileName);
	            $("#musicFragmentPath").val(uploadFilePath);
	            $("#audioSize").val(fileSize);
	            $("#audioTimeLength").val(audioTimeLength);
	            $("#erroRaudioPath").html("");
	            $("#musicFragmentName").val(fileName.substring(0, fileName.indexOf(".")));
	            $("#musicFragmentPlayName").val(fileName.substring(0, fileName.indexOf(".")));
	            $("#audio_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	            $("#jyp_file").uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.music
	            });
	            //音频播放
	            audio_http.val( uploadFilePath);
	            musicPlayer.playAudio(audio_http.val(), 'audioPlay');
				//PlayMusic(audio_http.val());
	    	};
	    	upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	    	$(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});

	/**
	 * 资讯管理上传配置项
	 */
	upload.newsUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
	//	debugger ;
	    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
//	    	oldUploadFile : $("#").val(),	// TODO
	         oldUploadFile:$("#newsPath_url").val(),
	    	modelType: upload.modelType.news
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {	//TODO
	//TODO
	    		//音频文件的各项属性
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var audioTimeLength = result.audioTimeLength;
				//音频地址
				var audio_url = $("#newsPath");
				var audio_http = $("#audio_http");
	            if (audio_url.val() != '') {
	            	$("#newsPath_url").val(audio_url.val());
	            }
	            audio_url.val(uploadFilePath);
	            
                $("#fileName").val(fileName);
	            $("#newsPath").val(uploadFilePath);
	            $("#audioSize").val(fileSize);
	            $("#audioTimeLength").val(audioTimeLength);
	            $("#errorImgPath").html("");
	            $("#newsTitle").val(fileName.substring(0, fileName.indexOf(".")));
	            $("#audio_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	            $("#jyp_file").uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.news
	            });
	            //音频播放
	            audio_http.val(uploadFilePath);
				//PlayMusic(audio_http.val());
				  musicPlayer.playAudio(audio_http.val(), 'audioPlay');
	    	
	    	};
	    	upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	    	$(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");	
	    	// TODO	    	
	    }
	});

	/**
	 * 台宣管理上传配置项
	 */
	upload.platformDeclareMgmtUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldSoundPath").val(),	// TODO
	    	modelType: upload.modelType.platform_declare_mgmt
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {	//TODO
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var audioTimeLength = result.audioTimeLength;
				var audio_url = $("#audio_url");
				var audio_http = $("#audio_http");

	    		$("#baseAudioName").val(fileName);
	            if (audio_url.val() != '') {
	            	$("#oldSoundPath").val(audio_url.val());
	            }

	            audio_url.val(uploadFilePath);
	            $("#soundPath").val(uploadFilePath);
	            $("#soundSize").val(fileSize);
	            $("#soundTime").val(audioTimeLength);
	            audio_http.val( uploadFilePath);
	            $("#jyp_file").uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.platform_declare_mgmt
	            });
	            $("#erroRaudioPath").html("");
	            $("#declareName").val(fileName.substring(0, fileName.indexOf(".")));
	            $("#audio_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	            musicPlayer.playAudio(audio_http.val(), 'audioPlay');
	    	};
	    	upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	    	$(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");  	
	    }
	});
	
	/**
	 * 插播管理上传配置项
	 */
	upload.intercutUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldAudioPath").val(),	// TODO
	    	modelType: upload.modelType.intercut
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {	//TODO
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var audioTimeLength = result.audioTimeLength;
				var audio_url = $("#audio_url");
				var audio_http = $("#audio_http");

	            if (audio_url.val() != '') {
	            	$("#oldAudioPath").val(audio_url.val());
	            }

	            audio_url.val(uploadFilePath);
	            $("#audioPath").val(uploadFilePath);
	            $("#audioFileSize").val(fileSize);
	            $("#audioTimeLength").val(audioTimeLength);
	            audio_http.val(uploadFilePath);
	            $("#jyp_file").uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.platform_declare_mgmt
	            });
	            $("#erroRaudioPath").html("");
	            $("#audioName").val(fileName.substring(0, fileName.indexOf(".")));
	            $("#audio_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	            musicPlayer.playAudio(audio_http.val(), 'audioPlay');
	    	};
	    	upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	    	$(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");  	
	    }
	});
	
	/**
	 * 报时管理上传配置项
	 */
	upload.timeaudioUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldAudioPath").val(),	// TODO
	    	modelType: upload.modelType.time_audio
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {	//TODO
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var audioTimeLength = result.audioTimeLength;
				var audio_url = $("#audio_url");
				var audio_http = $("#audio_http");

	            if (audio_url.val() != '') {
	            	$("#oldAudioPath").val(audio_url.val());
	            }

	            audio_url.val(uploadFilePath);
	            $("#audioPath").val(uploadFilePath);
	            $("#audioFileSize").val(fileSize);
	            $("#audioTimeLength").val(audioTimeLength);
	            audio_http.val(uploadFilePath);
	            $("#jyp_file").uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.platform_declare_mgmt
	            });
	            $("#erroRaudioPath").html("");
	            $("#audioName").val(fileName.substring(0, fileName.indexOf(".")));
	            $("#audio_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	            musicPlayer.playAudio(audio_http.val(), 'audioPlay');
	    	};
	    	upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	    	$(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");  	
	    }
	});

	/**
	 * 背景管理上传图片配置项
	 */
	upload.frontCoverUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldUploadFile").val(),
	    	modelType: upload.modelType.front_cover
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {
	    		var uploadFilePath = storeBasePath+result.uploadFilePath
	    		$("#oldUploadFile").val(uploadFilePath);
	    		//上传按钮的标示
	    		var index=$("#fileIndex").val();
	    		var type=$("#type").val();
                var imgSrc= uploadFilePath
                // 添加操作
                if(type=='add'){
                	pObj.find(".jyp_file").uploadifySettings('scriptData',{oldUploadFile : ''});
                	pObj.find("img").attr("src", imgSrc);
                	pObj.children(".required").val(uploadFilePath); 
                	$("#isUpload").val("false");	    		
                	$("#belongUpload").val(index);	
                }else if(type=='update'){//修改操作
                	if($("#belongTo").val()==1000){
                		$("#belongTo_1000").find(".jyp_file").uploadifySettings('scriptData',{oldUploadFile : uploadFilePath});
                		$("#belongTo_1000").find("img").attr("src", imgSrc);
                		$("#belongTo_1000").find(".required").val(uploadFilePath); 
                	}else{
                		$("#table_updateImage").find(".jyp_file").uploadifySettings('scriptData',{oldUploadFile : uploadFilePath});
                		$("#table_updateImage").find("img").attr("src", imgSrc);
                		$("#table_updateImage").find(".required").val(uploadFilePath);
                	}
                	$("#imagePath").val(uploadFilePath);
				}
	    	};
	    	upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
            $(".cancel").hover(function () {
                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
            }, function () {
                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
            });
            $(".cancel a").attr("title", "删除");
            $("#isUpload").val("true");
	    }
	});
	
	/**
	* 闪屏图片管理上传图片配置项
	*/
	upload.initSplashScreenUploadImageConfig = function(value) {
		//debugger;
		//alert(1+$("#oldUploadFile").val());
		upload.splashScreenUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageBySplashScreen.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldUploadFile").val(),
		    	modelType: upload.modelType.splash_screen_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		//alert(result.uploadFilePath);
		    		//alert(2+$("#oldUploadFile").val());
		    		//alert("result.newImagePath"+result.newImagePath);
		    		if(result.status=='0000'){
		    			
		    			//alert($("#oldUploadFile").val());
		    			//debugger ;
		    			//上传按钮的标示
		    			var pObj=btnObj.parent();
		    			var index=pObj.attr("index");
		    			var size=pObj.attr("size");
		    			var type=$("#type").val();
		    			var imgSrc=storeBasePath+result.uploadFilePath;
		    			$("#oldUploadFile").val(imgSrc);
		    			//var lastIndex = imgSrc.lastIndexOf("/");
		    			//var newImagePath = imgSrc.substring(0, lastIndex+1);
		    			//alert(newImagePath);
		    			//alert(newImagePath);
		    			//$("#oldUploadFile").val(newImagePath);
		    			var jyp_file = value.attr("id");
		    			
		    			//var jpy_file_class = value.attr("class");
	
		    			//var jpy_files = $('.' + jpy_file_class);
		    			//debugger ;
		    			//jpy_files.each(function(_index) {
		    				//debugger ;
		    				//alert(value.attr("id"));
		    				//$(jpy_files[_index]).uploadifySettings('scriptData', {
				            	//oldUploadFile : newImagePath,
						    	//modelType: upload.modelType.splash_screen_image,
						    	//imageId: value.attr("id")
				            //});
		    			//});
		    			//alert('ok');
		    			//return ;
		    			//debugger ;
	    				$("#"+jyp_file).uploadifySettings('scriptData', {
			            	oldUploadFile : imgSrc,
					    	modelType: upload.modelType.splash_screen_image,
					    	mageId: jyp_file
			            });
	    				//如果上传的是原始图片，需要裁图
		    			//alert(size+"_"+index);
	    				if(index=='default') {
	    					pObj.parent().parent().find(".uplaod_false").hide();
	    					//原图
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    					var lastIndex=imgSrc.lastIndexOf("default.");
	    					var startPath=imgSrc.substring(0,lastIndex);
	    					var imageName = imgSrc.substring(lastIndex);
	    					var suffix=imageName.substring(imageName.lastIndexOf("."));
	    					//ios5
	    					var ios5Obj=$("#"+size+"_ios5");
	    					var ios5W=ios5Obj.find(".imageWidthClass").val();
	    					var ios5H=ios5Obj.find(".imageHeightClass").val();
	    					var imagePathIos5=startPath+ios5W+"_"+ios5H+suffix;
	    					ios5Obj.find("img[name='imageShow']").attr("src", imagePathIos5);
	    					ios5Obj.children(".required").val(imagePathIos5);
	    					//ios4
	    					var ios4Obj=$("#"+size+"_ios4");
	    					var ios4W=ios4Obj.find(".imageWidthClass").val();
	    					var ios4H=ios4Obj.find(".imageHeightClass").val();
	    					var imagePathIos4=startPath+ios4W+"_"+ios4H+suffix;
	    					ios4Obj.find("img[name='imageShow']").attr("src", imagePathIos4);
	    					ios4Obj.children(".required").val(imagePathIos4);
	    					//max
	    					var maxObj=$("#"+size+"_max");
	    					var maxW=maxObj.find(".imageWidthClass").val();
	    					var maxH=maxObj.find(".imageHeightClass").val();
	    					var imagePathMax=startPath+maxW+"_"+maxH+suffix;
	    					maxObj.find("img[name='imageShow']").attr("src", imagePathMax);
	    					maxObj.children(".required").val(imagePathMax);
	    					//middle
	    					var middleObj=$("#"+size+"_middle");
	    					var middleW=middleObj.find(".imageWidthClass").val();
	    					var middleH=middleObj.find(".imageHeightClass").val();
	    					var imagePathMiddle=startPath+middleW+"_"+middleH+suffix;
	    					middleObj.find("img[name='imageShow']").attr("src", imagePathMiddle);
	    					middleObj.children(".required").val(imagePathMiddle);
	    					//small
	    					var smallObj=$("#"+size+"_small");
	    					var smallW=smallObj.find(".imageWidthClass").val();
	    					var smallH=smallObj.find(".imageHeightClass").val();
	    					var imagePathSmall=startPath+smallW+"_"+smallH+suffix;
	    					smallObj.find("img[name='imageShow']").attr("src", imagePathSmall);
	    					smallObj.children(".required").val(imagePathSmall);
	    				}else{
	    					//pObj.find("img[name='imageShow']").attr("src", "");
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    				}
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.splashScreenUploadImageConfig;
	};
	/**
	 * 图片管理上传封面图片配置项
	 */
	upload.initCoverUploadImageConfig = function(value) {
	
		//debugger ;
		upload.coverUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldUploadFile").val(),
		    	modelType: upload.modelType.image_cover,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		//alert(result.status);
		    		if(result.status=='0000'){
		    			$("#oldUploadFile").val(result.uploadFilePath);
		    			debugger;
		    			//上传按钮的标示
		    			var pObj=$(value).parent().parent();
		    			var index=pObj.attr("index");
		    			var size=pObj.attr("size");
		    			var type=$("#type").val();
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				//如果上次的播放页面图片，需要裁图
		    			//alert(size+"_"+index);
	    				if(index=='default') {
	    					pObj.parent().find(".uplaod_false").hide();
	    					//播放页面
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    					pObj.children(".pichiddenInput").val(imgSrc); 
	    					var lastIndex=imgSrc.lastIndexOf("default.");
	    					var startPath=imgSrc.substring(0,lastIndex);
	    					var imageName = imgSrc.substring(lastIndex);
	    					var suffix=imageName.substring(imageName.lastIndexOf("."));
	    					//浏览图
	    					var middleObj=$("#"+size+"_middle");
	    					var middleW=middleObj.find(".imageWidthClass").val();
	    					var middleH=middleObj.find(".imageHeightClass").val();
	    					var imagePath2=startPath+middleW+"_"+middleH+suffix;
	    					//middleObj.find("img[name='imageShow']").attr("src", wsBaseUrl+imagePath2);
	    					middleObj.children(".required").val(imagePath2);
	    					middleObj.children(".pichiddenInput").val(imagePath2);
	    					//订阅图
	    					var smallObj=$("#"+size+"_small");
	    					var smallW=smallObj.find(".imageWidthClass").val();
	    					var smallH=smallObj.find(".imageHeightClass").val();
	    					var imagePath3=startPath+smallW+"_"+smallH+suffix;
	    					//smallObj.find("img[name='imageShow']").attr("src", wsBaseUrl+imagePath3);
	    					smallObj.children(".required").val(imagePath3);
	    					smallObj.children(".pichiddenInput").val(imagePath3);
	    				}else{
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc);
	    					pObj.children(".pichiddenInput").val(imgSrc);
	    				}
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.coverUploadImageConfig;
	};
	/**
	 * 推荐应用上传图片配置项
	 */
	upload.recommendedAppUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
	//	debugger ;
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
//	    	oldUploadFile : $("#").val(),	// TODO
	         oldUploadFile:$("#audio_url").val(),
	    	modelType: upload.modelType.recommended_app_image
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	        var callback = function(result) {
	        	var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
	
	           var programeImg_url = $("#audio_url");
	
	           if (programeImg_url.val() != '') {
	            	$("#oldAppImgSrc").val(programeImg_url.val());
	           }
	           programeImg_url.val(uploadFilePath);
	           $("#appImgSrc").val(uploadFilePath);
	           $("#imageShow").attr("src", uploadFilePath);
	
	           $("#jyp_file").uploadifySettings('scriptData', {
	        	   oldUploadFile: uploadFilePath,
	        	   modelType: upload.modelType.programe_image
	           }); 

	           var showImgPath = $('#audio_btn'); 
	           showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" width=\"100px\"/>");
	           showImgPath.show();
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	
	/**
	 * 有声读物点播分类管理上传图片配置项
	 */
	upload.talkingRequestTypeUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
		'scriptData': {
			oldUploadFile: $("#oldTalkingRequestTypeImage").val(),// TODO
			modelType: upload.modelType.programe_audio_image
		},
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				//alert(uploadFilePath);
				var imagePath_url = $("#imagePath");
	    		if (imagePath_url.val() != '') {
	    			$("#oldTalkingRequestTypeImage").val(imagePath_url.val());
	        	}
	        	imagePath_url.val(uploadFilePath);
	        	$("#imagePath").val(uploadFilePath);
	        	//alert(wsBaseUrl + uploadFilePath);
				$("#jyp_file").uploadifySettings('scriptData', {
					oldUploadFile: uploadFilePath,
					modelType: upload.modelType.programe_audio_image
				}); 
	
				var showImgPath = $('#showImgPath');
				//alert(wsBaseUrl + uploadFilePath);
				showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" width=\"100px\"/>");
				showImgPath.show();
	    	};
	
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	
	/**
	 * 节目点播分类管理上传图片配置项
	 */
	upload.talkingRequestTypeUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
		'scriptData': {
			oldUploadFile: $("#oldRequestTypeImage").val(),// TODO
			modelType: upload.modelType.programe_audio_image
		},
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				//alert(uploadFilePath);
				var imagePath_url = $("#imagePath");
	    		if (imagePath_url.val() != '') {
	    			$("#oldRequestTypeImage").val(imagePath_url.val());
	        	}
	        	imagePath_url.val(uploadFilePath);
	        	$("#imagePath").val(uploadFilePath);
	        	//alert(wsBaseUrl + uploadFilePath);
				$("#jyp_file").uploadifySettings('scriptData', {
					oldUploadFile: uploadFilePath,
					modelType: upload.modelType.programe_audio_image
				}); 
	
				var showImgPath = $('#showImgPath');
				//alert(wsBaseUrl + uploadFilePath);
				showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" width=\"100px\"/>");
				showImgPath.show();
	    	};
	
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	
	/**
	 * 有声读物上传节目主持人照片配置项
	 */
	upload.talkingBookUploadPhotoConfig = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldTalkingBookPhoto").val(),
	    	modelType: upload.modelType.programe_audio_image
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	        var callback = function(result) {
	    		//debugger ;
	        	var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var index=$("#fileIndex").val();

				var talkingBookPhoto_url = $("#talkingBookPhoto_url_"+index);

				if (talkingBookPhoto_url.val() != '') {
					$("#oldTalkingBookPhoto").val(talkingBookPhoto_url.val());
				}
				talkingBookPhoto_url.val(uploadFilePath);
				$("#talkingBookPhoto").val(uploadFilePath);

				$("#jyp_file_"+index).uploadifySettings('scriptData', {
					oldUploadFile: uploadFilePath,
					modelType: upload.modelType.programe_audio_image
				});
				
				var showImgPath = $('#showImgPath_'+index); 
				showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"70px\" width=\"70px\"/>");
				showImgPath.show();
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	/**
	 * 有声读物碎片管理上传音频配置
	 */
	upload.talkingBookAudioUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
		'scriptData': {
			oldUploadFile: $("#oldTalingBookAudio").val(),
			modelType: upload.modelType.talkingbook_audio
		},
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var audioTimeLength = result.audioTimeLength;

				var audio_url = $("#audio_url");
				var audio_http = $("#audio_http");

	    		$("#baseAudioName").val(fileName);
	            if (audio_url.val() != '') {
	            	$("#oldTalingBookAudio").val(audio_url.val());
	            }

	            audio_url.val(uploadFilePath);
	            $("#audioPath").val(uploadFilePath);
	            $("#audioSize").val(fileSize);
	            $("#audioTimeLength").val(audioTimeLength);
	            audio_http.val(uploadFilePath);
	
	            $("#jyp_file").uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.talkingbook_audio
	            });

	            $("#erroRaudioPath").html("");
	            $("#audioName").val(fileName.substring(0, fileName.indexOf(".")));
	            $("#audio_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	            musicPlayer.playAudio(audio_http.val(), 'audioPlay');
	    	};

	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});

	/**
	 * 爱车天天汇上传音频
	 */
	upload.initAiCheTianTianHuiUploadAudioConfig = function() {
		upload.aiCheTianTianHuiUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
			'scriptData': {
				oldUploadFile: $("#oldProgrameAudio").val(),
				modelType: upload.modelType.ai_che_tian_tian_hui_audio
			},
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		var fileName = result.fileName;
					var uploadFilePath =storeBasePath+ result.uploadFilePath;
					var fileSize = result.fileSize;
					var audioTimeLength = result.audioTimeLength;

					var audio_url = $("#audio_url");
					var audio_http = $("#audio_http");

		    		$("#baseAudioName").val(fileName);
		            if (audio_url.val() != '') {
		            	$("#oldProgrameAudio").val(audio_url.val());
		            }

		            audio_url.val(uploadFilePath);
		            $("#audioPath").val(uploadFilePath);
		            $("#audioSize").val(fileSize);
		            $("#audioTimeLength").val(audioTimeLength);
		            audio_http.val(uploadFilePath);

		            $("#jyp_file").uploadifySettings('scriptData', {
		            	oldUploadFile: uploadFilePath,
		            	modelType: upload.modelType.ai_che_tian_tian_hui_audio
		            });

		            $("#erroRaudioPath").html("");
//		            $("#audioName").val(fileName.substring(0, fileName.indexOf(".")));
		            $("#audio_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
		            musicPlayer.playAudio(audio_http.val(), 'audioPlay');
		    	};

		        upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
		        $(".cancel").hover(function () {
		            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
		        }, function () {
		            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
		        });
		        $(".cancel a").attr("title", "删除");
		    }
		});
		return upload.aiCheTianTianHuiUploadAudioConfig;
	};


	/**
	 * 碎片管理上传图片配置项
	 */
	upload.initAiCheTianTianHuiUploadImageConfig = function() {
		upload.aiCheTianTianHuiUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
			'scriptData': {
				oldUploadFile: $("#oldProgrameAudioImage").val(),
				modelType: upload.modelType.ai_che_tian_tian_hui_image
			},
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		var fileName = result.fileName;
					var uploadFilePath =storeBasePath+ result.uploadFilePath;
					var fileSize = result.fileSize;

					var audioImg_url = $("#audioImg_url");
		    		if (audioImg_url.val() != '') {
		    			$("#oldProgrameAudioImage").val(audioImg_url.val());
		        	}
		        	audioImg_url.val(uploadFilePath);
		        	$("#audioImg").val(uploadFilePath);
					$("#sp_file").uploadifySettings('scriptData', {
						oldUploadFile: uploadFilePath,
						modelType: upload.modelType.ai_che_tian_tian_hui_image
					}); 

					var showImgPath = $('#showImgPath');
					showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" width=\"100px\"/>");
					showImgPath.show();
		    	};
		
		        upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
		        $(".cancel").hover(function () {
		            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
		        }, function () {
		            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
		        });
		        $(".cancel a").attr("title", "删除");
		    }
		});
		return upload.aiCheTianTianHuiUploadImageConfig;
	};
	/**
	 * 版本控制apk上传图片配置项
	 */
	upload.versionControllerUploadApkConfig = $.extend(false, upload.baseApkUploadConfig, {
	    'script': upload.ctx +  '/controller/admin/upload/uploadApk.do;jsessionid=' + upload.jsessionid,
		'scriptData': {
			oldUploadFile: $("#oldVersionControllerApk").val(),
			modelType: upload.modelType.version_controller_apk
		},
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var callback = function(result) {
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				//var audioTimeLength = result.audioTimeLength;

				var apk_url = $("#apk_url");

	    		$("#baseApkName").val(fileName);
	            if (apk_url.val() != '') {
	            	$("#oldVersionControllerApk").val(apk_url.val());
	            }

	            apk_url.val(uploadFilePath);
	            $("#apkUrl").val(uploadFilePath);
	            $("#apkSize").val(fileSize);
	
	            $("#jyp_file").uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.version_controller_apk
	            });

	            $("#erroApkPath").html("");
	            $("#apkName").val(fileName.substring(0, fileName.indexOf(".apk")));
	            $("#apk_btn").show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	    	};

	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	/**
	 * 乐库管理音频上传配置项
	 */
	upload.happyLibraryAudioUploadAudioConfig = $.extend(false, upload.baseAudioUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadAudio.do;jsessionid=' + upload.jsessionid,
		'scriptData': {
			oldUploadFile: $("#oldNoDjCompleteAudioPath").val(),
			modelType: upload.modelType.happy_library_audio
		},
	    'onComplete': function (event, ID, fileObj, response, data) {
	    	var index= $("#fileIndex").val();
	    	var callback = function(result) {
	    		var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var audioTimeLength = result.audioTimeLength;
				var happyLibraryAudioUr = $("#happyLibraryAudioUrl"+index);
				var happyLibraryAudioHttp = $("#happyLibraryAudioHttp"+index);
				happyLibraryAudioUr.val(uploadFilePath);
		        happyLibraryAudioHttp.val(uploadFilePath);
		        putAudioValue(index,fileName,uploadFilePath,fileSize,audioTimeLength);//上传音频赋值
	            $("#happyLibraryAudioFile"+index).uploadifySettings('scriptData', {
	            	oldUploadFile: uploadFilePath,
	            	modelType: upload.modelType.happy_library_audio
	            });
	            $("#happyLibraryAudioErroRaudioPath"+index).html("");
	            $("#happyLibraryAudioBtn"+index).show().find("span:first").html(fileName + "&nbsp;&nbsp;&nbsp;");
	            musicPlayer.playAudio(happyLibraryAudioHttp.val(), 'happyLibraryAudioPlay'+index);
	            $("#isUpload").val("false");
	    	};
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	        $("#isUpload").val("true");
	    }
	});
	/**
	 * 乐库管理上传所属专辑图片
	 */
	upload.happyLibraryUploadPhotoConfig = function(value) {
		//debugger ;
		upload.coverUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldUploadFile").val(),
		    	modelType: upload.modelType.happy_library_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		if(result.status=='0000'){
		    			$("#oldUploadFile").val(storeBasePath+result.uploadFilePath);
		    			//上传按钮的标示
		    			var pObj=$(value).parent().parent().parent();
		    			var imgSrc=storeBasePath+result.uploadFilePath;
		    			$("#defaultImgShow").val(imgSrc);
		    			pObj.find("img[name='imageShow']").attr("src", imgSrc);
    					pObj.children(".required").val(imgSrc); 
    					$("#image_url_7_default").val(imgSrc);
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.coverUploadImageConfig;
	};
	/**
	 * 主题包管理上传图片配置项
	 */
	upload.initTitlePackageUploadImageConfig = function(value) {
		upload.titlePackageUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldImg").val(),
		    	modelType: upload.modelType.title_package_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		 //debugger;
		    		//alert(result.status);
		    		if(result.status=='0000'){
		    			$("#oldImg").val(storeBasePath+result.uploadFilePath);
		    			//上传按钮的标示
		    			var pObj=$(value).parent().parent();
//		    			var index=pObj.attr("index");
//		    			var size=pObj.attr("size");
//		    			var type=$("#type").val();
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				//如果上次的播放页面图片，需要裁图
		    			//alert(size+"_"+index);
		    			$("#img").val(imgSrc);
		    			pObj.find("img[name='imageShow']").attr("src", imgSrc);
    					pObj.children(".required").val(imgSrc); 
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.titlePackageUploadImageConfig;
	};
	/**
	 * 频道管理上传图片配置项
	 */
	upload.initMusicChannelUploadImageConfig = function(value) {
		//debugger ;
		upload.musicChannelUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldMusicChannelImage").val(),
		    	modelType: upload.modelType.music_channel_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		//alert(result.status);
		    		if(result.status=='0000'){
                        var pObj=value.parent().parent();
                        //上传按钮的标示
//                        pObj.find(".oldChannelImage").val(result.uploadFilePath);
                        var index=pObj.attr("index");
                        var size=pObj.attr("size");
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				//如果上次的播放页面图片，需要裁图
		    			//alert(size+"_"+index);
		    			pObj.find(".pichiddenInput").val(imgSrc);
	    				if(index=='default') {
	    					pObj.parent().find(".uplaod_false").hide();
	    					//播放页面
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    				}else{
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    				}
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.musicChannelUploadImageConfig;
	};
	
	/**
	 * 电台信息管理
	 */
	upload.initRadioInfoUploadImageConfig = function(value) {
		//debugger ;
		upload.radioInfoChannelUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldMusicChannelImage").val(),
		    	modelType: value.attr("id")=='jyp_file_20_default'?upload.modelType.radio_info_cover_image:upload.modelType.radio_info_logo_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		//alert(result.status);
		    		if(result.status=='0000'){
                        var pObj=value.parent().parent();
                        //上传按钮的标示
//                        pObj.find(".oldChannelImage").val(result.uploadFilePath);
                        var index=pObj.attr("index");
                        var size=pObj.attr("size");
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				//如果上次的播放页面图片，需要裁图
		    			//alert(size+"_"+index);
		    			pObj.find(".pichiddenInput").val(imgSrc);
	    				if(index=='default') {
	    					pObj.parent().find(".uplaod_false").hide();
	    					//播放页面
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    				}else{
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    				}
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.radioInfoChannelUploadImageConfig;
	};

	/**
	 * 信息源管理图片
	 */
	upload.infoSourceUploadPhotoConfig = function(value) {
		//debugger ;
		upload.infoSourceUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadMoreImage.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldUploadFile").val(),
		    	modelType: upload.modelType.info_source_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	//alert("id="+value.attr("id"));
		    	var callback = function(result) {
		    		if(result.status=='0000'){
		    			$("#oldUploadFile").val(storeBasePath+result.uploadFilePath);
		    			//上传按钮的标示
		    			//var pObj=btnObj.parent();
		    			var pObj=$("#"+value.attr("id")).parent().parent();
		    			//console.log(pObj);
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				//如果上次的播放页面图片，需要裁图
		    			//alert(size+"_"+index);
		    			$("#imgURL").val(imgSrc);
		    			pObj.find("img[name='imageShow']").attr("src", imgSrc);
    					pObj.children(".required").val(imgSrc);
    					//var clonId=value.attr("id");
    					//console.log(clonId);
    					//clonId.parent().parent().find(".validation-advice").hide();
    					pObj.find(".validation-advice").hide();
    					//optionUrl=temp.replace(","+id,","+data);
    					//console.log();
    					//pObj.find(".required").removeClass("validation-failed");
    					//pObj.find(".required").addClass("validation-passed");
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.infoSourceUploadImageConfig;
	};


	/**
	 * 升级产品管理
	 */
	upload.initAppGroupUpgradeTargetConfig = function() {
		upload.appGroupUpgradeTargetConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadMoreImage.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldUploadFile").val(),
		    	modelType: upload.modelType.app_group_upgrade_target,
		    	imageId: $('#imageId').val()
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	//alert("id="+value.attr("id"));
		    	var callback = function(result) {
		    		if(result.status=='0000'){
		    			var fileName = result.fileName;
						var uploadFilePath =storeBasePath+ result.uploadFilePath;
						var fileSize = result.fileSize;
						$('#img').val(uploadFilePath);

						$("input[name='imagePathFile']").val(uploadFilePath);
						$("img[name='imageShow']").attr("src", uploadFilePath);
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.appGroupUpgradeTargetConfig;
	};

	/**
	 * 频道设置图片
	 */
	upload.channelSetUploadPhotoConfig = function(value) {
		//debugger ;
		upload.channelSetUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadMoreImage.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldUploadFile").val(),
		    	modelType: upload.modelType.channel_settings_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	//alert("id="+value.attr("id"));
		    	var callback = function(result) {
		    		if(result.status=='0000'){
		    			$("#oldUploadFile").val(storeBasePath+result.uploadFilePath);
		    			//上传按钮的标示
		    			//var pObj=btnObj.parent();
		    			var pObj=$("#"+value.attr("id")).parent().parent();
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				//如果上次的播放页面图片，需要裁图
		    			//alert(size+"_"+index);
		    			$("#imgURL").val(imgSrc);
		    			pObj.find("img[name='imageShow']").attr("src", imgSrc);
    					pObj.children(".required").val(imgSrc); 
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.channelSetUploadImageConfig;
	};
	
	/**
	 * 直播流管理上传图片配置项
	 */
	upload.initLiveTelecastFlowUploadImageConfig = function(value) {
		//debugger ;
		upload.liveTelecastFlowUploadImageConfig  = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldLiveImg").val(),
		    	modelType: upload.modelType.live_telecast_flow_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		//alert(result.status);
		    		if(result.status=='0000'){
		    			$("#oldLiveImg").val(storeBasePath+result.uploadFilePath);
		    			//上传按钮的标示
		    			var pObj=btnObj.parent();
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				//如果上次的播放页面图片，需要裁图
		    			//alert(size+"_"+index);
		    			$("#liveImg").val(imgSrc);
		    			pObj.parent().find(".uplaod_false").hide();
		    			pObj.find("img[name='imageShow']").attr("src", imgSrc);
    					pObj.children(".required").val(imgSrc);
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.liveTelecastFlowUploadImageConfig;
	};

    /**
     * 节目RSS图片
     */
    upload.initProgramRssImgConfig = function() {
        upload.programRssImgConfig = $.extend(false, upload.baseImageUploadConfig, {
            'fileExt': '*.jpg;',
            'script': upload.ctx + '/controller/admin/upload/uploadMoreImage.do;jsessionid=' + upload.jsessionid,
            'scriptData': {
                oldUploadFile : $("#oldUploadFile").val(),
                modelType: upload.modelType.program_rss_image,
                imageId: $('#imageId').val()
            },
            'onComplete': function (event, ID, fileObj, response, data) {
                var callback = function(result) {
                    if(result.status=='0000') {
                        var fileName = result.fileName;
                        var uploadFilePath =storeBasePath+ result.uploadFilePath;
                        var fileSize = result.fileSize;

                        var showImgPath = $('#showImgPath');
                        $("#rssImagePath").val(uploadFilePath);
                        showImgPath.find('img').attr("src", uploadFilePath);
                        showImgPath.show();
                    } else {
                        alert(result.message);
                    }
                };
                upload.uploadFinish(response, callback);
            },
            'onSelectOnce': function () {
                $(".cancel").hover(function () {
                    $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
                }, function () {
                    $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
                });
                $(".cancel a").attr("title", "删除");
                $("#isUpload").val("true");
            }
        });
        return upload.programRssImgConfig;
    };
    /**
	 * 上传图片配置项
	 */
	upload.initUploadImageConfig = function(value) {
		debugger ;
		upload.uploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldImage").val(),
		    	modelType: upload.modelType.title_package_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		if(result.status=='0000'){
		    			var imgSrc=storeBasePath+result.uploadFilePath;
		    			$("#oldImage").val(imgSrc);
		    			//上传按钮的标示
		    			//var pObj=btnObj.parent();
		    			var pObj=$("#"+value.attr("id")).parent().parent();
	    				//如果上次的播放页面图片，需要裁图
		    			//alert(size+"_"+index);
		    			pObj.find("img[name='imageShow']").attr("src", imgSrc);
    					pObj.children(".required").val(imgSrc); 
    					$("#imgPath").val(imgSrc);
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.uploadImageConfig;
	};
	
	/**
	 * 默认上传图片配置项
	 */
	upload.uploadDefaultImageConfig = $.extend(false, upload.baseImageUploadConfig, {
	//	debugger ;
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
//	    	oldUploadFile : $("#").val(),	// TODO
	         oldUploadFile:$("#oldDefaultImg").val(),
	    	modelType: upload.modelType.recommended_app_image
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	        var callback = function(result) {
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
	           var programeImg_url = $("#img_default_url");
	
	           if (programeImg_url.val() != '') {
	            	$("#oldDefaultImg").val(programeImg_url.val());
	           }
	           programeImg_url.val(uploadFilePath);
	           $("#defaultImgSrc").val(uploadFilePath);
	          // $("#defaultImgSrc").attr("src", wsBaseUrl+uploadFilePath);
	
	           $("#jyp_file").uploadifySettings('scriptData', {
	        	   oldUploadFile: uploadFilePath,
	        	   modelType: upload.modelType.recommended_app_image
	           }); 

	           var showImgPath = $('#defaultImgShow'); 
	           showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" width=\"100px\"/>");
	           showImgPath.show();
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	
	/**
	 * 直播管理
	 */
	upload.operListImg = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldProgrameComperePhoto").val(),
	    	modelType: upload.modelType.image_no_cut,
	    	imageId: "jyp_file_23_default"
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	        var callback = function(result) {
	        	if(result.status=='0000'){
	        		var fileName = result.fileName;
					var uploadFilePath =storeBasePath+ result.uploadFilePath;
					var fileSize = result.fileSize;
					var index=$("#fileIndex").val();
					var operListContent_url = $("#operListContent_url_1");

					if (operListContent_url.val() != '') {
						$("#oldProgrameComperePhoto").val(operListContent_url.val());
					}
					operListContent_url.val(uploadFilePath);
					$("#programeComperePhoto").val(uploadFilePath);

					$("#jyp_file_1").uploadifySettings('scriptData', {
						oldUploadFile: uploadFilePath,
						modelType: upload.modelType.image_no_cut
					});
					var showImgPath = $('#showImgPath_1'); 
					showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"87px\" width=\"257px\" />");
					showImgPath.show();
	        	}else{
	        		alert(result.message);
	        	}	        	
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	
	/**
	 * 直播管理2
	 */
	upload.operLiveImg = $.extend(false, upload.baseImageUploadConfig, {
	    'script': upload.ctx + '/controller/admin/upload/uploadImage.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldProgrameComperePhoto").val(),
	    	modelType: upload.modelType.programe_audio_image
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {
	        var callback = function(result) {
	        	var fileName = result.fileName;
				var uploadFilePath =storeBasePath+ result.uploadFilePath;
				var fileSize = result.fileSize;
				var index=$("#fileIndex").val();
				var operListContent_url = $("#operListContent_url_2");

				if (operListContent_url.val() != '') {
					$("#oldProgrameComperePhoto").val(operListContent_url.val());
				}
				operListContent_url.val(uploadFilePath);
				$("#programeComperePhoto").val(uploadFilePath);

				$("#jyp_file_2").uploadifySettings('scriptData', {
					oldUploadFile: uploadFilePath,
					modelType: upload.modelType.programe_audio_image
				});
				debugger;
				var showImgPath = $('#showImgPath_2'); 
				showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" />");
				showImgPath.show();
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	
	/**
	 * 分类管理上传图片
	 */
	upload.initCatalogUploadImageConfig = function(value) {
		//debugger ;
		upload.catalogUploadImageConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldTitlePackageImage").val(),
		    	modelType: upload.modelType.cms_catalog_image,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		//alert(result.status);
		    		
		    		if(result.status=='0000'){
		    			
		    			//$("#oldTitlePackageImage").val(result.uploadFilePath);
		    			//上传按钮的标示	
		    			var pObj=$(value).parent().parent();		    			
		    			var index=pObj.attr("index");
		    			var size=pObj.attr("size");
		    			var type=$("#type").val();
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				//如果上次的播放页面图片，需要裁图
		    			
		    			//alert(size+"_"+index);
		    			$("#titleImg").val(imgSrc);
	    				if(index=='default') {
	    					pObj.parent().find(".uplaod_false").hide();
	    					//播放页面
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    					var lastIndex=imgSrc.lastIndexOf("default.");
	    					var startPath=imgSrc.substring(0,lastIndex);
	    					var imageName = imgSrc.substring(lastIndex);
	    					var suffix=imageName.substring(imageName.lastIndexOf("."));
	    					//浏览图
	    					var middleObj=$("#"+size+"_middle");
	    					var middleW=middleObj.find(".imageWidthClass").val();
	    					var middleH=middleObj.find(".imageHeightClass").val();
	    					var imagePath2=startPath+middleW+"_"+middleH+suffix;
	    					middleObj.find("img[name='imageShow']").attr("src", imagePath2);
	    					middleObj.children(".required").val(imagePath2);
	    					//浏览图
	    					var middleObj2=$("#"+size+"_middle2");
	    					var middleW=middleObj2.find(".imageWidthClass").val();
	    					var middleH=middleObj2.find(".imageHeightClass").val();
	    					var imagePath4=startPath+middleW+"_"+middleH+suffix;
	    					middleObj2.find("img[name='imageShow']").attr("src", imagePath4);
	    					middleObj2.children(".required").val(imagePath4);
	    					//订阅图
	    					var smallObj=$("#"+size+"_small");
	    					var smallW=smallObj.find(".imageWidthClass").val();
	    					var smallH=smallObj.find(".imageHeightClass").val();
	    					var imagePath3=startPath+smallW+"_"+smallH+suffix;
	    					smallObj.find("img[name='imageShow']").attr("src", imagePath3);
	    					smallObj.children(".required").val(imagePath3);
	    				}else{
	    					pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    					pObj.children(".required").val(imgSrc); 
	    				}
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.catalogUploadImageConfig;
	};
	
	/**
	 * 图片上传，用于将一张550*550的图片切割为340*340,250*250,100*100时使用
	 */
	upload.initImageCutOneToThreeConfig = $.extend(false, upload.baseImageUploadConfig, {
		'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
	    'scriptData': {
	    	oldUploadFile : $("#oldProgrameComperePhoto").val(),
	    	modelType: upload.modelType.image_cut_one_to_three,
	    	imageId: "jyp_file_21_default"
	    },
	    'onComplete': function (event, ID, fileObj, response, data) {	    	
	        var callback = function(result) {
	        	if(result.status=='0000'){
	        		var fileName = result.fileName;
					var uploadFilePath =storeBasePath+ result.uploadFilePath;
					var fileSize = result.fileSize;
					var index=$("#fileIndex").val();
					var operListContent_url = $("#operListContent_url_"+index);

					if (operListContent_url.val() != '') {
						$("#oldProgrameComperePhoto").val(operListContent_url.val());
					}
					operListContent_url.val(uploadFilePath);
					$("#programeComperePhoto").val(uploadFilePath);

					$("#jyp_file_"+index).uploadifySettings('scriptData', {
						oldUploadFile: uploadFilePath,
						modelType: upload.modelType.image_cut_one_to_three
					});
					var showImgPath = $('#showImgPath_'+index); 
					showImgPath.html("<img src=\"" + uploadFilePath + "\" alt=\"\" height=\"100px\" />");
					showImgPath.show();
	        	}else{
	        		alert(result.message);
	        	}	        	
	        };
	        upload.uploadFinish(response, callback);
	    },
	    'onSelectOnce': function () {
	        $(".cancel").hover(function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png");
	        }, function () {
	            $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png");
	        });
	        $(".cancel a").attr("title", "删除");
	    }
	});
	/**
	 * 上传一张指定尺寸图片，并不进行截图
	 */
	upload.initImageNoCutConfig = function(value) {
		//debugger ;
		upload.imageNoCutConfig = $.extend(false, upload.baseImageUploadConfig, {
		    'script': upload.ctx + '/controller/admin/upload/uploadImageByCover.do;jsessionid=' + upload.jsessionid,
		    'scriptData': {
		    	oldUploadFile : $("#oldTitlePackageImage").val(),
		    	modelType: upload.modelType.image_no_cut,
		    	imageId: value.attr("id")
		    },
		    'onComplete': function (event, ID, fileObj, response, data) {
		    	var callback = function(result) {
		    		//alert(result.status);
		    		
		    		if(result.status=='0000'){		    			
		    			//上传按钮的标示	
		    			var pObj=$(value).parent().parent();		    			
		    			var index=pObj.attr("index");
		    			var size=pObj.attr("size");
		    			var type=$("#type").val();
		    			var imgSrc=storeBasePath+result.uploadFilePath;
	    				pObj.find("img[name='imageShow']").attr("src", imgSrc);
	    				pObj.children(".required").val(imgSrc);	    				
		    		}else{
		    			alert(result.message);
		    		}
		    		$("#isUpload").val("false");
		    	};
		    	upload.uploadFinish(response, callback);
		    },
		    'onSelectOnce': function () {
	            $(".cancel").hover(function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel1.png")
	            }, function () {
	                $(this).find("img:first").attr("src", upload.ctx + "/js/uploadify/cancel.png")
	            });
	            $(".cancel a").attr("title", "删除");
	            $("#isUpload").val("true");
		    }
		});
		return upload.imageNoCutConfig;
	};
	exports.upload = upload;
})(jQuery, window);