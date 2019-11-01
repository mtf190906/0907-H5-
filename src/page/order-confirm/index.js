'use strict'
require('./index.css')
require('@/common/nav/index.js')
require('@/common/header/index.js')
var _mm = require('util/mm.js');
var _order = require('service/order-service.js');
var _address = require('service/address-service.js');
var templateAddress =require('./address-list.string');
var templateProduct =require('./product-list.string');
var addressModal =require('./address-modal.js');
var page = {
	// 页面的初始化
	data :{
		selectedAddressId:null
	},
	init: function(){
		this.onLoad();
		this.bindEvent();
	},
	onLoad: function(){
		this.loadAddressList();
		this.loadProductList();
	},
	bindEvent: function(){

	},
	// 加载地址列表函数
	loadAddressList: function(){
		var _this = this;
		$('.address-con').html('<div class="loading"></div>');
		// 获取地址列表
		_address.getAddressList(function(res){
			// console.log(res)
			var addressListHtml = _mm.renderHtml(templateAddress,res);
			$('.address-con').html(addressListHtml);
		}, function(errMsg){
			$('.address-con').html('<p class="err-tip">地址加载失败，请刷新后重试</p>');
		})
	},
	loadProductList : function(){
        var _this =this;
        $('.product-con').html('<div class="loading"></div>');
        // 获取商品列表
        _order.getProductList(function(res){
			var productListHtml = _mm.renderHtml(templateProduct,res);
			console.log(res)
            $('.product-con').html(productListHtml);
        },function(errMsg){
            $('.product-con').html('<p class="err-tip">商品信息加载失败，请刷新后重试</p>');
        })
    },
    bindEvent : function(){
        var _this = this;
        // 地址的选择
        $(document).on('click','.address-item',function(){
            $(this).addClass('active')
                .siblings('.address-item').removeClass('active');
                // 先记住id，然后在加载的时候再把状态回填回去
                _this.data.selectedAddressId = $(this).data('id')
        });
        // ==========================
        // 订单的提交
        $(document).on('click','.order-submit',function(){
			var shippingId = _this.data.selectedAddressId;
			// 如果地址已经选好
            if(shippingId){
                _order.createOrder({
                    shippingId:shippingId
                },function(res){
                    window.location.href = './payment.html?orderNumber=' + res.orderNo;
                },function(errMsg){
                    _mm.errorTips(errMsg);
                });
            }else{
                _mm.errorTips('请选择地址后再提交')
            }
        });
        // ===================================
        // 地址的添加
        $(document).on('click','.address-add', function(){
            addressModal.show({
                isUpdate : false,
                onSuccess : function(){
                    _this.loadAddressList();
                }
            });
        });
        // ========================
        // 地址的编辑
        $(document).on('click','.address-update',function(e){
            // 问题一，阻止事件的冒泡
            e.stopPropagation();
            var shippingId =$(this).parents('.address-item').data('id');
            _address.getAddress(shippingId,function(res){
                // 如果成功，就打开Modal窗
                addressModal.show({
                    isUpdate : true,
                    data:res,
                    onSuccess : function(){
                        _this.loadAddressList();
                    }
                });
            },function(errMsg){
                // 如果失败，打印失败信息
                _mm.errorTips(errMsg);
            })
        });
        // ===========================
        // 地址的删除
        $(document).on('click','.address-deleta',function(e){
            e.stopPropagation();
            var id = $(this).parents('.address-item').data('id');
            if(window.confirm('确定要删除该地址吗？')){
                _address.deleteAddress(id,function(res){
                    _this.loadAddressList();
                },function(errMsg){
                    _mm.errorTips(errMsg);
                })
            }
        });
    },
    // 处理地址列表选中的状态
    addressFilter:function(data){
        $('.address-con').html('<div class="loading"></div>');
        // 判断是否有选中的id,如果有才折腾，没有就不折腾了
        if(this.data.selectedAddressId){
            // 标记位
            var selectedAddressIdFlag = false;
            for (var i = 0,length = data.list.length; i < length; i ++){
                // 如果选中的地址被遍历到了
                if(data.list[i].id == this.data.selectedAddressId){
                    // 表示该地址需要渲染成选中
                    data.list[i].isActive = true;
                    selectedAddressIdFlag = true;
                }
            }
            // 如果以前选中的四肢已经不再列表里了，那么将其设置为选中
            if(!selectedAddressIdFlag){
                this.data.selectedAddressId = null;
            }
        }
    },
}
$(function(){
    page.init();
})