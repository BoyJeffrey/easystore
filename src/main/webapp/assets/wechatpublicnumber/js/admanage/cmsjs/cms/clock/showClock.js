var clockType=0;//分类
var album=1;//专辑
var declearType=2;//台宣
var clockTypeName="分类";//分类
var albumName="专辑";//专辑
var declearName="台宣";//台宣
var clockConfig="";
var parame="";
var selectInput="";
function getRightRule() {
	var selectItems = $("#right-pane").find("li");
	selectItems.each(function(index, li) {
		var gd = {
			tbType : $(li).find("input:hidden").eq(0).val(),
			ruleId : $(li).find("input:checkbox").val(),
			arrageRuleId : $(li).find("input:hidden").eq(1).val()
		};
		jsongd.ruleArrary.push(gd);
	});
}
// 上移
function UpLi(obj) {
	var onthis = $(obj).parent().parent();
	var getup = $(obj).parent().parent().prev();
	$(getup).before(onthis);
}
// 下移
function DownLi(obj) {
	var onthis = $(obj).parent().parent();
	var getdown = $(obj).parent().parent().next();
	$(getdown).after(onthis);
}
function dragRule() {
	console.log(11);
	$("#gridtbody").dragsort({ itemSelector:'tr', dragSelector: 'tr', dragBetween: true,dragEnd: saveOrder1, placeHolderTemplate: '<tr></tr>' }); 
	$("#gridtbody").find(".tdWidth").css("width","170px");
    function saveOrder1() {  
    	$("#gridtbody").find('tr').css('position', 'inherit');
       var data = $("#gridtbody").map(function() {return $(this).children().html(); }).get();
       updateTableIndex();
	};
}

