/**
 * @file validate.js
 * @synopsis  validate
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-09-22
 */
import Vue from 'vue'
Vue.prototype.$validate = {
	activityName:(rule, value, callback)=>{
		if(!/^.{0,20}$/.test(value)){
			callback(new Error('长度不能超过20个字符'));	
		}	
		callback();
	},
	desc:(rule, value, callback)=>{
		if(!/^.{0,100}$/.test(value)){
			callback(new Error('长度不能超过100个字符'));	
		}	
		callback();
	},
	length:(rule, value, callback)=>{
		if(rule.length && (value.toString()>rule.length)){
			callback(new Error(rule.message || '长度不能超过' + rule.length+'个字符'));	
		}
		callback();
	},
	priceLength:(rule, value, callback)=>{
		if(value.toString().length>10){
			callback(new Error(rule.message || '长度不能超过10个字符'));	
		}
		callback();
	},
	required:(rule, value, callback)=>{
		if(value.length==0){
			callback(new Error('输入不能为空'));	
		}
		callback();
	},
	positiveInteger:(rule, value, callback)=>{
		if(value===0){
			callback(new Error('请输入正整数'));
		}
		if(value && (!value || (value.length!=0 && (!/^\d{0,}$/.test(value)) || parseFloat(value) == '0'))){
			callback(new Error('请输入正整数'));	
		}
		callback();
	},
	positiveFloat:(rule, value, callback)=>{
		if(value && (value.length!=0 && (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) =='0'))){
			callback(new Error('请输入正浮点数'));	
		}
		callback();
	},
	discount:(rule, value, callback)=>{
		if(!/^\d{0,}$/.test(value) || !(value<100)){
			callback(new Error('输入应小于100'));	
		}
		callback();
	},
	compare:(rule, value, callback)=>{
		if(rule.max && (parseInt(value)>=parseInt(rule.max))){
			callback(new Error(rule.message || '输入应小于' + rule.max));	
		}
		if(rule.min && !(parseInt(value)>rule.min)){
			callback(new Error(rule.message || '输入应大于' + rule.min));	
		}
		callback();
	},
	stockValid:(rule, value, callback)=>{
		console.log();
		if((rule.row.limitNumPer * rule.row.groupNum)>rule.row.maxActStock){
			callback(new Error('限购数量*成团人数不能大于活动库存数'));	
		}
		callback();
	},
	//物流配送模块：0~9999999之间的数字，取小数点后2位
    twoDecimalNumber:(rule, value, callback) => {
		if (!value || value.trim() == '') {
			return callback();
		}
        if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)||value>9999999) {
  
          return callback(new Error('请输入最多两位小数且小于9999999'));
  
        }
        
        return callback();
    },
    //物流配送模块：0~9999999之间的数字，取小数点后3位
    threeDecimalNumber:(rule, value, callback) => {
        if (!value || value.trim() == '') {
          return callback();
        }
        if (!/^\d{1,7}(\.\d{1,3})?$/.test(value)||value>9999999) {
  
          return callback(new Error('请输入最多三位小数且小于9999999'));
  
        }
        return callback();
    },
   
};
