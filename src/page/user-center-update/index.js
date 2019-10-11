'use strict';
require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var navSide = require('@/common/nav-side/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');
var templateIndex = require('./index.string');

var page = {
    init: function(){
      this.onLoad();
      this.bindEvent();
    },
    onLoad: function(){
      //初始化左侧菜单
      navSide.init({
         name: 'user-center-update'
      });
      //加载用户信息
      this.loadUserInfo();
    },
    bindEvent:function(){
      var _this = this;
      $(document).on('click','.btn-submit',function(){
        var userInfo = {
          phone:$.trim($('#phone').val()),
          email:$.trim($('#email').val()),
          question:$.trim($('#question').val()),
          answer:$.trim($('#answer').val())
        },
      //前端字段验证
        validateResult = _this.validateForm(userInfo);
        if(validateResult.status){
          //更改用户信息
          _user.updateUserInfo(userInfo,function(res,msg){
            _mm.successTips(msg)
            window.location.href = './user-result.html?type=user-center-update'
          },function(errMsg){
            //比如 Internal Server Error
            _mm.errorTips(errMsg)
          });
        }else{
          _mm.errorTips(validateResult.msg)
        }
      })
    },
    loadUserInfo:function(){
        var userHtml = ''
        _user.getUserInfo(function(res){
            userHtml = _mm.renderHtml(templateIndex,res);
            $('.panel-body').html(userHtml);
        },function(errMsg){
            _mm.errorTips(errMsg);
        })
    },
    //表单验证的开发
    validateForm : function(formData){
        var result = {
            status: false,
            msg:''
        };
        if(!_mm.validate(formData.phone,'phone')){
            result.msg = '手机号格式不正确';
            return result;
        }
        if(!_mm.validate(formData.email,'email')){
            result.msg = '邮箱格式不正确';
            return result;
        }
        if(!_mm.validate(formData.question,'require')){
            result.msg = '密码提示问题不能为空';
            return result;
        }
        if(!_mm.validate(formData.answer,'require')){
            result.msg = '密码提示问题的答案不能为空';
            return result;
        }
        //如果通过验证，则返回正确提示
        result.status = true;
        result.msg = '认证通过';
        //返回结果对象
        return result;
      }
}
$(function(){
    page.init();
})