function saveOrder() {
	var data = $("#top-region li,#bot-region li").map(function() {
		return $(this).children().html();
	}).get();
	$("input[name=list1SortOrder]").val(data.join("|"));
}
// ////////////////////////////////////////////////////////////////////////////////////////
var tableLineIndex = 0, contentLineIndex = 0, platformDeclareLineIndex = 0,tableTrIndex = 0, currentTimeLength = 0;
var addTableLineIndex = function(v) {
	tableLineIndex = tableLineIndex + v;
	return tableLineIndex;
}
var addTableTrIndex = function(v) {
	tableTrIndex = tableTrIndex + v;
	return tableTrIndex;
}
var addTypeAlbumLineIndex = function(v) {
	contentLineIndex = contentLineIndex + v;
	return contentLineIndex;
}
var platformDeclareIndex = function(v) {
	platformDeclareLineIndex = platformDeclareLineIndex + v;
	return platformDeclareLineIndex;
}
var tableLineBuffer = {};
containKeyInTableLineBuffer = function(k) {
	var v = getFromTableLineBuffer(k);
	return v != undefined && v != null
};
getFromTableLineBuffer = function(k) {
	return tableLineBuffer[k];
};
addToTableLineBuffer = function(k) {
	tableLineBuffer[k] = k;
};
removeFromTableLineBuffer = function(k) {
	tableLineBuffer[k] = undefined;
};
var totalTimeLength = 0, typeAlbumAllTimeLength = 0, plateformDeclareAllTimeLength = 0;
var getTotalTimeLength = function() {
	return totalTimeLength;
}
var addTotalTimeLength = function(v) {
	totalTimeLength += v;
}
var addTypeAlbumAllTimeLength = function(v) {
	typeAlbumAllTimeLength += v;
}
var addPlateformDeclareAllTimeLength = function(v) {
	plateformDeclareAllTimeLength += v;
}
var addCurrentTimeLength = function(v) {
	currentTimeLength += v;
}
//时间转换方法
var formatDuring = function(mss) {
	var minutes = parseInt(mss / (1000 * 60));
	var seconds = parseInt((mss % (1000 * 60)) / 1000);

	var result = '';

	result = result + (minutes >= 10 ? minutes : '0' + minutes) + ":";
	result = result + (seconds >= 10 ? seconds : '0' + seconds);

	return result;
}
function updateTimeInfoBar() {
	$('#totalTimeLengthSpan').html(formatDuring(totalTimeLength));
	$('#typeAlbumAllTimeLengthSpan').html(
			formatDuring(typeAlbumAllTimeLength));
	$('#plateformDeclareAllTimeLengthSpan').html(
			formatDuring(plateformDeclareAllTimeLength));
}
//表格行时间更改时变动
function changeTimeBuffer(tbType, timeLength) {
	var length = parseInt(timeLength);
	if (tbType==clockType||tbType==album) {
		addTotalTimeLength(length);
		addTypeAlbumAllTimeLength(length);
	}
	if (tbType==declearType) {
		addTotalTimeLength(length);
		addPlateformDeclareAllTimeLength(length);
	}
}
function changeIndexBuffer(tbType, value) {
	if (tbType==clockType||tbType==album) {//判断是否是分类和专辑
		addTypeAlbumLineIndex(value);
		addTableLineIndex(value);
	}
	if (tbType==declearType) {//判断是否是台宣
		platformDeclareIndex(value)
		addTableLineIndex(value);
	}
}
function updateTableIndex() {
	var productTable = $('#product-table');
	var trs = productTable.find('tr');
	var index = 1, pIndex = 1, hIndex = 1;
	trs.each(function(i, e) {
		var tbType=$(this).find("td").find("input[name='typeArr']").val();
		if (i == 0) {
		} else {
			var _e = $(e);
			var tds = _e.find('td');
			var trIndex=index ++;
			var tdHtml='<input type="hidden" id="'+trIndex+'_order" name="orderSetArr" value="'+trIndex+'">'+trIndex;
			$(tds[0]).html(tdHtml);
			if (tbType==clockType||tbType==album) {
				$(tds[1]).html(hIndex ++);
			} else if (tbType==declearType) {
				$(tds[2]).html(pIndex ++);
			}
		}
	});
}
//删除表格中的记录
function removeThisTr(_this) {
	var element = $(_this);
	var tr = element.parent().parent();
	var trId = tr.attr('id');
	var timeLength = parseInt(tr.attr('timeLength'));
    var tbType=$(tr).find("td").find("input[name='typeArr']").val();
	changeTimeBuffer(tbType, 0 - timeLength);//删除某一行
	removeFromTableLineBuffer(trId);//删除整行
	updateTimeInfoBar();
	changeIndexBuffer(tbType, -1);//改变分类及专辑序号
	tr.remove();
	updateTableIndex();//更新表格序号
}
var handlerTableLineData = function(drag, trId, nodeName, nodeId, tbType, timeLength,timeLengthStr, belongMusic,trOrder) {
	if (containKeyInTableLineBuffer(trId)) {	//如果缓存中已经存在
//		return ;		//暂时去掉
	}
	var productTable = $('#product-table');
	var timeLength = parseInt(timeLength);
	addToTableLineBuffer(trId);

	var html = getTrHTML(nodeName, trId,nodeId, tbType, timeLength,timeLengthStr, belongMusic,trOrder);

	productTable.append($(html));
	$(".sbToggle").toggle(
		function(){
			$(this).parent().find(".sbOptions").show();	
		},function(){
			$(this).parent().find(".sbOptions").hide();	
		}
	);
	$(".setClockCancle").click(function(){
		$(this).parent().hide();
	});
	select();
	changeTimeBuffer(tbType, timeLength);
	updateTimeInfoBar();
	if (drag) {
		dragRule();
	}
	
};
//回调函数
function dataCallBack(){
	
}
var getStyle = function(timeLength) {
	return parseInt(timeLength)==0 ?"background-color: #f89bb2;" :'';
}
var getTrHTML = function(nodeName, trId, nodeId, tbType, averageAudioTimeLength,timeLengthStr, belongMusic,trOrder) {
	var style = getStyle(averageAudioTimeLength); 
	var belongHappyLibrary=$("#belongHappyLibrary").html();
	var belongJson =  eval(belongHappyLibrary);
	var selectHtml="";
	var belongMusicIdArr=[];
	var belongSongIdArr=0;;
	var belongMusicNameArr=[];
	 for (var i = 0; i < belongJson.length; i++) {
	        var contentValue = belongJson[i].name;
	        var flag="";
	        	if(belongMusic != null && String(belongMusic).indexOf(belongJson[i].id) >= 0){
		        	belongMusicIdArr.push(belongJson[i].id);
		        	belongMusicNameArr.push(belongJson[i].name);
		        	flag="checked="+true;
		        	belongSongIdArr=belongSongIdArr+belongJson[i].id+"_"
		        }
	      //  alert(flag);
	        selectHtml=selectHtml+'<li><input type="checkbox" name="ids" value="'+belongJson[i].id+'" '+flag+'/><span>'+contentValue+'</span></li>';
	 }
	 if(belongSongIdArr!=0){
		 belongSongIdArr=belongSongIdArr.substring(0,belongSongIdArr.length-1);
	 }
	 var arr = trId.split("_");
	 var level=arr[3];
	 var typeId=arr[2];
//	 if(obj != undefined){
//		 level=obj.level;
//		 typeId=obj.typeId;
//	 }
	 var typeName=clockTypeName;
	 if(tbType==album){//判断是否是专辑
		 typeName=albumName;
	 }else if(tbType==declearType){
		 typeName=declearName;
	 }
	 var belongMusicId=belongMusicIdArr.length>0?belongMusicIdArr:"";
	 var belongMusicName=belongMusicNameArr.length>0?belongMusicNameArr:"请选择";
	 var style="#fff";
	 var orderSet=addTableLineIndex(1);
	 if(nodeName==null){
		 nodeName="";
	 }
	 var html = '<tr id="' + trId + '" timeLength="' + averageAudioTimeLength + '" avgTimeLength="' + averageAudioTimeLength + '" averageDuration="' + timeLengthStr + '" style="' + style + '" onclick="clickATableLine(this)"' + '>' +
	 '<td><input type="hidden" id="' + orderSet + '_order" name="orderSetArr" value="'+trOrder+'"/>' + orderSet +'</td>' +	//序号
	'<td>' + (tbType==clockType||tbType==album?addTypeAlbumLineIndex(1) :'') + '</td>' +	//内容序号
	'<td>' + (tbType==declearType? platformDeclareIndex(1) :'') + '</td>' +	//台宣序号
	'<td><input type="hidden" id="' + orderSet + '_type" name="typeArr" value="'+tbType+'"/>' + typeName + '</td>' +	//类别
	'<td><input type="hidden" id="' + orderSet + '_album_hidden" name="contentIdArr" value="'+nodeId+'"/>'+
	 (tbType==album?'<input id="' + orderSet + '_album_name" type="text" name="albumName" isOnload="0"'+
			 'value="'+nodeName+'" class="clockInput"/> <input type="button" class="inputBtn selectAlbum"' +
			 'value="选择" onclick="onloadInputInfo(this);" />' :nodeName) + 
			'</td>' +	//名称
	'<td style="width:165px"><input type="hidden" id="' + orderSet + '_belong_song" name="belongSongArr" value="'+belongSongIdArr+'"/>'+
		'<div class="sbHolder"><span class="sbSelector">'+belongMusicName+'</span><span class="sbToggle"></span>'+
	    	'<div class="sbOptions">'+
			'<ul class="clearfix">'+
	    	   selectHtml+                  
	    	'</ul>'+
	    	'<input type="button" class="inputBtn setClockSure"  value="确定" onclick="updateAudioTimeLength(this,'+tbType+');" />  <span class="setClockCancle">取消</span>'+
	    	'</div>'+
	 	'</div>'+
	 	 "</td>" +
    '<td><input type="hidden" id="' + orderSet + '_time_length" name="timeLengthArr" value="'+averageAudioTimeLength+'"/><span>' + timeLengthStr + '</span></td>' +	//时长
	'<td><a href="###" onclick="removeThisTr(this)">删除</a></td>' +	//操作
	'</tr>';
	return html;
}

