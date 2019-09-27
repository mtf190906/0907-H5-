'use strict';

require('./index.css');

var _mm = require('util/mm.js');
var templateIndex = require('./index.string');

//侧边导航
var navSide = {
	option:{
		name:'',
		//待动态渲染的项
		navList:[
			{
				name:'user-center',
				desc:'个人中心',
				href:'./user-center.html'
			},
			{
				name:'order-list',
				desc:'我的订单',
				href:'./order-list.html'
			},
			{
				name:'user-pass-update',
				desc:'修改密码',
				href:'./user-pass-update.html'
			},
			{
				name:'about',
				desc:'关于阿里妈妈',
				href:'./about.html'
			}
		]
	},
	init:function(option){
		//extend函数是jq中的合并选项函数
		//合并选项(只合并第一层的属性，如)
		//在调用init的时候传的参数option对
		$.extend(this.option,option);
		//开始渲染
		this.renderNav();
	},
	//渲染导航菜单
	renderNav:function(){
		//计算active数据
		for (var i = 0 , ilength = this.option.navList.length; i < ilength; i++) {
			if(this.option.navList[i].name === this.option.name){
				this.option.navList[i].isActive = true;  //临时添加isActive属性
			}
		}
		var navHtml = _mm.renderHtml(templateIndex,{
			navList:this.option.navList
		});
		$('.nav-side').html(navHtml);
	}
}

module.exports = navSide;