/**
 * 价格校验:非空且最多两位小数
 * @param obj
 * @returns {boolean}
 */
function checkPrice(obj) {
    //判断商品价格
    var reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^[0]{1}(\.\d{1,2})?$)/;
    if (obj.val() != "" && reg.test(obj.val())) {
        return true;
    }else {
        Toast.error("输入价格需要为合法数字，且最多两位小数！");
        obj.focus();
        return false;
    }
}

/**
 *  正整数校验
 */
function checkInteger(obj){
    // 判断是否正整数
    var reg = /^(\+|-)?\d+$/;
    if(reg.test(obj.val()) && obj.val() > 0)
        return true;
    else
        return false;
}