var clickATableLine = function(_this) {
	var tr = $(_this);
	while (tr.prev().length > 0) {
		tr = tr.prev();
		addCurrentTimeLength(parseInt(tr.attr('timelength')));
	}
	updateTimeInfoBar();
};

//加载表格信息
var loadTable = function(drag, callbackFn) {
			var tr = addTableTrIndex(1);
			var trId =tr+"_trId";//0为分类，1为专辑
			var setContentlList=$("#setContentlList").html();
			var tempSetContentlList =  eval(setContentlList);
	        for (var i = 0; i < tempSetContentlList.length; i++) {//方法参数drag, trId, nodeName, nodeId, tbType, timeLength,timeLengthStr belongMusic
	        	handlerTableLineData(drag, trId, tempSetContentlList[i].contentName,tempSetContentlList[i].contentId,tempSetContentlList[i].type,tempSetContentlList[i].timeLength,tempSetContentlList[i].oneTimeLength,tempSetContentlList[i].belongSong,tempSetContentlList[i].orderSet);
	        }

};


var gettbType = function(thisNode) {	//得到是乐库、还是台宣
	var n = thisNode;
	while(n.level != 1) {
		n = n.getParentNode();
	}
	return n.pId;
};

var ajaxTableLine = function(thisNode) {	//获取一行table值
	if(thisNode.isLeaf==1){
		var trIndex = addTableTrIndex(1);
    	var trId =trIndex+"_trId";//0为分类，1为专辑,2为台宣  
    	//方法参数drag, trId, nodeName, nodeId, tbType, timeLength,timeLengthStr belongMusic
    	handlerTableLineData(true, trId, thisNode.name,thisNode.id,thisNode.tbType,thisNode.timeLength,thisNode.timeLengthStr,null,trIndex);//插入表格数据
	}else{
		myDialog.showAlert("父级无内容资源，请选择下级节点！");
	}
};


