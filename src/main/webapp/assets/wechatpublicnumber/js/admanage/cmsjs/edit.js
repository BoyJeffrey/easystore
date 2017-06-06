$(document).ready(function(){
	
	//操作记录显隐
	$(".hideshow").toggle(function(){
		$(this).parent().find(".checkTable").show();
		//$(this).prev(".record").show();
		$(this).find("img").attr("src","images/hide.png");
	},function(){
		//$(this).prev(".record").hide();
		$(this).parent().find(".checkTable").hide();
		$(this).find("img").attr("src","images/show.png");
	}
	);
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
	
});
