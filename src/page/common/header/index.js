'use strict'
require('./index.css');

var _mm = require('util/mm.js');

//通用页面头部
var header = {
	init:function(){
		this.onLoad();
		this.bindEvent();
	},
	//绑定事件的方法
	bindEvent:function(){
		var _this = this;
		//点击搜索按钮的时候做搜索提交
		$('.search-btn').click(function(){
			//做搜索提交
			_this.searchSubmit();
		})
		//如果输入的是回车，也做搜索提交  e是事件对象
		$('#search-input').keyup(function(e){
			if (e.keyCod === 13) {
				_this.searchSubmit();
			}
		})
	},
	//加载方法 
	onLoad:function(){
		//关键字回填效果
		var keyword = _mm.getUrlParam('keyword');
		//如果keyword存在，则回填至输入框
		if (keyword) {
			//在输入框中显示当前搜索框的keyword
			$('.search-input').val(keyword);
		}
	},
	searchSubmit:function(){
		var keyword = $.trim($('#search-btn').val());
		//如果提交的时候有keyword,正常跳转到list页
		if (keyword) {
			window.location.href = './list.html?keyword='+ keyword;
		}else{
			_mm.goHome();
		}
	}
}
header.init();