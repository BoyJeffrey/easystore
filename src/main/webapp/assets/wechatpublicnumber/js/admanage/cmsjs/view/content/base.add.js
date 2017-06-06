/**
 * Created by carlxu on 14-6-17.
 */
var mams_content={
    base :{
        add:{
            init: function(){
                var valid = new Validation('inputForm',{immediate:true,useTitles:true});
                $("#inputForm").ajaxForm({
                    success:function() {
                        alert("保存成功！");
                        openRight2(ctx+'/contents/base/list.do');
                    },
                    error:function(){
                        alert("保存失败！");
                    }
                });
            }
        }
    }
}
