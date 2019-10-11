'use strict'
require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
require('util/swiper/swiper.min.css');
require('util/swiper/swiper.min.js');

var templateBanner = require('./banner.string');
var _mm = require('util/mm.js');
var navSide = require('@/common/nav-side/index.js');

var bannerHtml = _mm.renderHtml(templateBanner)
$('.banner-con').html(bannerHtml)
var mySwiper = new Swiper('.swiper-container',{
	autoplay:2000,
	autoplayDisableOnInteraction:false,
	pagination: '.swiper-pagination',
   //loop不影响自动轮播
   loop:true
})


// =====================================
//测试个人中心页 成功的效果为了 name为选中高亮
navSide.init({
	name: 'user-center'
});
