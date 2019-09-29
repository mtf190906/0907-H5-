//表示使用use5 的严格模式
'use strict'
var Hogan = require('hogan.js');

var conf = {
	serverHost:''
}
//$等价于 jquery 这里的ajax方法是jq自带的方法
var _mm = {
	request : function(param){
		//保存this ，防止this指针指向不明
		var _this = this;
		//数据请求的方法
		$.ajax({
			type:param.method || 'get',
			url : param.url || '',
			dataType : param.type || 'json',
			data : param.data || '',
			//请求成功 返回200 
			success: function(res)
			{
				if(0 === res.status){
					typeof param.success === 'function' && param.success(res.data,res.msg);
				}else if (10 === res.status){
					//没有登陆状态 统一去登陆
					_this.doLogin();
				}else if (1 === res.status){
					typeof param.error === 'function' && param.error(res.msg);
				}
			},
			// 返回404 503
			error : function(err){
				typeof param.error === 'function' && param.error(err.statusText);
			}
		});
	},
	//统一跳转到登陆页面
	doLogin: function(){
		window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
	},
	//获取服务器地址
	getServerUrl:function(path){
		return conf.serverHost + path;
	},
	getUrlParam: function(name){
		var reg =  new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
		var result = window.location.search.substr(1).match(reg);
		return result ? result[2]:null;
	},
	//渲染html的工具
	renderHtml: function(htmlTemplate,data){
		//Hogan 编译模板
		var template = Hogan.compile(htmlTemplate);
		// Hogan渲染模板
		var result = template.render(data);
		//将渲染结果返回
		return result;
	},
	successTips:function(msg){
		alert(msg || '操作成功');
	},
	errorTips:function(msg){
		alert(msg || '那里不对了');
	},
	validate:function(value,type){
		var value = $.trim(value) 
		//非空验证 比如密码提示的问题不能为空
		if('require' === type){
			//将value强转成Boolean类型的数据
			return !!value;
		}
		//手机号的验证
		if ('phone' === type){
			return /^1\d{10}$/.test(value);
		}
		//邮箱格式验证
		if('email' === type){
			return /^(\w)+(\.\w+)*@(\w)+((\.\w{2.3}){1,3})$/
		}
	},
	goHome:function(){
		window.location.href = './index.html'
	}
};
module.exports = _mm; //这导出 其他地方导入 不导出无法导入
