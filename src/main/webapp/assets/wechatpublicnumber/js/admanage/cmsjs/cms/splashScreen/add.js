var mams_contentpic={
		init:function(){$("#splashScreenImgList").jqGrid({
		   	url:ctx +'/splashscreen/imglist/forJson.do',
			datatype: "json",
			jsonReader:{
					root: "result",
					page: "pageBean.page",
					total: "pageBean.pages",
					records: "pageBean.count",
					repeatitems: true,
			},
		   	colNames:['图片','名称','操作'],
		   	colModel:[
		   		{name:'ospixel2path',index:'ospixel2path',align:"center", formatter: function(cellval){
		   			
		   			if(cellval == ''){
		   				cellval=ctx +"/images/noCover.png";   				
		   			}
		   			return '<a href="javascript:void(0)" class="tooltip"><img src="'+cellval['1640*1136']+'" width="30" height="30" class="marginTop "></a>';
		   		}},
		   		{name:'name',index:'name',align:"center"},
		    	{name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
		            //if(!splashScreenImg_UPDATE_permission)return'';
		    		var imgPath = rowData['ospixel2path']['1640*1136'];
		   		   	var edit = '<a href="javascript:void(0)" class="inputBtn" onclick="selected('+cellval+','+'\''+imgPath+'\')" recordId="'+cellval+'" title="选择">选择</a>&nbsp;&nbsp;&nbsp;';
		   			return edit;
		   		},align:"center"}	
		   	],
		   	height:"auto",
		   	rowNum:20,
		   	rowList:[20,50,100],
		   	pager: '#pager2',
		   	sortname: 'id',
		   	multiselect:true,
		    viewrecords: true,
		    sortorder: "desc",
		    prmNames: {page:"pageNum",rows:"pageSize"},
		    caption:"JSON Example",
		    onPaging:function(){
		    	window.parent.document.documentElement.scrollTop= 0;//页面滚动条处于最顶端
				window.parent.document.body.scrollTop= 0;//谷歌
		    },
//		    loadComplete:function(){
//		    	//showBigImage();
//		    }
		});
		$("#splashScreenImgList").setGridWidth($(".selectContTips").width()*0.98);
	}
}