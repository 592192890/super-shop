var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

export default {
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    formatDate: {
        format: function (date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }
    },
    array: {
        repeatArr: function(arr){
            return Array.from(new Set(arr));
        },
        toArray: function(obj){
            return Object.keys(obj).map(key=> obj[key]);
        },
        toObject: function(arr, key, transform){
            let obj = {};
            arr.forEach(item => {
                if(item[key]){
                    obj[item[key]] = item;
                    if(transform){
                        for(var k in transform){
                            if(obj[item[key]][transform[k]]){
                                obj[item[key]][k] = obj[item[key]][transform[k]];
                                delete obj[item[key]][transform[k]];
                            }
                        }
                    }
                }else if(item['id']){
                    obj[item['id']] = item;
                }else if(item['bn']){
                    obj[item['bn']] = item;
                }
            });
            return obj;
        }
    },
    //自定义表单验证规则
  validateForm: {
    //1到10个字符的正整数
    isWeight:(rule, value, callback)=>{
        if (!value) {
            return callback(new Error(rule.filedName + '不能为空'));
        }
        if (!/^\d{1,10}$/.test(value) || value == 0) {
            
            return callback(new Error('请输入1-10个字符的正整数'));

        }
        return callback();
    },
    isStoreCount:(rule, value, callback)=>{
        if (!value) {
            return callback(new Error(rule.filedName + '不能为空'));
        }
        if (!/^[\d]{1,20}$/.test(value)) {
            
            return callback(new Error('请输入1-20个字符的非负整数或0'));

        }
        return callback();
    },
    //整数位最大7个字符，小数点最多2位的正数
    isNumber: (rule, value, callback) => {
        if (!value) {
            return callback(new Error(rule.filedName + '不能为空'));
        }
        if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) {

            return callback(new Error('请输入最多两位小数，整数位最多7位的非负数'));

        }
        return callback();
    },
    //比较大小
    compare:(rule, value, callback)=>{
		if(rule.max && value>=rule.max){
			callback(new Error(rule.filedName+'应小于销售价'));	
		}
		if(rule.min && value<=rule.min){
			callback(new Error(rule.filedName+'应大于成本价'));	
		}
		return callback();
	},
    //0到100的数值
    rateNumber: (rule, value, callback) => {
      if (value.trim() == '') {
        return callback();
      }
      if (!/^\d+(\.\d+)?$/.test(value) || value < 0 || value > 100) {

        return callback(new Error('0到100的数字值'));

      }
      return callback();
    },
    //条形码数字字母，1-20个字符
    isBarCode:(rule, value, callback) => {
        if (value.trim() == '') {
            return callback();
        }
        if (!/^[\d\w]{1,20}?$/.test(value)) {

            return callback(new Error('请输入1-20个数字或字母'));

        }
        return callback();
    },
    isProductCode:(rule, value, callback)=>{
        if (value.trim() == '') {
            return callback();
          }
          if (!/^[\d\w]{2,50}?$/.test(value)) {
    
            return callback(new Error('请输入2-50个数字或字母'));
    
          }
          return callback();
    },
    //手机号验证
    isMobileNumber: (rule, value, callback) => {
        if (!value || value.trim() == '') {
          return callback();
        }
        if (!(/^1[34578]\d{9}$/.test(value))) {
  
          return callback(new Error('请输入正确的手机号'));
  
        }
        return callback();
    }
  },

};
