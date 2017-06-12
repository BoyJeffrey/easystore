;(function($, exports, ctx) {
	/**
	 * 联想查询
	 */
	var associativeQuery = {
		baseConfig: {
			minChars: 0,
			width: 240,
			delay: 10,
			mustMatch: false,
			matchContains: true,
			scroll: true,
			autoFill: false
		},

		/**
		 * 后台返回单列时使用该方法
		 * pageConfig中包含以下配置项：
		 * @param url				地址						必传
		 * @param elementId			输入框id					必传
		 * @param resultFunction	每次点击一条时的回调函数
		 * @param dataArray			是否需要缓存的数据，用户数据校验时使用
		 * 
		 * @param config			配置项
		 */
		singleColumnResultAssociative : function (pageConfig, associativeConfig) {        	
			var baseSingleColumnConfig = $.extend(false, this.baseConfig, {
				formatItem: function(item, i, max) { //debugger ;
                    return i + "/" + max + ":　　" + item[0];
                },
                formatResult:function(item) {
                    return item? item[0] :'';
                },
                formatMatch: function(item, i, max) {
                	return item? item[0] :'';
				}
			});
			var element = $("#" + pageConfig.elementId);
			$.getJSON(pageConfig.url, function(data) {
				if (pageConfig.dataArray) {
					pageConfig.dataArray = data;
				}
				element.autocomplete(data, $.extend(false, baseSingleColumnConfig, associativeConfig || {}));
				if (pageConfig.callbackFn) {
					pageConfig.callbackFn(data);
				}
			});
			if (pageConfig.resultFunction) {
				element.result(pageConfig.resultFunction);
			}
		},

		/**
		 * 后台返回多列时使用该方法
		 * pageConfig中包含以下配置项：
		 * @param url				地址						必传
		 * @param elementId			输入框id					必传
		 * @param displayColumnName	要显示出那列的id			必传
		 * @param resultFunction	每次点击一条时的回调函数		
		 * @param dataArray			是否需要缓存的数据，用户数据校验时使用		
		 * 
		 * @param config			配置项
		 */
		multipleColumnResultAssociative: function(pageConfig, associativeConfig) {
			var baseMultipleColumnConfig = $.extend(false, this.baseConfig, {
				formatItem: function(item, i, max) { //debugger ;
					return i + "/" + max + ":　　" + (item[pageConfig.displayColumnName] ?item[pageConfig.displayColumnName] :'');
                },
                formatResult:function(item) {
                	return item[pageConfig.displayColumnName] ?item[pageConfig.displayColumnName] :'';
                },
                formatMatch: function(item, i, max) {
                	return item[pageConfig.displayColumnName] ?item[pageConfig.displayColumnName] :'';
				}
			});
			var element = $("#" + pageConfig.elementId);
			$.getJSON(pageConfig.url, function(data) {
				if (pageConfig.dataArray) {
					pageConfig.dataArray = data;
				}
				element.autocomplete(data, $.extend(false, baseMultipleColumnConfig, associativeConfig || {}));
				if (pageConfig.callbackFn) {
					pageConfig.callbackFn(data);
				}
			});
			if (pageConfig.resultFunction) {
				element.result(pageConfig.resultFunction);
			}
		},
		/**
		 * 后台返回多列时使用该方法有回掉方法
		 * pageConfig中包含以下配置项：
		 * @param url				地址						必传
		 * @param elementId			输入框id					必传
		 * @param displayColumnName	要显示出那列的id			必传
		 * @param resultFunction	每次点击一条时的回调函数		
		 * @param dataArray			是否需要缓存的数据，用户数据校验时使用		
		 * @param callBack			回调函数	
		 * @param config			配置项
		 */
		multipleColumnResultCallBackAssociative: function(pageConfig, associativeConfig) {
			var baseMultipleColumnConfig = $.extend(false, this.baseConfig, {
				formatItem: function(item, i, max) { //debugger ;
					return i + "/" + max + ":　　" + (item[pageConfig.displayColumnName] ?item[pageConfig.displayColumnName] :'');
	            },
	            formatResult:function(item) {
	            	return item[pageConfig.inputColumnName];
	            },
	            formatMatch: function(item, i, max) {
	            	return item[pageConfig.displayColumnName] ?item[pageConfig.displayColumnName] :'';
				}
			});
			var element = $("#" + pageConfig.elementId);
			$.getJSON(pageConfig.url, {},function(data) {
				if (pageConfig.dataArray) {
					if(pageConfig.callBack) {
						pageConfig.callBack(pageConfig.elementId, data);
					}
					pageConfig.dataArray = data;
				}
				element.autocomplete(data, $.extend(false, baseMultipleColumnConfig, associativeConfig || {}));
				if (pageConfig.callbackFn) {
					pageConfig.callbackFn(data);
				}
			});
			if (pageConfig.resultFunction) {
				element.result(pageConfig.resultFunction);
			}
		}
	};
	
	/**
	 *主持人名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.schemeCompereNameAssociative = function(elementId, hiddenInput,dataCallBack, url) {
			var schemeComperePageConfig = {
        	url: url || (ctx + '/radio/infor/compereList.do'),
        	elementId: elementId,
        	displayColumnName: 'compereName',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
        		if(dataCallBack && $.isFunction(dataCallBack)){
        			dataCallBack.call(this, event, data, formatted);
        		}
			},
//			callBack: dataCallBack,
			inputColumnName:'compereName'
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	//var element = $("# + elementId");
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		//console.log();
		    	//alert(element.val());
	    		for (var i = 0; i < schemeComperePageConfig.dataArray.length; ++ i) {
	    			//alert("11");
	    			//console.log(element.val());
    				if (schemeComperePageConfig.dataArray[i].name == element.val()) {
    					hiddenInputElement.val(schemeComperePageConfig.dataArray[i].id);
    					element.css("color","#393939");
    					//alert("11");
    					//console.log(schemeComperePageConfig.dataArray[i].name);
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultCallBackAssociative(schemeComperePageConfig);
    	return schemeComperePageConfig;
	};
	/**
	 * 节目名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.programNameAssociative = function(elementId) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchProgramName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};
	
	/**
	 * 音乐节目名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.musicProgramNameAssociative = function(elementId) {
        var musicProgrameNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchMusicProgramName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(musicProgrameNamePageConfig);
	};
	
	/**
	 * 资讯名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.informationNameAssociative = function(elementId) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchInformationName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};
	
			/**
	 * 插播音频名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.intercutAudioNameAssociative = function(elementId) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchIntercutAudioName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};
	
			/**
	 * 报时音频名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.timeaudioAudioNameAssociative = function(elementId) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTimeaudioAudioName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};
	
	/**
	 *资讯 用户名联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.informationCreateUserNameAssociative = function(elementId) {
        var userNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchInformationUserName.do',
        	elementId: elementId
        };
        this.singleColumnResultAssociative(userNamePageConfig);
	};
	
		/**
	 *插播音频用户名联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.intercutAudioCreateUserNameAssociative = function(elementId) {
        var userNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchIntercutAudioUserName.do',
        	elementId: elementId
        };
        this.singleColumnResultAssociative(userNamePageConfig);
	};	
	
	/**
	 *报时音频用户名联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.timeaudioAudioCreateUserNameAssociative = function(elementId) {
        var userNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTimeaudioUserName.do',
        	elementId: elementId
        };
        this.singleColumnResultAssociative(userNamePageConfig);
	};	
		
	/**
	 *资讯碎片用户名联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.informationFragmentCreateUserNameAssociative = function(elementId,hiddenInput) {
        var userNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchInformationFragmentUserName.do?informationId=' + (hiddenInput ?hiddenInput :-1),
        	elementId: elementId
        };
        this.singleColumnResultAssociative(userNamePageConfig);
	};
	
			/**
	 * 资讯碎片名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.informationNewsTitleAssociative = function(elementId,hiddenInput) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchInformationNewsTitle.do?informationId=' + (hiddenInput ?hiddenInput :-1),
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};
	
			/**
	 *资讯 制作方联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.informationProgrameProducerAssociative = function(elementId, hiddenInput) {
    	var programeProducerPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchInformationProgrameProducer.do',
        	elementId: elementId,
        	displayColumnName: 'name',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
			}
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		setTimeout(function(value) {
	    			for (var i = 0; i < programeProducerPageConfig.dataArray.length; ++ i) {
	    				if (programeProducerPageConfig.dataArray[i].name == element.val()) {
	    					hiddenInputElement.val(programeProducerPageConfig.dataArray[i].id);
	    					break ;
	    				}
	    			}
	    		}, 300);
	    	});
    	}
    	this.multipleColumnResultAssociative(programeProducerPageConfig);
    	return programeProducerPageConfig;
	};	
	
	/**
	 * 音乐单曲碎片名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.musicFragmentNameAssociative = function(elementId) {
        var musicFragmentNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchMusicFragmentName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(musicFragmentNamePageConfig);
	};
	/**
	 * 音乐节目碎片名联想查询
	 * @param elementId	输入框id
	 * @param programeId 如果传入programeId 添加programeId条件
	 */
	associativeQuery.musicProgrameAudioNameAssociative = function(elementId, programeId) {
		var programeAudioNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchMusicProgramAudioName.do?musicProgramId=' + (programeId ?programeId :-1),
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeAudioNamePageConfig);
	};
	/**
	 * 音乐碎片管理碎片名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.manageMusicFragmentNameAssociative = function(elementId,musicProgramId) {
        var manageMusicFragmentNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchManageMusicFragmentName.do?musicProgramId=' + musicProgramId,
        	elementId: elementId
        };
		this.singleColumnResultAssociative(manageMusicFragmentNamePageConfig);
	};
	
	/**
	 * 音乐碎片演唱者联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.musicFragmentSingerAssociative = function(elementId,musicProgramId) {
        var musicFragmentSingerPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchMusicFragmentSinger.do?musicProgramId=' + musicProgramId,
        	elementId: elementId
        };
		this.singleColumnResultAssociative(musicFragmentSingerPageConfig);
	};
	
	/**
	 * 用户名联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.userNameAssociative = function(elementId) {
        var userNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchUserName.do',
        	elementId: elementId
        };
        this.singleColumnResultAssociative(userNamePageConfig);
	};

	/**
	 * 碎片名联想查询
	 * @param elementId	输入框id
	 * @param programeId 如果传入programeId 添加programeId条件
	 */
	associativeQuery.programeAudioNameAssociative = function(elementId, programeId) {
		var programeAudioNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchProgramAudioName.do?programId=' + (programeId ?programeId :-1),
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeAudioNamePageConfig);
	};

	/**
	 * 制作方联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
	associativeQuery.programeProducerAssociative = function(elementId, hiddenInput) {
    	var programeProducerPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchProgrameProducer.do',
        	elementId: elementId,
        	displayColumnName: 'name',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
			}
        };

    	if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		setTimeout(function(value) {
	    			for (var i = 0; i < programeProducerPageConfig.dataArray.length; ++ i) {
	    				if (programeProducerPageConfig.dataArray[i].name == element.val()) {
	    					hiddenInputElement.val(programeProducerPageConfig.dataArray[i].id);
	    					break ;
	    				}
	    			}
	    		}, 300);
	    	});
    	}
    	this.multipleColumnResultAssociative(programeProducerPageConfig);
    	return programeProducerPageConfig;
	};

	/**
	 * 时序规则名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.timingNameAssociative = function(elementId) {
        var timingNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTimingName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(timingNamePageConfig);
	};

	/**
	 * 插播规则名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.interCutNameAssociative = function(elementId) {
        var interCutNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchInterCutName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(interCutNamePageConfig);
	};
		/**
			 * 报时插播规则名称联想查询
			 * @param elementId	输入框id
			 */
			associativeQuery.timeAudioInterCutNameAssociative = function(elementId) {
		        var interCutNamePageConfig = {
		        	url: ctx + '/controller/admin/associativeQuery/matchTimeAudioInterCutName.do',
		        	elementId: elementId
		        };
				this.singleColumnResultAssociative(interCutNamePageConfig);
			};
			
		/**
			 * 概率规则名称联想查询
			 * @param elementId	输入框id
			 */
			associativeQuery.probabilityAudioInterCutNameAssociative = function(elementId) {
		        var interCutNamePageConfig = {
		        	url: ctx + '/controller/admin/associativeQuery/matchProbabilityName.do',
		        	elementId: elementId
		        };
				this.singleColumnResultAssociative(interCutNamePageConfig);
			};
	/**
	 * 属性名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.attibuteNameAssociative = function(elementId) {
        var attibuteNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchAttibuteName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(attibuteNamePageConfig);
	};
	/**
	 * 台宣联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.declareNameAssociative = function(elementId) {
        var declareNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchDeclareName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(declareNamePageConfig);
	};
	/**
	 * 方案名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.schemeNameAssociative = function(elementId) {
        var schemeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchSchemeName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(schemeNamePageConfig);
	};
	
	/**
	 * 关键词管理分类名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.categoryNameAssociative = function(elementId) {
        var categoryNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchCategoryName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(categoryNamePageConfig);
	};
	
	/**
	 * 关键词管理分类-关键词联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.keyWordNameAssociative = function(elementId) {
        var keyWordNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchKeyWordName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(keyWordNamePageConfig);
	};
	
	/**
	 * 其他关键词管理-关键词联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.otherKeyWordNameAssociative = function(elementId) {
        var otherKeyWordNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchOtherKeyWordName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(otherKeyWordNamePageConfig);
	};
	
	/**
	 * 关键词管理关注人名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.followerNameAssociative = function(elementId) {
        var followerNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchFollowerName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(followerNamePageConfig);
	};
	
	/**
	 * 关键词管理关注人-关键词联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.followerKeyWordNameAssociative = function(elementId) {
        var followerKeyWordNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchFollowerKeyWordName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(followerKeyWordNamePageConfig);
	};
	
	/**
	 * 播放规则-规则名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.ruleNameAssociative = function(elementId) {
        var ruleNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchRuleName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(ruleNamePageConfig);
	};
	
	/**
	 * 测试专用-测试名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.testSpecialNameAssociative = function(elementId) {
        var ruleNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTestSpecial.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(ruleNamePageConfig);
	};	
	
	/**
	 * 应用名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.recommendedAppNameAssociative = function(elementId) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/recommendedAppName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};
	
	/**
	 * 应用名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.recommendedIosAppNameAssociative = function(elementId) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/recommendedIosAppName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};

	/**
	 * view节目名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.viewProgramNameAssociative = function(elementId) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchViewProgramName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};

	/**
	 * view碎片名联想查询
	 * @param elementId	输入框id
	 * @param programeId 如果传入programeId 添加programeId条件
	 */
	associativeQuery.viewProgrameAudioNameAssociative = function(elementId, programeId) {
		var programeAudioNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchViewProgramAudioName.do?programId=' + (programeId ?programeId :-1),
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeAudioNamePageConfig);
	};
	/**
	 * 有声读物名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.talkingBookProgramNameAssociative = function(elementId) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTalkingBookName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};
	/**
	 *有声读物 用户名联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.talkingBookCreateUserNameAssociative = function(elementId) {
        var userNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTalkingBookUserName.do',
        	elementId: elementId
        };
        this.singleColumnResultAssociative(userNamePageConfig);
	};
	/**
	 *有声读物 制作方联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.talkingBookProgrameProducerAssociative = function(elementId, hiddenInput) {
    	var programeProducerPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTalkingBookProgrameProducer.do',
        	elementId: elementId,
        	displayColumnName: 'name',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
			}
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		setTimeout(function(value) {
	    			for (var i = 0; i < programeProducerPageConfig.dataArray.length; ++ i) {
	    				if (programeProducerPageConfig.dataArray[i].name == element.val()) {
	    					hiddenInputElement.val(programeProducerPageConfig.dataArray[i].id);
	    					break ;
	    				}
	    			}
	    		}, 300);
	    	});
    	}
    	this.multipleColumnResultAssociative(programeProducerPageConfig);
    	return programeProducerPageConfig;
	};	
	/**
	 * 有声读物名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.talkingbookFragmentTitleAssociative = function(elementId,hiddenInput) {
        var programeNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTalkingBookFragmentTitle.do?talkingBookId=' + (hiddenInput ?hiddenInput :-1),
        	elementId: elementId
        };
		this.singleColumnResultAssociative(programeNamePageConfig);
	};
	/**
	 *有声读物用户名联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.talkingbookFragmentCreateUserNameAssociative = function(elementId,hiddenInput) {
        var userNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchTalkingBookFragmentUserName.do?talkingBookId=' + (hiddenInput ?hiddenInput :-1),
        	elementId: elementId
        };
        this.singleColumnResultAssociative(userNamePageConfig);
	};
	/**
	 * 内容发送联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.contentSendAssociative = function(elementId) {
        var contentMessageTitlePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/contentSendMessageTitle.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(contentMessageTitlePageConfig);
	};
	/**
	 * 活动发送联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.activitySendAssociative = function(elementId) {
        var contentMessageTitlePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/activitySendMessageTitle.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(contentMessageTitlePageConfig);
	};
	/**
	 * 版本更新推送
	 * @param elementId	输入框id
	 */
	associativeQuery.versionUpdateSendAssociative = function(elementId) {
        var contentMessageTitlePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/versionUpdateSendMessageTitle.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(contentMessageTitlePageConfig);
	};
	/**
	 *内容推送节目名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.contentSendProgrameNameAssociative = function(elementId, hiddenInput,moduleId,tempProgrameId,tempModelId) {
    	var programeProducerPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/contentSendProgrameName.do?moduleId=' +moduleId,
        	elementId: elementId,
        	displayColumnName: 'programeName',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.programeId);
        		}
			}
        };
        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		for (var i = 0; i < programeProducerPageConfig.dataArray.length; ++ i) {
    				if (programeProducerPageConfig.dataArray[i].programeName == element.val()) {
    					hiddenInputElement.val(programeProducerPageConfig.dataArray[i].programeId);
    					if(moduleId==446){
    						$("#sendContentAudioName").val(programeProducerPageConfig.dataArray[i].programeName);
    						$("#audioName").val(programeProducerPageConfig.dataArray[i].programeId);
    					}
    					getSendContent(0);
    					if(!($("#" + tempProgrameId).val()==moduleId&&programeProducerPageConfig.dataArray[i].programeId==tempProgrameId)){
    						$("#" + tempProgrameId).val("0");
    					}
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultAssociative(programeProducerPageConfig);
    	return programeProducerPageConfig;
	};
	/**
	 *内容推送碎片名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.contentSendAudioNameAssociative = function(elementId, hiddenInput,moduleId,programeId) {
    	var contentAudioNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/contentSendAudioName.do?moduleId=' +moduleId+"&programeId="+programeId,
        	elementId: elementId,
        	displayColumnName: 'audioName',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.audioId);
        		}
			}
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		for (var i = 0; i < contentAudioNamePageConfig.dataArray.length; ++ i) {
    				if (contentAudioNamePageConfig.dataArray[i].audioName == element.val()) {
    					getSendContent(0);
    					hiddenInputElement.val(contentAudioNamePageConfig.dataArray[i].audioId);
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultAssociative(contentAudioNamePageConfig);
    	return contentAudioNamePageConfig;
	};
	/**
	 * 歌曲名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.musicNameAssociative = function(elementId) {
        var happyMusicNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/happyMusicName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(happyMusicNamePageConfig);
	};
	/**
	 * 专辑名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.belongAlbumNameAssociative = function(elementId) {
        var belongAlbumNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/belongAlbumName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(belongAlbumNamePageConfig);
	};
	/**
	 * 歌手艺名联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.compereNameAssociative = function(elementId) {
        var compereNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/singerName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(singerNamePageConfig);
	};
	/**
	 * 主题包名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.titlePackageNameAssociative = function(elementId) {
        var titlePackagePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/titlePackageName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(titlePackagePageConfig);
	};
	/**
	 * 频道名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.musicChannelNameAssociative = function(elementId) {
        var musicChannelConfig = {
        	url: ctx + '/controller/admin/associativeQuery/musicChannelName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(musicChannelConfig);
	};
	/**
	 * 频道ID联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.musicChannelIdAssociative = function(elementId) {
        var musicChannelIdConfig = {
        	url: ctx + '/controller/admin/associativeQuery/musicChannelId.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(musicChannelIdConfig);
	};
	/**
	 *频道管理clock选择联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.selectClockIdkAssociative = function(elementId, hiddenInput,dataCallBack) {
    	var selectClockIdConfig = {
        	url: ctx + '/clock/selectClockId.do',
        	elementId: elementId,
        	displayColumnName: 'clockName',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
        		
			},
			callBack: dataCallBack,
			inputColumnName:'clockName'
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		for (var i = 0; i < selectClockIdConfig.dataArray.length; ++ i) {
    				if (selectClockIdConfig.dataArray[i].id == hiddenInputElement.val()) {
    					hiddenInputElement.val(selectClockIdConfig.dataArray[i].id);
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultCallBackAssociative(selectClockIdConfig);
    	return selectClockIdConfig;
	};
	
	/**
	 * 规则名称 联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.matchMusicChannelRuleName = function(elementId) {
        var ruleNameConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchMusicChannelRuleName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(ruleNameConfig);
	};
	
	/**
	 * 规则ID联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.matchMusicChannelRuleId = function(elementId) {
        var ruleIdConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchMusicChannelRuleId.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(ruleIdConfig);
	};
	
	/**
	 * 规则组名称 联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.matchRuleGroupName = function(elementId) {
        var ruleGroupNameConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchRuleGroupName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(ruleGroupNameConfig);
	};
	
	/**
	 * 规则组ID联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.matchRuleGroupId = function(elementId) {
        var ruleGroupIdConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchRuleGroupId.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(ruleGroupIdConfig);
	};
	/**
	 * 播单选择歌曲名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.playListMusicNameAssociative = function(elementId) {
        var playListMusicNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/playListMusicName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(playListMusicNamePageConfig);
	};
	/**
	 * 信息源分类名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.infoSourceTypeNameAssociative = function(elementId) {
        var infoSourceTypePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/infoSourceTypeName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(infoSourceTypePageConfig);
	};

	/**
	 * Clock 名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.matchClockName = function(elementId) {
        var clockNameConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchClockName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(clockNameConfig);
	};

	/**
	 * Clock ID联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.matchClockId = function(elementId) {
        var clockIdConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchClockId.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(clockIdConfig);
	};

	/**
	 *匹配台宣类别
	 * @param elementId	输入框id
	 * @param declareType	台宣类别id
	 */
	associativeQuery.matchByDeclareType = function(elementId, declareType, myCBFn, obj, platformDeclareTdId) {
    	var declareTypeConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchByDeclareType.do?declareType=' + declareType,
        	elementId: elementId,
        	displayColumnName: 'declareName',
        	dataArray: true,
        	callbackFn: function(datas) {
        		var element = $('#' + elementId);
        		element.blur(function(value) {
        			var _this = $(this);
    	    		setTimeout(function(value) {
    	    			if ($.trim(_this.val()).length == 0) {
    	    				var td = _this.parent();
    	    				var tr = td.parent();
    	            		var nextTd = td.next();
    	            		nextTd.html(tr.attr('averageDuration'));

    	            		addPlatformDeclareTotalTimeLength(0 - parseInt(tr.attr('timeLength')));
    	            		addTotalTimeLength(0 - parseInt(tr.attr('timeLength')));

    	            		addPlatformDeclareTotalTimeLength(parseInt(tr.attr('avgTimeLength')));
    	            		addTotalTimeLength(parseInt(tr.attr('avgTimeLength')));

    	            		var style = getStyle(parseInt(tr.attr('avgTimeLength')));
    	            		tr.attr('style', style);
    	            		tr.attr('timeLength', parseInt(tr.attr('avgTimeLength')));

    	            		updateTimeInfoBar();
    	    			}
    	    		}, 20);
    	    	});
        		if (myCBFn) {
        			myCBFn(datas, obj, platformDeclareTdId);
        		}
        	},
        	resultFunction: function(event, data, formatted) {
        		var input = $('#' + elementId);
        		input.attr('hiddenValue', data.id);

        		var td = input.parent();
        		var nextTd = td.next();
        		nextTd.html(data.durationString);

        		var tr = td.parent();
        		addPlatformDeclareTotalTimeLength(0 - parseInt(tr.attr('timeLength')));
        		addTotalTimeLength(0 - parseInt(tr.attr('timeLength')));

        		addPlatformDeclareTotalTimeLength(parseInt(data.soundTime));
        		addTotalTimeLength(parseInt(data.soundTime));

        		var style = getStyle(parseInt(data.soundTime));
        		tr.attr('style', style);
        		tr.attr('timeLength', parseInt(data.soundTime));

        		updateTimeInfoBar();
			}
        };

    	this.multipleColumnResultAssociative(declareTypeConfig);
    	return declareTypeConfig;
	};

	/**
	 * 匹配乐库类别
	 * @param elementId	输入框id
	 * @param belongsHappyLibraryTdId	所属曲库trId
	 */
	associativeQuery.matchBelongsHappyLibrary = function(elementId, myCBFn, obj, belongsHappyLibraryTdId) {
    	var belongsHappyLibraryConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchBelongsHappyLibrary.do',
        	elementId: elementId,
        	displayColumnName: 'name',
        	dataArray: true,
        	callbackFn: function(datas) {
        		if (myCBFn) {
        			myCBFn(datas, obj, belongsHappyLibraryTdId);
        		}
        	},
        	resultFunction: function(event, data, formatted) {
        		$('#' + elementId).attr('hiddenValue', data.id);
        		setTimeout(function(value) {
        			var obj = getNodeIdAndNodeLevelByTdId(elementId);
        			var audioType = $($('#' + elementId).parent().next('td').find('input')).attr('hiddenValue');
        			ajaxTimeLengthInfoBelongsAndSoundType(elementId, obj.level, obj.typeId, data.id, audioType);
	    		}, 50);
			}
        };

    	this.multipleColumnResultAssociative(belongsHappyLibraryConfig);
    	return belongsHappyLibraryConfig;
	};

	/**
	 *匹配乐库音频类型
	 * @param elementId	输入框id
	 * @param happyLibrarySoundTypeTdId	音频类别trId
	 */
	associativeQuery.matchHappyLibrarySoundType = function(elementId, myCBFn, obj, happyLibrarySoundTypeTdId) {
    	var happyLibrarySoundTypeConfig = {
        	url: ctx + '/controller/admin/associativeQuery/matchHappyLibrarySoundType.do',
        	elementId: elementId,
        	displayColumnName: 'name',
        	dataArray: true,
        	callbackFn: function(datas) {
        		$('#' + this.elementId).val(datas[0].name);
        		this.resultFunction(null, datas[0], null);
        		if (myCBFn) {
        			myCBFn(datas, obj, happyLibrarySoundTypeTdId);
        		}
        	},
        	resultFunction: function(event, data, formatted) {
        		$('#' + elementId).attr('hiddenValue', data.id);
        		setTimeout(function(value) {
        			var obj = getNodeIdAndNodeLevelByTdId(elementId);
        			var belongs = $($('#' + elementId).parent().prev('td').find('input')).attr('hiddenValue');
        			ajaxTimeLengthInfoBelongsAndSoundType(elementId, obj.level, obj.typeId, belongs, data.id);
	    		}, 50);
			}
        };

    	this.multipleColumnResultAssociative(happyLibrarySoundTypeConfig);
    	return happyLibrarySoundTypeConfig;
	};
	
	/**
	 *频道节目名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.schemeChannelAssociative = function(elementId, hiddenInput,dataCallBack) {
    	var schemeChannelPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/selectChannelName.do',
        	elementId: elementId,
        	displayColumnName: 'name',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
			},
			callBack: dataCallBack,
			inputColumnName:'name'
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		for (var i = 0; i < schemeChannelPageConfig.dataArray.length; ++ i) {
    				if (schemeChannelPageConfig.dataArray[i].name == element.val()) {
    					hiddenInputElement.val(schemeChannelPageConfig.dataArray[i].id);
    					element.css("color","#393939");
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultCallBackAssociative(schemeChannelPageConfig);
    	return schemeChannelPageConfig;
	};
	/**
	 *音乐频道名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.musicChannelAssociative = function(elementId, hiddenInput,dataCallBack) {
    	var schemeChannelPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/selectMusicName.do',
        	elementId: elementId,
        	displayColumnName: 'channelName',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
			},
			callBack: dataCallBack,
			inputColumnName:'channelName'
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		for (var i = 0; i < schemeChannelPageConfig.dataArray.length; ++ i) {
    				if (schemeChannelPageConfig.dataArray[i].channelName == element.val()) {
    					hiddenInputElement.val(schemeChannelPageConfig.dataArray[i].id);
    					element.css("color","#393939");
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultCallBackAssociative(schemeChannelPageConfig);
    	return schemeChannelPageConfig;
	};
	/**
	 *主题包审核通过主题包名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.infoSourceTitlePackageAssociative = function(elementId, hiddenInput,dataCallBack) {
    	var inforSourcePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/infoSourceTitleName.do',
        	elementId: elementId,
        	displayColumnName: 'titleName',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
			},
			callBack: dataCallBack,
			inputColumnName:'titleName'
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		for (var i = 0; i < inforSourcePageConfig.dataArray.length; ++ i) {
    				if (inforSourcePageConfig.dataArray[i].titleName == element.val()) {
    					hiddenInputElement.val(inforSourcePageConfig.dataArray[i].id);
    					element.css("color","#393939");
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultCallBackAssociative(inforSourcePageConfig);
    	return inforSourcePageConfig;
	};
	/**
	 *节目、音乐、资讯名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.infoSourceprogrameNameAssociative = function(elementId, hiddenInput,optionType,dataCallBack) {
    	var inforSourcePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/infoSourceProgrameName.do',
        	elementId: elementId,
        	displayColumnName: 'programeName',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.programeId);
        		}
			},
			callBack: dataCallBack,
			inputColumnName:'programeName'
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	var tempI=hiddenInput.split("_");
	    	element.blur(function(value) {
	    		for (var i = 0; i < inforSourcePageConfig.dataArray.length; ++ i) {
    				if (inforSourcePageConfig.dataArray[i].programeName == element.val()) {
    					hiddenInputElement.val(inforSourcePageConfig.dataArray[i].programeId);
    					hiddenInputElement.next().val(inforSourcePageConfig.dataArray[i].moduleId);
    					//$("#selectAudioName_"+tempI).val("");
    					element.css("color","#393939");
    					if(optionType=="2"){
    						var tempN=tempI[1];
    						if(tempI.length==3){
    							tempN=tempI[1]+"_"+tempI[2];
    						}
    						getSelectAudioName(inforSourcePageConfig.dataArray[i].moduleId,inforSourcePageConfig.dataArray[i].programeId,tempN,1);
    					}
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultCallBackAssociative(inforSourcePageConfig);
    	return inforSourcePageConfig;
	};
	
	/**
	 *信息源推送碎片名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.infoSourceAudioNameAssociative = function(elementId, hiddenInput,moduleId,programeId,dataCallBack) {
    	var contentAudioNamePageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/contentSendAudioName.do?moduleId=' +moduleId+"&programeId="+programeId,
        	elementId: elementId,
        	displayColumnName: 'audioName',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.audioId);
        		}
			},
			callBack: dataCallBack,
			inputColumnName:'audioName'
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		for (var i = 0; i < contentAudioNamePageConfig.dataArray.length; ++ i) {
    				if (contentAudioNamePageConfig.dataArray[i].audioName == element.val()) {
    					hiddenInputElement.val(contentAudioNamePageConfig.dataArray[i].audioId);
    					hiddenInputElement.next().val(contentAudioNamePageConfig.dataArray[i].moduleId);
    					element.css("color","#393939");
//    					getSendContent(0);
//    					hiddenInputElement.val(contentAudioNamePageConfig.dataArray[i].audioId);
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultCallBackAssociative(contentAudioNamePageConfig);
    	return contentAudioNamePageConfig;
	};

	/**
	 * 升级产品管理 匹配 产品名称
	 * @param elementId	输入框id
	 */
	associativeQuery.matchUpgradeTargetName = function(elementId) {
        var config = {
        	url: ctx + '/controller/admin/associativeQuery/matchUpgradeTargetName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(config);
		return config;
	};
	/**
	 * 升级策略管理 匹配 APP名称
	 * @param elementId	输入框id
	 */
	associativeQuery.matchUpgradeStrategyAppName = function(elementId) {
        var config = {
        	url: ctx + '/controller/admin/associativeQuery/matchUpgradeStrategyAppName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(config);
		return config;
	};
	/**
	 * 直播流名称联想查询
	 * @param elementId	输入框id
	 */
	associativeQuery.liveTelecastFlowNameAssociative = function(elementId) {
        var liveTelecastFlowPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/liveTelecastFlowName.do',
        	elementId: elementId
        };
		this.singleColumnResultAssociative(liveTelecastFlowPageConfig);
	};
	/**
	 *直播流通道码联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.liveTelecastFlowAssociative = function(elementId, hiddenInput,dataCallBack) {
    	var liveTelecastFlowPageConfig = {
        	url: ctx + '/controller/admin/associativeQuery/liveTelecastFlowCheckPass.do',
        	elementId: elementId,
        	displayColumnName: 'passCode',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
			},
			callBack: dataCallBack,
			inputColumnName:'passCode'
        };

        if (hiddenInput != null && hiddenInput != undefined) {
	    	var element = $("#" + elementId);
	    	var hiddenInputElement = $('#' + hiddenInput);
	    	element.blur(function(value) {
	    		for (var i = 0; i < liveTelecastFlowPageConfig.dataArray.length; ++ i) {
    				if (liveTelecastFlowPageConfig.dataArray[i].passCode == element.val()) {
    					hiddenInputElement.val(liveTelecastFlowPageConfig.dataArray[i].id);
    					element.css("color","#393939");
    					break ;
    				}
    			}
	    	});
    	}
    	this.multipleColumnResultCallBackAssociative(liveTelecastFlowPageConfig);
    	return liveTelecastFlowPageConfig;
	};
	
	
	/**
	 * 后台返回多列时使用该方法有回掉方法
	 * pageConfig中包含以下配置项：
	 * @param url				地址						必传
	 * @param elementId			输入框id					必传
	 * @param displayColumnName	要显示出那列的id			必传
	 * @param resultFunction	每次点击一条时的回调函数		
	 * @param dataArray			是否需要缓存的数据，用户数据校验时使用		
	 * @param callBack			回调函数	
	 * @param config			配置项
	 */
	associativeQuery.backMultipleColumnResultValue=function(pageConfig, associativeConfig) {
		var baseMultipleColumnConfig = $.extend(false, this.baseConfig, {
			formatItem: function(item, i, max) { //debugger ;
				return i + "/" + max + ":　　" + (item[pageConfig.displayColumnName] ?item[pageConfig.displayColumnName] :'');
            },
            formatResult:function(item) {
            	return item[pageConfig.inputColumnName];
            },
            formatMatch: function(item, i, max) {
            	return item[pageConfig.displayColumnName] ?item[pageConfig.displayColumnName] :'';
			}
		});
		var element = $("#" + pageConfig.elementId);
		var data=pageConfig.dataArray;
			if(pageConfig.callBack) {
				pageConfig.callBack(pageConfig.elementId, data);
			}
			element.autocomplete(data, $.extend(false, baseMultipleColumnConfig, associativeConfig || {}));
			if (pageConfig.callbackFn) {
				pageConfig.callbackFn(data);
			}
		
		if (pageConfig.resultFunction) {
			element.result(pageConfig.resultFunction);
		}
	};
	
	
	/**
	 *专辑名称联想查询
	 * @param elementId	输入框id
	 * @param hiddenInput	隐藏域id
	 */
		associativeQuery.getAlbumInfo = function(elementId, hiddenInput,dataCallBack) {
    	var albumInfoPageConfig = {
        	url: ctx + '/clock/addAlbum.do',
        	elementId: elementId,
        	displayColumnName: 'name',
        	dataArray: true,
        	resultFunction: function(event, data, formatted) { 
        		if (hiddenInput != null && hiddenInput != undefined) {
        			$("#" + hiddenInput).val(data.id);
        		}
			},
			callBack: dataCallBack,
			inputColumnName:'name'
        };
    	blindBlur(elementId,hiddenInput,albumInfoPageConfig);
    	this.multipleColumnResultCallBackAssociative(albumInfoPageConfig);
    	return albumInfoPageConfig;
	};
	exports.associativeQuery = associativeQuery;
})(jQuery, window, window.ctx || window.parent.ctx);