//内容来源切换
function selectTypes(obj,casid,type){
	 var isinput = $(obj).is(":checked");
	 var anotherType;
	 if(type =='1'){
		 anotherType='2';
	 }else{
		 anotherType='1';
	 }
	 if(isinput == true){
		$(obj).parents(".userlist").find(casid+type).show();
		$(obj).parents(".userlist").find(casid+anotherType).hide();
		$(obj).parents(".userlist").find(casid+type).find(".appoint").find("input[value='0']").attr("checked",true);		
	 }else{		
		 $(obj).parents(".userlist").find(casid+type).hide();		 
		 $(obj).parents(".userlist").find(casid+type).find(".appoint").find("input[value='0']").attr("checked",false);
		 
	 }
		 
}