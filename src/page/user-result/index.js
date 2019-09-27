'use strict'

require('./index.css');
require('../common/nav-simple/index.js');

var _mm = require('util/mm.js');
$(function(){
	//通过浏览器地址栏获取参数，然后拼接成一个class，再把class丢进
	//$()里面进行选择，结果是一个jq对象 
	var type = _mm.getUrlParam('type') || 'default',
	$element = $('.'+ type + '-success');
	//限时对应的提示元素
	$element.show();
})