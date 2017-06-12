var tmp=0;
var temp=0; 
$(document).ready(function(){
	//setInterval(function(){
		leftHeight();
		//$(".menu").css("height","700px");
	//},30);
	//侧边栏隐藏显示
	$("#jianbian").click(function(){
		
		//alert("ok!");
		if($("#sidebar").css("display") == "block"){
			$("#sidebar").css("display","none");
			$(".left-search").css("display","none");
			//$("#right_content").css("width","95%");
			$(this).find("img").attr("src","images/unrelease.png");
			//$(this).css("background","url(images/jianbian01.png) no-repeat");
			//$("#jianbian").css("height", iframe.height);
		}else{
			$("#sidebar").css("display","block");
			$(".left-search").css("display","block");
			//$("#right_content").css("width","81%");
			$(this).find("img").attr("src","images/release.png");
			//$(this).css("background","url(images/jianbian.png) no-repeat");
			//$("#jianbian").css("height", iframe.height);
		}
	});
	
	$("#sidebar .bxx_click").click(function(){
		//alert("ok");
		$("#sidebar .bxx_click").removeClass("sidebar_hover");
		$(this).addClass("sidebar_hover");	
		
	});
	//用户左菜单栏
	$(".menuhs").toggle(function(){
			$(this).css("left","0");
			$(".menu").css("width","52px");
			$(".menutop").hide();
			$("#treeDemo").hide();
			//$(".menu").css({"width":"52px","text-indent":"-99999px"});
			//$(".contentright").css("width","94%");
			//$("#right_content").css("width","95%");
		},function(){
			$(this).css("left","148px");
			$(".menu").css("width","200px");
			$(".menutop").show();
			$("#treeDemo").show();
			//$(".contentright").css("width","80%");
			//$("#right_content").css("width","81%");
		}
	);
	//系统设置管理菜单栏隐藏显示
	/*$(".menucont dt").toggle(
		function(){
			$(this).parent().find("dd").show();
			$(this).find("img").attr("src","images/show.png");
		},function(){
			$(this).parent().find("dd").hide();
			$(this).find("img").attr("src","images/hide.png");
		}
	);*/
	$(".menucont dt").click(function(){
		var temp=$(this).parent().find("dd").hasClass("hideNav");
		console.log(temp);
		if(temp){
			$(this).parent().find("dd").show().removeClass("hideNav");
			$(this).find("img").attr("src","images/show.png");
		}else{
			$(this).parent().find("dd").hide().addClass("hideNav");
			$(this).find("img").attr("src","images/hide.png");
		}
	});
	//搜索失去焦点
	$(".focuseBlur").live("focus",function(){
		if($(this).val()=="名称"){
			$(this).val("");	
		}
	});
	$(".focuseBlur").live("blur",function(){
		if($(this).val()==""){
			$(this).val("名称");	
		}
	});
	//修改密码
	/*$(".showhide-account").toggle(
		function(){
			$(".account-content").show();	
		},function(){
			$(".account-content").hide();	
		}
	);*/
	//全选和取消全选
	$(".checkAll").live("change",function(){
		if($(this).attr("checked")){
			$(this).parents(".main").find("input").attr("checked", "checked");
			$(this).parents(".usermain").find("input").attr("checked", "checked");
		} else {
			$(this).parents(".main").find("input").removeAttr("checked");
			$(this).parents(".usermain").find("input").removeAttr("checked");
		}
	});	
	$(".checkAllrole").live("change",function(){
		if($(this).attr("checked")){
			$(this).parents("dl").find("input").attr("checked", "checked");
		} else {
			$(this).parents("dl").find("input").removeAttr("checked");
		}
	});	
	
	
	
	//选择下拉框

    $(".select select").live("change",function(){
        var txt=$(this).find("option:selected").text();
        //console.log(txt);
        $(this).parent().find(".selectxt").val(txt);
    });
	//编辑标签选项
//	$(".addLabel").live("click",function(){
//		//var cln=$(this).parent().find(".selectLabelist").last().clone();
//		//cln.appendTo(".selectLabel");
//		//cln.find("input").val("");
//		var add='<div class="selectLabelist"><input type="text" class="inputType" value="" /><span onclick="cancle(this)">X</span></div>';
//		$(add).appendTo(".selectLabel");
//	});
	
	//碎片列表复制地址
	$(".copylink").live("click",function(){
		var offsetTop=$(this).offset().top;
		console.log(offsetTop);
		$(".copyAudioPath").show();
		$(".copyAudioPath").css("top",offsetTop-120);
		maskce(open);	
	});
	
	$(".back").live("click",function(){
		$(".copyAudioPath").hide();
		maskce();	
	});
	
	//新增主持人信息
	/*
	$(".addpresenter").live("click",function(){
		if(tmp=="0"){
			$(".presenter").show();
			tmp=1;
		}else {
			//$(".presenter").last().clone().appendTo($(".selectcreat"));	
		}
		
	});
	*/
	
	//选择主持人
	$(".selectpresenter").live("change",function(){
		var vl=$(this).val();
		//console.log(vl);
		if(temp=="0"){
			$(".creatpresenter").show();
			temp=1;
		}else {
			$(".creatpresenter").last().clone().appendTo($(".selectedpresenter"));	
		}
	});
	//主持人基本信息显隐
	$(".floatright").toggle(function(){
		$(".hsmessage").hide();
		$(this).text("显示");
		$(this).parent().css("margin-bottom","10px");
	},function(){
		$(".hsmessage").show();
		$(this).text("隐藏");
	}
	);
	//tab切换
	$(".tab li").live("click",function(){
		$(this).addClass("tabnow").siblings().removeClass("tabnow");
		$(".tabDiv > div").hide().eq($(".tab li").index(this)).show();
	});
	
	//二级菜单
	$(".havesecond").hover(
		function(){
			$(this).find(".secondselect").show();
			$(this).css({"border-width":"1px","border-style":"solid","border-color":"#0e83b9"});	
		},function(){
			$(this).find(".secondselect").hide();
			$(this).css("border","0")	
		}
	);
	
});
//删除标签选项
function cancle(obj){
	var r=confirm("确定删除吗？");
	if(r==true){
		$(obj).parent().remove();	
	}	
}
//遮罩
function maskce(open){
	var winWidth = document.documentElement.clientWidth || document.body.clientWidth;
	var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
	var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
	$(".zhezhao").css({
		"width" : winWidth,
		"height" : scrollHeight
	});
	if(open){
		$(".zhezhao").show();
	}else{
		$(".zhezhao").hide();	
	}
	//window.parent.document.documentElement.scrollTop= 0;//页面滚动条处于最顶端
	//window.parent.document.body.scrollTop= 0;//谷歌
}

