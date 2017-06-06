$("#myAlbumList").on("click",".sBtn",function(){
    setSelectToContent($(this));
});
$("#myAudioList").on("click",".sBtn",function(){
    setSelectToContent($(this));
});
$("#myRadioList").on("click",".sBtn",function(){
    setSelectToContent($(this));
});
$("#myFeatureList").on("click",".sBtn",function(){
    setSelectToContent($(this));
});
$("#myLiveList").on("click",".sBtn",function(){
    setSelectToContent($(this));
});
function setSelectToContent(obj){
	var index = $("#li_recommend_index").data("index");
	var dataId = obj.attr('recordId');
	var name = obj.attr('recordName');
	$("#div_name_"+index).html(name +'<span class="seletCont" data-index="' + index + '">选择内容</span>');
	$("#div_type_"+index).html(obj.attr('recordType'));
	$("#div_catalog_"+index).html(obj.attr('recordCatalogName'));
	$("#txt_name_"+index).val(name);
	$("#desc_"+index).val(obj.attr('recordDesc'));
    $("#txt_nameV_"+index).val(name);
	var recordImg = obj.attr('recordImg');
	var showImgPath = $('#showImgPath_'+index); 
	if(recordImg.indexOf(".jpg") > -1 ){
		showImgPath.html("<img src=\"" + wsBaseUrl + recordImg  + "\" alt=\"\" height=\"87px\" width=\"257px\" />");
		$("#operListContent_url_"+index).val(recordImg);
	}else{
		var defaultImg = ctx+ "/images/default.png";
		$("#operListContent_url_"+index).val("");
		showImgPath.html("<img src=\""  + defaultImg+ "\" alt=\"\" height=\"87px\" width=\"257px\" />");
	}
	$("#data_txt_id_"+index).val(dataId);
	diaryCancel();
}


//展开收起
function recommendHs(obj){
    var hideS=$(obj).parent().parent().find(".selectNums");
    if(hideS.css("display")=="none"){
        $(obj).parent().parent().find(".selectNums").show();
        $(obj).html("收起");
    }else{
        $(obj).parent().parent().find(".selectNums").hide();
        $(obj).html("展开");
    }

}

//推荐内容删除
function delrecommed(obj){
	var confirmMsg = "确定删除吗？";
	myDialog.showConfirm(confirmMsg,function(){
		$(obj).parent().parent().remove();		
	});
}