var initTree = function(haveClickEvent) {
	var beforeExpand = function() {
		console.log(1);
	};
	var onExpand = function() {
		console.log(2);
		
	};
	var onClick = function() {
		console.log(3);
	};
	var zTreeOnClick = !haveClickEvent ?function(event, treeId, thisNode) {}
			: function(event, treeId, thisNode) {
		if (thisNode.isLeaf==0) {
			return ;
		}
		ajaxTableLine(thisNode);
		
	};
	function addDiyDom(treeId, treeNode) {
		var spaceWidth = 5;
		var switchObj = $("#" + treeNode.tId + "_switch"),
		icoObj = $("#" + treeNode.tId + "_ico");
		switchObj.remove();
		icoObj.before(switchObj);
		//
		if (treeNode.level > 1) {
			var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
			switchObj.before(spaceStr);
		}
	}
	var treeSetting = {
		view: {
			showLine: false,
			showIcon: false,
			selectedMulti: false,
			dblClickExpand: false,
			addDiyDom: addDiyDom
		},
		data: {
			simpleData: {
				enable: true,
				rootPId: 0
			}
		},
		callback: {
			beforeExpand: beforeExpand,
			onExpand: onExpand,
			onClick: zTreeOnClick,
			//onDblClick: zTreeOnDblClick
		}
	};

	var ajaxSuccess = function(response) {
		var treeObj = $("#clockTreeDemo");
		tree = $.fn.zTree.init(treeObj, treeSetting, response);
	}

	var ajaxSetting = {
        url: ctx + '/clock/getTree.do',
        data: {},
        success: function(response, status, options) {
        	ajaxSuccess(response);
    	},
    	dataType: "json",
    	type: "get"
	};
	$.ajax(ajaxSetting);
};
//e.g. _487_2662_2_475BA6BF-84C1-43F3-9880-A5C378A54060_belongsHappyLibraryTdId
var getNodeIdAndNodeLevelByTdId = function(tdId) {
	var values = tdId.split('_');
	return {
		tbType: values[1],
		typeId: values[2],
		level: values[3]
	};
};

var ajaxTimeLengthInfoBelongs = function(tempTd,tbType, checkIds) {
	var contentId=$(tempTd).prev().find("input[name='contentIdArr']").val();
	if(contentId!="0"){//判断内容值是否为空
		var ajaxSetting = {
		        url: $('#ctx').val() + '/clock/checkedBelongType.do',
		        data: {contentId:contentId, checkIds:checkIds,tbType:tbType},
		        success: function(response, status, options) {
		        	var tr = tempTd.parent();
		        	var tds = tr.find('td');
		        	changeTimeBuffer(tbType, 0 - parseInt(tr.attr('timeLength')));
		        	changeTimeBuffer(tbType, response.timeLength);
		        	tr.attr('timeLength', response.timeLength);
		        	$(tds[6]).find("input").val(response.timeLength);
		        	$(tds[6]).find("span").html(response.timeLengthStr);
		        	updateTimeInfoBar();
		        	var style = getStyle(response.timeLength);
		        	tr.attr('style', style);
		    	},
		    	dataType: "json",
		    	type: "get"
			};
			$.ajax(ajaxSetting);
	}
	
};

function select(){
	$(".selectbtn").click(function(){
		$("#gridtbody").find('tr').css('opacity', '1');
		$(".selectcont").hide();
		$(this).parent().find(".selectcont").show();
		
	});
	
}

