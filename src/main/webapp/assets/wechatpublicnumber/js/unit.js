window.util = {  
	clone : function(obj) {  
	    if (typeof (obj) != 'object')  
	        return obj;  

	    var re = {};  
	    if (obj.constructor==Array)  
	        re = [];  

	    for ( var i in obj) {  
	        re[i] = util.clone(obj[i]);  
	    }  

	    return re;  

	}  
};  
window.frominputFn={
		'Ctitle':'',
		'Ctype':'',
		'Cidentification':'',
		'Ccheck':[],
		'value':'',
		'errorText':'',
		'erroFlag':true,
		'Decoration':{
			'alertError':function(Cobject){
				var errorText=Cobject.errorText;
				this.showError(Cobject);
			},
			'showError':function(Cobject){
				var tmp=jq(Cobject.Cidentification).parent().find('span.error');
				tmp.html(Cobject.errorText);
			}
		},
		'foreachInit':function(Cobject){
			var _that=this,swap=[];
			for (var item in Cobject) {
				swap[item]=_that.init(Cobject[item]).run();
			}
			return swap;
		},
		'run':function(){
				var _that=this;
				var fnName=swap='';
				for(var item in _that.Ccheck){
					fnName=_that.Ccheck[item];
					_that[fnName]();
				}
				var Decoration=_that.Decoration;
				Decoration.alertError(_that);
				return _that;
		},
		'init':function(data){
			var _that=util.clone(this);
			_that.Ctitle=data.title;
			_that.Ctype=data.type;
			_that.Cidentification=data.identification;
			_that.Ccheck=data.check;
			_that.getval(data.identification);
			return _that;
		},
		'isNull':function(){//是否为空验证
			var _that=this;
				if(this.value==''){
					_that.errorText='不能为空.';
					_that.erroFlag=false;
				}else{
					_that.errorText='';
					_that.erroFlag=true;
				}

			return _that;
		},
		'isInteger':function(value){
		    if(value.match(/^\d+$/g)){      
		        return true;            
		    }else{                       
		        return false; 
		    }       
		},
		'mustMoreZero':function(){
				var _that=this;
				if(!(this.value>0 && isInteger(this.value))){
					_that.errorText='提现金额必须是大于零的，正整数.';
					_that.erroFlag=false;
				}else{
					_that.errorText='';
					_that.erroFlag=true;
				}

			return _that;
		},
		'getval':function(){
			var _that=this;
			if(_that.Ctype=='input'){
				_that.value=jq(_that.Cidentification).val();
			}
			return _that;
		}
	}