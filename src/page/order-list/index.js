'use strict';

require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');

var _mm = require('util/mm.js');
var navSide = require('@/common/nav-side/index.js');
var _order = require('service/order-service.js');
var Pagination = require('util/pagination/index.js');
var templateIndex = require('./index.string');

//page逻辑部分
var page = {
    data:{
        listParam:{
            pageNum:1, //当前的页码数
            pageSize:2 //一页显示多少
        }
    },
    init:function(){

        this.onLoad(); 
    },
    onLoad:function(){
        //加载订单列表
       this.loadOrderList();
       //初始化左侧菜单
       navSide.init({
           name:'order-list'
       })
    },
    //加载订单列表
    loadOrderList:function(){
        var _this = this,
            orderListHtml = '',
            $listCon = $('.order-list-con');
        $listCon.html('<div calss="loading"></div>');
        _order.getOrderList(this.data.listParam,function(res){
            //这是渲染html
            orderListHtml = _mm.renderHtml(templateIndex,res);
            $listCon.html(orderListHtml);
            // 加载分页信息
            _this.loadPagination({
                hasPreviousPage:res.hasPreviousPage,
                prePage:res.prePage,
                hasNextPage:res.hasNextPage,
                pageNum:res.pageNum,
                pages:res.pages
            });
        },function(errMsg){
            //请求失败
            $listCon.html('<p class="err-tip">加载订单失败，请刷新后重试</p>')
        });
    },
    //加载分页信息
    loadPagination:function(pageInfo){
        var _this = this;
        this.Pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({},pageInfo,{
            container:$('.pagination'),
            onSelectPage:function(pageNum){
                _this.data.listParam.pageNum = pageNum;
                _this.loadOrderList();
            }
        }));
    }
};

$(function(){
    page.init();
});