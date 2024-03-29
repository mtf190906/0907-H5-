'use strict';
require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var _mm = require('util/mm.js');
var templateIndex = require('./index.string');
var _product = require('service/product-service.js');
var Pagination = require('util/pagination/index.js')
var page = {
      data:{
            listParam:{
                  keyword:_mm.getUrlParam('keyword') || '',
                  categoryId:_mm.getUrlParam('categoryId') || '',
                  orderBy:_mm.getUrlParam('orderBy') || 'default',
                  pageNum:_mm.getUrlParam('pageNum') || 1,
                  pageSize:_mm.getUrlParam('pageSize') || 10
            }
      },
      // 初始化
      init: function () {
            this.onLoad();
            this.bindEvent();
      },
      // 加载数据
      onLoad: function () {
            this.loadList();
      },
      bindEvent: function () {
            var _this = this;
            //排序的点击事件
            $('.sort-item').click(function(){
                  //缓存变量
                  var $this = $(this);
                  //每次点击之后，都应该将页数初始化为1
                  _this.data.listParam.pageNum =1;
                  //点击默认排序
                  if($this.data('type')==='default'){
                        //已经是active样式
                        if($this.hasClass('active')){
                              return
                        }else{
                              $this.addClass('active').siblings('.sort-item')
                              .removeClass('active asc desc');
                              _this.data.listParam.orderBy = 'default';
                        }   
                        //点击价格排序
                  }else if($this.data('type') === 'price'){
                        //active  class 的处理
                        $this.addClass('active');
                        //升序降序的处理
                        if(!$this.hasClass('asc')){
                              $this.addClass('active').siblings('.sort-item')
                              .removeClass('active asc desc');
                              $this.addClass('asc').removeClass('desc');
                              //价格排序
                              _this.data.listParam.orderBy = 'price_asc';
                        }else{
                              $this.addClass('desc').removeClass('asc');
                              //价格降序
                              _this.data.listParam.orderBy = 'price_desc'
                        }
                  }
                  _this.loadList();
            })
           
      },
      // 加载list数据
      loadList: function () {
            var _this = this,
            listHtml = '',
            listParam = this.data.listParam,
            $pListCon = $ ('.p-list-con');
            //先加载loading
            $pListCon.html('<div class="loading"></div>')
            //categoryId 和keyword是共存的，所以删掉其中一个
            //删除参数中不必要的字段
            listParam.categoryId ? (delete listParam.keyword) : (delete listParam.categoryId)
            //请求接口
            _product.getProductList(listParam,function(res){
                  for(var i=0; i<res.list.length;i++){
                        if(!res.list[i].mainImage){
                              res.list.splice(i,1);
                        }
                  }
            //渲染页面
            listHtml = _mm.renderHtml(templateIndex,{
                  list : res.list
            });
            //等加载完毕的时候，再覆盖掉
            $pListCon.html(listHtml)

             _this.loadPagination({
                  hasPreviousPage : res.hasPreviousPage,
                  prePage : res.prePage,
                  hasNextPage : res.hasNextPage,
                  nextPage : res.nextPage,
                  pageNum : res.pageNum,
                  pages : res.pages
            })
            },function(errMsg){
                  _mm.errorTips(errMsg);
            })
            
      },
      // 加载分页信息
      loadPagination:function(pageInfo){
            var _this = this;
            this.Pagination ? '' : (this.Pagination = new Pagination());
            this.Pagination.render($.extend({},pageInfo,{
                  container : $('.pagination'),
                  onSelectPage: function(pageNum){
                        _this.data.listParam.pageNum = pageNum;
                        _this.loadList();
                  }
            }))
      }
}
$(function(){
      page.init();
})
