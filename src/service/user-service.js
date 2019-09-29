'use strict'

var _mm = require('util/mm.js');
var _user = {
	//1 退出登录
	logout:function(resolve,reject){
		_mm.request({
			url:_mm.getServerUrl('/user/logout.do'),
			method:'POST',
			success:resolve,
			error:reject
		})
	},
	// 核对用户信息
	checkLogin:function(resolve,reject){
		_mm.request({
			url:_mm.getServerUrl('/user/get_user_info.do'),
			method:'POST',
			success:resolve,
			error:reject
		})
	},
	// 用户登录
	login:function(userInfo,resolve,reject){
		_mm.request({
			url: _mm.getServerUrl('/user/login.do'),
			// 09月29日--注销请求方式POST报405错误   不注销无错误但无法跳转  未解决！
			method:'POST',       
			data:userInfo,
			success:resolve,
			error: reject
		})
	},
	//检查用户名是否有效
	checkUsername:function(username,resolve,reject){
		_mm.request({
			url:_mm.getServerUrl('/user/check_valid.do'),
			data:{
				type: 'username',
				str: username
			},
			method:'POST',
			success:resolve,
			error:reject
		});
	},
	//用户注册
	register:function(userInfo,resolve,reject){
		_mm.request({
			url:_mm.getServerUrl('/user/register.do'),
			data:userInfo,
			method:'POST',
			success:resolve,
			error:reject
		});
	}
}
module.exports = _user;