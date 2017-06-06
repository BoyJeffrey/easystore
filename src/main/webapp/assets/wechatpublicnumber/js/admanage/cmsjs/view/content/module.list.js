/**
 * Created by carlxu on 14-6-17.
 */
var mams_content={
    module :{
        list:{
            init: function(){
                var batchDelete = this.batchDelete;
                $('#batchDelBtn').click(function(){
                    var ids = $("#table").getGridParam('selarrrow');
                    batchDelete(ids);
                });

                $('#table').on('click', '._editBtn',function(){
                    openRight2(ctx + '/contents/module/update.do?id='+$(this).attr('recordId'));
                });

                $('#table').on('click', '._delBtn',function(){
                    var id = $(this).attr('recordId');
                    batchDelete([id]);
                });
                $("#table").jqGrid({
                    url:ctx+'/contents/module/list/forJson.do',
                    datatype: "json",
                    jsonReader:{
                        root: "result",
                        page: "pageBean.page",
                        total: "pageBean.pages",
                        records: "pageBean.count",
                        repeatitems: true
                    },
                    colNames:['ID', 'code', '名称', '操作'],
                    colModel:[
                        {name:'id',index:'id',align:"center",width:"220px"},
                        {name:'moduleId',index:'moduleId',align:"center",width:"220px"},
                        {name:'name',index:'name',align:"center",width:"220px"},
                        {name:'id',index:'id', formatter: function(cellval, rowModel , rowData){
                            return '<div>'+
                                '<a href="javascript:void(0)" class="_delBtn" recordId="'+cellval+'" title="删除" >删除</a>&nbsp;&nbsp;&nbsp;'+
                                '<a href="javascript:void(0)" class="_editBtn" recordId="'+cellval+'" title="编辑" >编辑</a>'+
                                '</div>';
                        },align:"center",width:"220px"}
                    ],
                    height:"auto",
                    rowNum:20,
                    rowList:[20,50,100],
                    pager: '#pager',
                    sortname: 'id',
                    multiselect:true,
                    viewrecords: true,
                    sortorder: "desc",
                    prmNames: {page:"pageNum",rows:"pageSize"},
                    caption:"没有数据！",
                    onPaging:function(){
                    	window.parent.document.documentElement.scrollTop= 0;//页面滚动条处于最顶端
                		window.parent.document.body.scrollTop= 0;//谷歌
                    }
                });
                $("#table").setGridWidth($(".usermain").width()*1);
            },
            batchDelete:function(ids){
                if(ids.length>0){
                    if(confirm("确定删除？")){
                        $.ajax({
                            type : "post",
                            url :  ctx +"/contents/module/delete.do",
                            data : {ids:ids},
                            dataType : "json",
                            async : true,
                            cache : false,
                            success : function(result){
                                if(result){
                                    alert("删除成功");
//                                    openRight2(ctx +"/contents/module/list.do");
                                    $("#table").trigger("reloadGrid");
                                }else{
                                    alert("删除失败");
                                }
                            },
                            error : function(){
                                alert("删除失败");
                            }
                        });
                    }
                }else{
                    alert("请先选择数据！");
                }
            }
        }
    }
}