//重新赋值时长
function updateAudioTimeLength(selectObj,tbType){
		var txtArry=[];
		var checkId="";
		$(selectObj).parent().find("input:checked").each(function(){
			var txt=$(this).parent().find("span").html();
			if(txtArry.length > 0){
				txtArry.push("  "+txt);
				
			}else{
				txtArry.push(txt);
			}		
			//checkId.push($(this).val());
			checkId=checkId+$(this).val()+"_";
		});
		if(checkId!=""){
			checkId=checkId.substring(0,checkId.length-1);
		}
		if(txtArry.length==0){
			txtArry.push("请选择");
			checkId="0";
		}
		var selectValue=$(selectObj).parent().parent();
		$(selectValue).find(".sbSelector").text(txtArry);
		$(selectValue).find(".sbSelector").attr("title",txtArry);
		$(selectObj).parent().hide();
		$(selectValue).find(".sbSelector").attr("hiddenValue",checkId);
		var tempTd=$(selectValue).parent();
		$(tempTd).find("input[name='belongSongArr']").val(checkId);
		ajaxTimeLengthInfoBelongs(tempTd,tbType, checkId);//加载所属曲库信息
		//$(this).parent().parent().find("img").attr("src",$('#ctx').val()+"/images/hide.png");
}
//新增专辑信息
function addAlbum(type){
	var trIndex = addTableTrIndex(1);
	var trId =trIndex+"_trId";//0为分类，1为专辑,2为台宣
	handlerTableLineData(true, trId, null,0,album,1,"00:00",null,trIndex);//方法参数drag, trId, nodeName, nodeId, tbType, timeLength,timeLengthStr belongMusic
}
//加载input信息
function onloadInputInfo(obj){
	 selectInput=obj;
	 maskce(open);
     $(".contTips").show();
     $(".contTips li:not(:eq(0))").remove();
}


//设置时长
function setTimeAudio(element,audioTime){
	var tempTd=$(element).parent().next().next();
	tempTd.find("input:hidden").val(audioTime);
	var tempTr=$(element).parent().parent();
	changeTimeBuffer(album, 0 - parseInt($(tempTr).attr('timeLength')));
	$(tempTr).attr("timelength",audioTime);
	$(tempTr).attr("avgTimeLength",audioTime);
	var audioTimeStr=formatDuring(audioTime)
	$(tempTd).find("span").html(audioTimeStr);
	$(tempTr).attr("averageDuration",audioTimeStr);
	changeTimeBuffer(album, audioTime);//album：专辑，audioTime：时长
	updateTimeInfoBar();
	var style = getStyle(audioTime);
	$(tempTr).attr('style', style);
}

//加载事件
function blindEvent(){
	    parame="radioId="+$("#radioId").val()+'&radioType='+$("#radioType").val()+'&compareId='+$("#compareId").val();
		$("#saveBtn").click(function(){
			if (getTotalTimeLength() >= 3600000 || getTotalTimeLength() <= 3300000) {
				alert('编排时间应控制在55-60分钟之内，请重新调整！');
			}else{
				$.ajax({
					type : "post",
					url : ctx+"/clock/setContentInput.do",
					data : $('#inputForm').serialize(),
					dataType : "json",
					async : true,
					cache : false,
					success : function(data){
					if(data.success){
						myDialog.showAlert("保存成功！",function(){
								openRight2(ctx+'/clock/list.do?'+parame);
							});
					    }
					},
					error : function(){
							myDialog.showAlert("保存失败！",function(){
				   				$(this).removeAttr('disabled');
				   			});
					}
				});
			}
		  });
		
		$("#myAlbumList").on("click",".sBtn",function(){
	        setSelectToContent($(this));
	    });
}
//选择内容
function setSelectToContent(obj){
	var dataId = obj.attr('recordId');//记录id
    var name = obj.attr('recordName');//记录名称
    var desc = obj.attr('recordDesc');//记录描述
    if(timeLength=="null"){
    	timeLength=0;
    }
    var inputObj=$(selectInput).prev();
    $(inputObj).val(name);
    $(inputObj).prev().val(dataId);
	var trObj=$(selectInput).parent().parent();
	var timeLength=0;
	var belongSongArr=$(trObj).find("td").find("input[name='belongSongArr']").val();
	if(belongSongArr!="0"&&belongSongArr!=""){
		ajaxTimeLengthInfoBelongs($(selectInput).parent().next(),album,belongSongArr);
	}else{
		 timeLength = obj.attr('timeLength');//记录时长
		 if(timeLength=="null")//判断时长是否为空
			 timeLength=0;
		 setTimeAudio(inputObj,timeLength);
	}
   
    diaryCancel();
}