'use strict'
require('./index.css');
require('@/common/nav-simple/index.js');
require('@/common/nav/index.js');
require('@/common/header/index.js');
require('@/common/nav-side/index.js');

var _mm = require('util/mm.js');
var navSide = require('@/common/nav-side/index.js');


 // =====================================
//测试个人中心页 成功的效果为了 name为选中高亮
navSide.init({
	name:'user-center'
});
// =====================================
//request请求数据 未测试成功
// _mm.request({
// 	url: '/product/list.do?keyword=1',
// 	success: function(res){
// 		console.log('这是网络接口数据：',res);
// 	},
// 	error: function(errMsg){
// 		console.log('请求失败：',errMsg);
// 	}
// })
// =====================================
// 获取键值对   成功
//console.log(_mm.getUrlParam('page'));
// =====================================
//提供模板和数据   成功
// var html = '<div>{{ data }}</div>';
// var data = {
// 	data:'这是渲染过来的 在div里加了文字'
// }
// console.log(_mm.renderHtml(html,data));      