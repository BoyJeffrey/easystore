/**
 * Created by carlxu on 14-6-17.
 */
var mams_content={
    module :{
        add:{
            init: function(id){
                var valid = new Validation('inputForm',{immediate:true,useTitles:true});
                var sortRows = this.sortRows;
                $("#inputForm").ajaxForm({
                    success:function() {
                        alert("保存成功！");
                        openRight2(ctx+'/contents/module/list.do');
                    },
                    error:function(){
                        alert("保存失败！");
                    }
                });

                $("#columnContent").on("click", '.addRowBtn',function(e){
                    e.stopPropagation();
                    var obj = $("#columnTmpl").render([{visibility:true}]);
                    $("#columnContent").append(obj);
                    sortRows();
//                    var children = $("#columnContent").children();
                    bindAutoComplete($("#columnContent :last-child").find(".column_code"));
                });
                $("#columnContent").on("click", '.delRoleBtn',function(e){
                    e.stopPropagation();
                    if($("#columnContent").children().length>1){
                        $(this).parent().remove();
                        sortRows();
                    }
                });
                var firstChange = true;
                $("select.selectBtn").change(function(){
//                    console.log(this.arguments);
                    if(!id || !firstChange){
                        var text = $(this).find("option:selected").text();
                        $("#name").val(text);
                    }
                    firstChange=false;
                });
                $("select.selectBtn").change();
                bindAutoComplete($(".column_code"));
                function bindAutoComplete(obj){
                    obj.autocomplete(ctx+"/contents/base/query/autoComplete.do",{
                        dataType:"json",
                        formatItem: function(data, i, max) {//格式化列表中的条目 row:条目对象,i:当前条目数,max:总条目数
                            return i + '/' + max + ': ' + data.code + '[' + data.name + ']';
                        },
                        parse:function(data){
                            var parsed = [];
                            if(data && data.length){
                                for(var i=0; i< data.length; i++){
                                    var row = data[i];
                                    parsed[parsed.length] = {
                                        data: row,
                                        value: row.code,
                                        result: row.code
                                    };
                                }
                            }
                            return parsed;

                        }
                    }).result(function(event,data,formatted){
//                    console.log(event);
                        var parent = $(event.currentTarget).parent();
                        parent.find(".column_name").val(data.name);
                        parent.find(".column_req").prop("checked", data.required);
                    })
                }

            },
            sortRows : function(){
                var rows = $("#columnContent").children();
                if(rows && rows.length){
                    $.each(rows, function(index, ele){
                        $(ele).find(".column_code").attr("name", "moduleContentColumnDTOList["+index+"].code");
                        $(ele).find(".column_name").attr("name", "moduleContentColumnDTOList["+index+"].name");
                        $(ele).find(".column_req").attr("name", "moduleContentColumnDTOList["+index+"].required");
                        $(ele).find(".column_visible").attr("name", "moduleContentColumnDTOList["+index+"].visibility");
                    })
                }
            }
        }

    }
}