//权限全选
function selectType(obj,casid){
	 var isinput = $(obj).is(":checked");
	 if(isinput == true){
		$(obj).parents(".userlist").find(casid).show(); 
	 }else{
		 var selectCheck=$(obj).val();
		 if(selectCheck==0){
			 $(".selectabcont1").find("input").removeAttr("checked");//取消全选     
		 }else if(selectCheck==1){
			 $(".selectabcont2").find("input").removeAttr("checked");//取消全选     
		 }
		 $(obj).parents(".userlist").find(casid).hide();
	 }
	var checkedLenth=$(".selectab").find(":checked").length;
	if(checkedLenth>0){
		$("#auth-role-validate").val("checked");
	}else{
		 $("#contentRunMgmt").show();
	}
}
//加载权限个数
function onloadPermission(){
	var length1=$(".selectabcont1").find(":checked").length;
	$(".selectabcont1").find(".selectnum").html(length1);
	var length2=$(".selectabcont2").find(":checked").length;
	$(".selectabcont2").find(".selectnum").html(length2);
}
//操作类型 optionType 0:内容运营管理  1:系统设置管理
function setPermissNum(optionType){
	if(optionType==0){
		var length1=$(".selectabcont1").find(".selectconts").find("input:checked").length;
		$(".selectabcont1").find(".selectnum").html(length1);
	}else if(optionType==1){
		var length2=$(".selectabcont2").find(".selectconts").find("input:checked").length;
		$(".selectabcont2").find(".selectnum").html(length2);
	}
	
}
//日志弹层
function diary(obj){	
	$(".tips").show();
	var offsetTop=$(obj).offset().top;
	console.log(offsetTop);
	if(offsetTop>560){
		$(".tips").css("top",offsetTop-300);
	}
	maskce(open);	
}
//日志弹层关闭
function diaryCancel(){
	$(".tips").hide();
	$(".cancelTips").hide();
	maskce();		
}
//删除用户
function cancelUser(){
	$(".cancelTips").show();
	maskce(open);
	var vl=$(this).parent().parent().find("input:checked").length;
	if(vl==0){
		$(".cancelTips").find("p").html("亲，请先在列表中选中要操作的内容。");		
	}else{
		$(".cancelTips").find("p").html("是否确定批量删除选中用户？");	
	}
	
}

