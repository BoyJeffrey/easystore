(function($){
	var cms=window.cms=window.cms||{

	};
	var seller=cms.seller={};

	var service=cms.service={};

	var render=cms.render={};

	seller.roomWrap=function(){
		$('#roomBtn').on('click',function(){
			$('#seeRoom').show();
		})

		$('#seeRoom .cls').on('click',function(){
			$('#seeRoom').hide();
		})
	}

	cms.seller.roomWrap();

	seller.roomShow=function(){
		$('.room').die().live('click',function(){
			var roomPK=$(this).parent().attr('roompk');
			cms.service.getRoomDetail(roomPK).done(function(data){
				console.log(data);
				render.renderRoomDetail(data['result']);
				cms.service.roomImgFile($('#addRoom').attr('roompk'));
			})
			$('#roomDetails').show();

			$('#buttons input').show();
			$('#buttons input').eq(3).hide();
		})
		
		$('#closeroomDetailsBg').on('click',function(){
			$('#roomDetails').hide();
		})

		$('#addRoomBtn').on('click',function(e){
			$('#roomDetails').show();
			$('#roomDetails .input-text').val('');
			$('#roomFacility input').attr('checked',false);
			$('#buttons input').hide();
			$('#buttons input').eq(3).show();
		})

		$('#customWrapBtn').on('click',function(){
			$('#customWrap').show();
			cms.render.customPrice(parseInt($('#addRoom').attr('roompk')));
			$('#roomDetails').hide();
		})

		$('#closeCustom').on('click',function(){
			$('#customWrap').hide();
			$('#roomDetails').show();
		})
	}

	cms.seller.roomShow();

	seller.contractShow=function(){
		$('#contractBtn').on('click',function(){
			$('#contractDetail').show()
			cms.service.getContract().done(function(data){
				console.log(data)
				if(data['code']=='200'){
					cms.render.contract(data['result']);
				}
				var i=0;
				$('.line input').each(function(i,list){
					if($('.line input').eq(i).val()){
						i++
						console.log(i);
					}else{
						i--
						console.log(i);
					}
					if(i>=0){
						$('#addContract').hide();
						$('#changeContract').show();
						$('#removeContract').show();
						return false
					}else{
						// console.log(1)
						$('#addContract').show();
						$('#changeContract').hide();
						$('#removeContract').hide();
						return false
					}
					
				})
			})

		})

		$('#closeContract').on('click',function(){
			$('#contractDetail').hide()
		})
	}

	cms.seller.contractShow();

	seller.maskShow=function(){
		$(window).on('scroll',function(){
            var scrollTop = $(window).scrollTop();
            if(scrollTop>50){
                $('.finsihed-butt').show();
                $('.topFixeBg').show();
            }else if(scrollTop<50){
                $('.finsihed-butt').hide();
                $('.topFixeBg').hide();
            }
        })
	}
	cms.seller.maskShow()

	seller.roomFlag=function(btn,flag){
		$(btn).on('click',function(){
			var FacilityArr=[];
			var roomFacilityInput=$("#roomFacility input:checked").each(function(){
				FacilityArr.push($(this).val());
			});
			var roomFacility=FacilityArr.join('-');
			
			if(flag==1){
				var submitData={
					sellerId:parseInt(sellerId),
					roomName:$('#roomName').val(),
					roomPrice:parseFloat($('#roomPrice').val()),
					weekendPrice:parseFloat($('#weekendPrice').val()),
					festivalPrice:parseFloat($('#festivalPrice').val()),
					jybbPrice:parseFloat($('#jybbPrice').val()),
					jybbWeekendPrice:parseFloat($('#jybbWeekendPrice').val()),
					jybbFestivalPrice:parseFloat($('#jybbFestivalPrice').val()),
					roomSize:parseInt($('#roomSize').val()),
					doubleBedCount:parseInt($('#doubleBedCount').val()),
					singleBedCount:parseInt($('#singleBedCount').val()),
					roomFacility:roomFacility,
					introduction:$('#introduction').val(),
					bedType:parseInt($('#bedType').val()),
					roomNum:parseInt($('#roomNum').val()),
					holdNum:parseInt($('#holdNum').val()),
					proxyRebate:parseFloat($('#proxyRebate').val()),
					memo:$('#memo').val(),
					payType:$('#payType').val()
				};
				//console.log(submitData);
				cms.service.addRoom(JSON.stringify(submitData)).done(function(data){
					console.log(data);
					alert(data['msg']);
					if(data['code']=='200'){
						$('#closeroomDetailsBg').trigger('click');
						cms.service.getRoomList().done(function(data){
							render.renderRoomList(data);
						})
					}
				}).fail(function(){
					alert('失败');
				});
			}else if(flag=2){
				var submitData={
					roomPk:$('#addRoom').attr('roomPK'),
					sellerId:parseInt(sellerId),
					roomName:$('#roomName').val(),
					roomPrice:parseFloat($('#roomPrice').val()),
					weekendPrice:parseFloat($('#weekendPrice').val()),
					festivalPrice:parseFloat($('#festivalPrice').val()),
					jybbPrice:parseFloat($('#jybbPrice').val()),
					jybbWeekendPrice:parseFloat($('#jybbWeekendPrice').val()),
					jybbFestivalPrice:parseFloat($('#jybbFestivalPrice').val()),
					roomSize:parseInt($('#roomSize').val()),
					doubleBedCount:parseInt($('#doubleBedCount').val()),
					singleBedCount:parseInt($('#singleBedCount').val()),
					roomFacility:roomFacility,
					introduction:$('#introduction').val(),
					bedType:parseInt($('#bedType').val()),
					roomNum:parseInt($('#roomNum').val()),
					holdNum:parseInt($('#holdNum').val()),
					proxyRebate:parseFloat($('#proxyRebate').val()),
					memo:$('#memo').val(),
					payType:$('#payType').val()
				};
				cms.service.changeRoom(JSON.stringify(submitData)).done(function(data){
					alert(data['msg']);
					if(data['code']=='200'){
						
						cms.service.getRoomList().done(function(data){
							render.renderRoomList(data);
						})
					}
				}).fail(function(){
					alert('失败');
				});
			}
		})
	}




	cms.seller.roomFlag('#submitAddRoomBtn',1);
	cms.seller.roomFlag('#submitChangeRoomBtn',2);


	service.addRoom=function(submitData){
		return $.ajax({
			url:'/cms/seller/room/add.ojson',
			type:"POST",
			dataType: "json",
			data:submitData
		})
	}



	seller.removeRoomBtn=function(btn){
		$(btn).die().live('click',function(){
			var roompk={
				roomPk:[parseInt($(this).parent().attr('roomPK'))]
			}
			console.log(JSON.stringify(roompk))
			cms.service.removeRoom(JSON.stringify(roompk)).done(function(data){
				console.log(data);
				alert(data['msg']);
				if(data['code']=='200'){
					
					cms.service.getRoomList().done(function(data){
						render.renderRoomList(data);
					})
				}
			}).fail(function(){
				alert('失败');
			});
		})
	}

	cms.seller.removeRoomBtn('.removeRoom');


	

	

	service.changeRoom=function(submitData){
		return $.ajax({
			url:'/cms/seller/room/update.ojson',
			type:"POST",
			dataType: "json",
			data:submitData
		})
	}

	service.removeRoom=function(submitData){
		return $.ajax({
			url:'/cms/seller/room/delete.ojson',
			type:"POST",
			dataType: "json",
			data:submitData
		})
	}

	service.getRoomList=function(){
		return $.ajax({
			url:'/cms/seller/room/list.ojson',
			type:"GET",
			dataType: "json",
			data:{
				sellerId:sellerId
			}
		})
	}

	service.getRoomDetail=function(submitData){
		return $.ajax({
			url:'/cms/seller/room/get.ojson',
			type:"GET",
			dataType: "json",
			data:{
				roomPk:submitData
			}
		})
	}

	cms.service.getRoomList().done(function(data){
		render.renderRoomList(data);
	})

	


	render.renderRoomList=function(data){
		var roomListWrap=$('#yroomListWrap');
		roomListWrap.empty();
		$.each(data['result']['data'],function(i,list){
			var p=$('<p class="room"></p>').html(list['roomName']);
			var span=$('<span class="removeRoom">X</span>');
			var li=$('<li roomPK="'+list["roomPk"]+'" roomPrice="'+list["roomPrice"]+'" festivalPrice="'+list["festivalPrice"]+'"></li>');
			li.append(p);
			li.append(span);
			roomListWrap.append(li);
		})

	}

	render.renderRoomDetail=function(data){
		$('#addRoom').attr('roomPk',data['roomPk']);
		$('#bedType').val(data['bedType']);
		$('#doubleBedCount').val(data['doubleBedCount']);
		$('#festivalPric').val(data['festivalPric']);
		$('#holdNum').val(data['holdNum']);
		$('#introduction').val(data['introduction']);
		$('#jybbFestivalPrice').val(data['jybbFestivalPrice']);

		$('#singleBedCount').val(data['singleBedCount']);

		$('#jybbPrice').val(data['jybbPrice']);
		$('#jybbWeekendPrice').val(data['jybbWeekendPrice']);

		$('#memo').val(data['memo']);
		$('#payType').val(data['payType']);

		$('#roomName').val(data['roomName']);
		$('#roomNum').val(data['roomNum']);
		$('#roomPk').val(data['roomPk']);
		$('#roomPrice').val(data['roomPrice']);
		$('#roomSize').val(data['roomSize']);
		$('#weekendPrice').val(data['weekendPrice']);
		$('#festivalPrice').val(data['festivalPrice']);

		$('#proxyRebate').val(data['proxyRebate']);
		if(data['tagDtoList']){
			$.each(data['tagDtoList'],function(i,list){
				$('#roomFacility input').each(function(i,lists){
					if(parseInt($('#roomFacility input').eq(i).val())===list['id']){
						$(this).attr('checked',true).prop("checked",true);
					}
				})
			})
		}
		
	}


	render.customPrice=function(data){
        return $.ajax({
            url:'/cms/seller/room/customprice/list.ojson?roomPk='+data+'', // FIXME: test data
			type:"GET",
			dataType: "json",
            success:function(resp) {
            	console.log(resp);
                var ulEle = $("#customPriceList > ul");
                ulEle.empty();
                var html = '';
                $.each(resp.result.data, function(i,item){
                    html += '<li>';
                    html += '开始时间：<input type="text" value="' + $.myTime.UnixToDate(item.startDate / 1000) + '" class="startDate"/>';
                    html += '结束时间：<input type="text" value="' + $.myTime.UnixToDate(item.endDate / 1000) + '" class="endDate"/>';
                    html += '价格：<input type="text" value="' + item.roomPrice + '" class="customPrice"/>';
                    html += '<input type="button" class="changeCustomPrice" value="更改" roompricepk=' + item.id + ' />'
                    html += '<input type="button" class="removeCustomPrice" value="删除" roompricepk=' + item.id + ' />'
                    html += '</li>';
                });
                ulEle.append(html);
            }
		})
	}


	// add custom price
	seller.submitCustomPrice=function(btn){
		$('#customPriceBtn').on('click',function(){
			var submitData={
                roomPk:parseInt($('#addRoom').attr('roompk')),//FIXME: test data
				roomPrice:parseFloat($('#addCustomPrice').val()),
				startDate:$('#addStartDate').val(),
				endDate:$('#addEndDate').val()
			}
			service.addCustomPrice(submitData).done(function(data){
				console.log(data);

                render.customPrice(parseInt($('#addRoom').attr('roompk')));
			})

		})
	}
	seller.submitCustomPrice();
	service.addCustomPrice=function(submitData){
		return $.ajax({
			url:'/cms/seller/room/customprice/add.ojson',
			type:"POST",
			dataType: "json",
			data:JSON.stringify(submitData)
		})
	}

    // update custom price

	// update custom price
	seller.changeCustomPriceBtn=function(){
		$('.changeCustomPrice').die().live('click',function(){
			var submitData={
				roomPricePk:$(this).attr('roompricepk'),
				roomPrice:parseFloat($(this).parent().find('.customPrice').val()),
				startDate:$(this).parent().find('.startDate').val(),
				endDate:$(this).parent().find('.endDate').val()
			}
			service.changeCustomPrice(submitData).done(function(data){  
				alert(data['msg']);
                if(data['code']=='200'){
					
					render.customPrice(parseInt($('#addRoom').attr('roompk')));
				}

			})

		})
	}
	seller.changeCustomPriceBtn();
	service.changeCustomPrice=function(submitData){
		return $.ajax({
			url:'/cms/seller/room/customprice/update.ojson',
			type:"POST",
			dataType: "json",
			data:JSON.stringify(submitData)
		})
	}

	// delete custom price
	seller.removeCustomPriceBtn=function(){
		$('.removeCustomPrice').die().live('click',function(){
            var roomPricePks = [];
            roomPricePks[0] = $(this).attr('roompricepk');
			var submitData={
                roomPricePk:roomPricePks
			}
			service.removeCustomPrice(submitData).done(function(data){
				alert(data['msg']);
				if(data['code']=='200'){
					
					render.customPrice(parseInt($('#addRoom').attr('roompk')));
				}
			})
		})
	}
	seller.removeCustomPriceBtn();
	service.removeCustomPrice=function(submitData){
		return $.ajax({
			url:'/cms/seller/room/customprice/delete.ojson',
			type:"POST",
			dataType: "json",
			data:JSON.stringify(submitData)
		})
	}





	service.roomImgFile=function(aaaaa){
  		var strategyFile = $("#buttons");
  		var uploadButton = $("#fileImg");
		var viewListButton = $("#seeImg");
	
		viewListButton.on("click",function(e){

			$.ajax({
			 	url : cms.baseUrl+"/jybb-upload/image/list.json?belongId="+parseInt($('#addRoom').attr('roompk'))+"&imageCatalog=f9",
			   	type : "GET" ,
			    dataType: "json" ,
			    success:function(data){
			    	var images = null ;
			    	if("200" === data["code"]){
			    		images = data["result"] ;
			    		cms.util.cmsBox(images,"photo_list",{title:"游记的图片"},true) ;		
			    	}
			    } ,
		        error:function(){
		        	alert("图片列表获取失败!") ;
		        }
	 		}) ;
			e.preventDefault() ;
		}) ;
		
		var uiCon = $("<div class='ui-con'></div>").appendTo(strategyFile) ;
		var iconWrap = $("<div class='icon-wrap'></div>").appendTo(uiCon) ;
		var iconRoot = $("#upload-wrap") ;
		
		var doUploadButt = iconRoot.find(".upload-butt") ;
		
		iconRoot.find(".cls").on("click",function(){
			$(this).parent().fadeOut();
		}) ;
		
  		var roomImageUploader = new plupload.Uploader({
		    browse_button: "fileImg" ,
		    url: cms.baseUrl +  "/jybb-upload/image/upload.do?belongId="+aaaaa+"&imageCatalog=f9" 
		}) ;
  		
  		roomImageUploader.init() ;
		
  		
  		roomImageUploader.bind('FilesAdded', function(up, files){
			iconRoot.find("ul").empty() ;
			doUploadButt.show() ;
			iconRoot.show("slow") ;
			iconRoot.find(".text").text(uploadButton.text()) ;
			iconWrap.hide() ;
		    plupload.each(files, function(file) {
		        var li = $("<li></li>").attr("id",file.id).text(file.name + ' ' + plupload.formatSize(file.size)).appendTo(iconRoot.find("ul")) ;
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

  		roomImageUploader.bind('UploadProgress', function(up, file) {
            $('#' + file.id + ' > span').text(file.percent);
		});
  		
  		roomImageUploader.bind('FileUploaded', function(up, file,result) {
  			
  			var fileId = eval(result.response)[0]
  			$.ajax({
			 	url :  cms.baseUrl+"/jybb-upload/image/getImgById.json?imageId=" +fileId ,
			   	type : "GET" ,
			    dataType: "json" ,
			    success:function(data){
			    } ,
		        error:function(){
		        	alert("upload file fail") ;
		        }
	 		}) ;
  		
  		});

        roomImageUploader.bind('UploadComplete', function() {
            iconRoot.hide() ;
            alert('update room image done!');
        });
  		
  		roomImageUploader.bind('Error', function(up,err) {
		    alert("文件上传发生错误，请重试!") ;
		});
  		
  		uploadButton.on("click",function(){
			
			doUploadButt.on("click",function(){
				
				roomImageUploader.start() ;
				$(this).unbind("click") ;
			}) ;
		
		}) ;
		
	} ;

	

	//alert($.myTime.UnixToDate(1325347200));
	//得到合同
	service.getContract=function(){
		return $.ajax({
			url:'/cms/seller/agreement/get.ojson',
			type:"GET",
			dataType: "json", 
			data:{
				sellerId:sellerId
			}
		})
	}
	

	render.contract=function(data){
		console.log(data);
		if(data){
			$('#fpOfficerName').val(data['fpOfficerName']);
			$('#fpOfficerMobile').val(data['fpOfficerMobile']);

			$('#fpOfficerEmail').val(data['fpOfficerEmail']);
			$('#fpCompanyPhone').val(data['fpCompanyPhone']);
			$('#fpCompanyFax').val(data['fpCompanyFax']);
			$('#fpSignDate').val($.myTime.UnixToDate(data['fpSignDate']/1000));

			$('#spOfficerName').val(data['spOfficerName']);
			$('#spOfficerEmail').val(data['spOfficerEmail']);
			$('#spOfficerMobile').val(data['spOfficerMobile']);
			$('#spOfficerPhone').val(data['spOfficerPhone']);
			$('#spCompanyName').val(data['spCompanyName']);

			$('#spCompanyAddress').val(data['spCompanyAddress']);
			$('#spBankCardOwnerName').val(data['spBankCardOwnerName']);
			$('#spBankCardNumber').val(data['spBankCardNumber']);
			$('#spBankFullName').val(data['spBankFullName']);

			$('#spCompanyPhone').val(data['spCompanyPhone']);
			$('#spCompanyFax').val(data['spCompanyFax']);
			$('#spSignDate').val($.myTime.UnixToDate(data['spSignDate']/1000));
			$('#validBeginDate').val($.myTime.UnixToDate(data['validBeginDate']/1000));
			$('#validEndDate').val($.myTime.UnixToDate(data['validEndDate']/1000));
			$('#checkDay').val(data['checkDay']);
			$('#contractC').attr('sellerAgreementId',data['id']);
			$('.line2').remove();
			$.each(data['agreementRoomPrices'],function(i,list){

				var line=$('<div class="line2" roomPK="'+list['roomPk']+'"></div>');

				var roomPrice=$('<p></p>');
				var roomPriceStrong=$('<strong></strong>').text('房间平日价格：');
				var roomPriceInput=$('<input type="text" class="yroomPrice"/>').val(list['jybbPrice']);
				roomPrice.append(roomPriceStrong);
				roomPrice.append(roomPriceInput);

				var festivalPrice=$('<p></p>');
				var festivalPriceStrong=$('<strong></strong>').text('房间节日价格：');
				var festivalPriceInput=$('<input type="text" class="yfestivalPrice"/>').val(list['jybbFestivalPrice']);
				festivalPrice.append(festivalPriceStrong);
				festivalPrice.append(festivalPriceInput);

				var roomName=$('<p></p>');
				var roomNameStrong=$('<strong></strong>').text('房间名：');
				var roomNameInput=$('<input type="text" class="yroomName"/>').val(list['roomName']);
				roomName.append(roomNameStrong);
				roomName.append(roomNameInput);

				var holdNum=$('<p></p>');
				var holdNumStrong=$('<strong></strong>').text('房间预留数：');
				var holdNumInput=$('<input type="text" class="yholdNum"/>').val(list['holdNum']);
				holdNum.append(holdNumStrong);
				holdNum.append(holdNumInput);

				var roomSize=$('<p></p>');
				var roomSizeStrong=$('<strong></strong>').text('房间面积：');
				var roomSizeInput=$('<input type="text" class="yroomSize"/>').val(list['roomSize']);
				roomSize.append(roomSizeStrong);
				roomSize.append(roomSizeInput);

				var memo=$('<p></p>');
				var memoStrong=$('<strong></strong>').text('备注：');
				var memoInput=$('<input type="text" class="ymemo"/>').val(list['memo']);
				memo.append(memoStrong);
				memo.append(memoInput);

				var proxyRebate=$('<p></p>');
				var proxyRebateStrong=$('<strong></strong>').text('代理折扣点:');
				var proxyRebateInput=$('<input type="text" class="yproxyRebate"/>').val(list['proxyRebate']);
				proxyRebate.append(proxyRebateStrong);
				proxyRebate.append(proxyRebateInput);

				line.append(roomName);
				line.append(roomPrice);
				line.append(festivalPrice);

				line.append(holdNum);
				line.append(roomSize);
				line.append(memo);
				line.append(proxyRebate);

				$('#contractButtons').before(line);
			})
		}
		
	}
	//添加合同&更改合同
	seller.addContractBtn=function(btn,flag){
		$(btn).on('click',function(){
			if(flag){
				var data={
					sellerId:sellerId,
					fpOfficerName:$('#fpOfficerName').val(),
					fpOfficerMobile:$('#fpOfficerMobile').val(),
					fpOfficerEmail:$('#fpOfficerEmail').val(),
					fpCompanyPhone:$('#fpCompanyPhone').val(),
					fpCompanyFax:$('#fpCompanyFax').val(),
					fpSignDate:$('#fpSignDate').val(),
					spOfficerName:$('#spOfficerName').val(),
					spOfficerEmail:$('#spOfficerEmail').val(),
					spOfficerMobile:$('#spOfficerMobile').val(),
					spOfficerPhone:$('#spOfficerPhone').val(),
					spCompanyName:$('#spCompanyName').val(),
					spCompanyAddress:$('#spCompanyAddress').val(),
					spBankCardOwnerName:$('#spBankCardOwnerName').val(),
					spBankCardNumber:$('#spBankCardNumber').val(),
					spBankFullName:$('#spBankFullName').val(),
					spCompanyPhone:$('#spCompanyPhone').val(),
					spCompanyFax:$('#spCompanyFax').val(),
					spSignDate:$('#spSignDate').val(),
					validBeginDate:$('#validBeginDate').val(),
					validEndDate:$('#validEndDate').val(),
					checkDay:parseInt($('#checkDay').val()),
					roomPrices:[]
				}
				//festivalPrice:$('#festivalPrice').val()
			    $('.line2').each(function(i,list){
			    	data.roomPrices.push({
			    		roomPk:parseInt($(this).attr("roompk")),
			    		jybbPrice:parseFloat($(this).find('.yroomPrice').val()),
			    		jybbFestivalPrice:parseFloat($(this).find('.yfestivalPrice').val()),
			    		roomName:$(this).find('.yroomName').val(),
			    		holdNum:parseInt($(this).find('.yholdNum').val()),
			    		roomSize:parseInt($(this).find('.yroomSize').val()),
			    		proxyRebate:parseFloat($(this).find('.yproxyRebate').val()),
			    		memo:$(this).find('.ymemo').val()
			    	});
			    })

				cms.service.addContract(JSON.stringify(data)).done(function(data){
					console.log(data);
					alert(data['msg']);
					if(data['code']=='200'){
						cms.service.getContract().done(function(data){
							if(data['code']=='200'){
								cms.render.contract(data['result']);
							}
						})
						
						var i=0;
						$('.line input').each(function(i,list){
							if($('.line input').eq(i).val()){
								i++
								console.log(i);
							}else{
								i--
								console.log(i);
							}
							if(i>=0){
								$('#addContract').hide();
								$('#changeContract').show();
								$('#removeContract').show();
								return false
							}else{
								// console.log(1)
								$('#addContract').show();
								$('#changeContract').hide();
								$('#removeContract').hide();
								return false
							}
							
						})

					}
				});
			}else{
				var data={
					sellerAgreementId:parseInt($('#contractC').attr('sellerAgreementId')),
					fpOfficerName:$('#fpOfficerName').val(),
					fpOfficerMobile:$('#fpOfficerMobile').val(),
					fpOfficerEmail:$('#fpOfficerEmail').val(),
					fpCompanyPhone:$('#fpCompanyPhone').val(),
					fpCompanyFax:$('#fpCompanyFax').val(),
					fpSignDate:$('#fpSignDate').val(),
					spOfficerName:$('#spOfficerName').val(),
					spOfficerEmail:$('#spOfficerEmail').val(),
					spOfficerMobile:$('#spOfficerMobile').val(),
					spOfficerPhone:$('#spOfficerPhone').val(),
					spCompanyName:$('#spCompanyName').val(),
					spCompanyAddress:$('#spCompanyAddress').val(),
					spBankCardOwnerName:$('#spBankCardOwnerName').val(),
					spBankCardNumber:$('#spBankCardNumber').val(),
					spBankFullName:$('#spBankFullName').val(),
					spCompanyPhone:$('#spCompanyPhone').val(),
					spCompanyFax:$('#spCompanyFax').val(),
					spSignDate:$('#spSignDate').val(),
					validBeginDate:$('#validBeginDate').val(),
					validEndDate:$('#validEndDate').val(),
					checkDay:parseInt($('#checkDay').val()),
					roomPrices:[]
				}
				//festivalPrice:$('#festivalPrice').val()
			    $('.line2').each(function(i,list){
			    	data.roomPrices.push({
			    		roomPk:parseInt($(this).attr("roompk")),
			    		jybbPrice:parseFloat($(this).find('.yroomPrice').val()),
			    		jybbFestivalPrice:parseFloat($(this).find('.yfestivalPrice').val()),
			    		roomName:$(this).find('.yroomName').val(),
			    		holdNum:parseInt($(this).find('.yholdNum').val()),
			    		roomSize:parseInt($(this).find('.yroomSize').val()),
			    		proxyRebate:parseFloat($(this).find('.yproxyRebate').val()),
			    		memo:$(this).find('.ymemo').val()
			    	});
			    })

				cms.service.changeContract(JSON.stringify(data)).done(function(data){
					console.log(data);
					alert(data['msg']);
					if(data['code']=='200'){
						cms.service.getContract().done(function(data){
							if(data['code']=='200'){
								cms.render.contract(data['result']);
							}
						})
						
					}
				});
			}
		})
	}

	cms.seller.addContractBtn('#addContract',true);
	cms.seller.addContractBtn('#changeContract',false);

	service.addContract=function(submitData){
		return $.ajax({
			url:'/cms/seller/agreement/add.ojson',
			type:"POST",
			dataType: "json",
			data:submitData
		})
	}

	service.changeContract=function(submitData){
		return $.ajax({
			url:'/cms/seller/agreement/update.ojson',
			type:"POST",
			dataType: "json",
			data:submitData
		})
	}
	//删除合同
	seller.removeContractBtn=function(){
		$('#removeContract').on('click',function(){
			var submitData={
                sellerArgeementIds:[parseInt($('#contractC').attr('selleragreementid'))]
			}
			service.removeContract(submitData).done(function(data){
				console.log(data);
				alert(data['msg']);
				if(data['code']=='200'){
					
					$('.line input').val('');
					$('.line2').remove();
					$('#addContract').show();
				}
			})
		})
	}
	seller.removeContractBtn();
	service.removeContract=function(submitData){
		return $.ajax({
			url:'/cms/seller/agreement/delete.ojson',
			type:"POST",
			dataType: "json",
			data:JSON.stringify(submitData)
		})
	}


})(jQuery)
	