function openRight(url){
	$("#right_content").load(url);
	leftHeight1();
	window.parent.document.documentElement.scrollTop= 0;//页面滚动条处于最顶端
	window.parent.document.body.scrollTop= 0;//谷歌
}

function QueryString(uri) {
   return uri.substring(uri.indexOf('?')+1,uri.length);
}

function openRight2(url){
	var randomUrl = url + '?t='+ new Date().getTime();
	$("#rightContainer").load(url);
	if($("#rightContainer").children('#urlVal')){
		$("#rightContainer").children('#urlVal').val(QueryString(url));
		console.log($("#rightContainer").children('#urlVal'));
	}
	leftHeight();
	window.parent.document.documentElement.scrollTop= 0;//页面滚动条处于最顶端
	window.parent.document.body.scrollTop= 0;//谷歌
}

function openMainContent(url,opt){
	$("#content").load(url);
	if( opt == "adManage"){
		$("#adManage").attr("class","now");
		$("#userManage").attr("class","");
		$("#adminUser").attr("class","");
	}
	if( opt == "userManage" ){
		$("#adManage").attr("class","");
		$("#userManage").attr("class","now");
		$("#adminUser").attr("class","");
	}
	if( opt == "adminUser" ){
		$("#adManage").attr("class","");
		$("#userManage").attr("class","");
		$("#adminUser").attr("class","now");
	}
	
	
}





//新增主持人
function creat(obj){
	var vl=parseInt($(".number").val());	
	//console.log(vl);
	vl=vl+1;
	$(".number").val(vl);
	$(obj).val("已完成");
	//$(this).disabled =disabled;
	//$(this).removeClass("creattable");
	$(obj).attr("disabled","disabled");	
}
function cancle2(obj){
	var r=confirm("确定删除吗？");
	if(r==true){
		$(obj).parent().remove();
		var vl=parseInt($(".number").val());	
		if(vl>0){
			vl=vl-1;
		}
		$(".number").val(vl)
	}		
}
function leftHeight1(){
	var contHeight=$("#right_content").height();
	var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
	//console.log(scrollHeight);
	$(".menu").css({"height":contHeight,"min-height":scrollHeight-62});
	
}
function leftHeight(){
	var contHeight1=$(".contentright").height();
	var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
	//console.log(scrollHeight);
	$(".menu").css({"height":"750px","min-height":scrollHeight-62});
	
}
//清空搜索单个下拉选项搜索
function clearSearch(obj,e){
	var par=$(obj).parent(".search"); 
	par.find(".search-right").find("input[type='text']").val("").focus();
	openRight(e);
}
//清空搜索单个下拉选项搜索
function clearSearch1(obj,e){
	var par=$(obj).parent(".search"); 
	var valNon=par.find("select").find("option[value=' ']");
	par.find(".search-right").find("input[type='text']").val("").focus();
	valNon.attr("selected", true);
	//console.log(valNon.html());
	par.find(".selectxt").val(valNon.html());
	openRight2(e);
}
