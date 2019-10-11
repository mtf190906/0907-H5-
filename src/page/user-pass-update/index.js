'use strict';
require('./index.css');
require('@/common/nav/index.js');
require('@/common/header/index.js');
var navSide = require('@/common/nav-side/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');

var page = {
    init: function(){
      this.onLoad();
      this.bindEvent();
    },
    onLoad: function(){
      //初始化左侧菜单
      navSide.init({
         name: 'user-pass-update'
      });
    },
    bindEvent:function(){
      var _this = this;
      $(document).on('click','.btn-submit',function(){
        var userInfo = {
          password:$.trim($('#password').val()),
          passwordNew:$.trim($('#password-new').val()),
          passwordConfirm:$.trim($('#password-confirm').val())
        },
      //前端字段验证
        validateResult = _this.validateForm(userInfo);
        if(validateResult.status){
          //更改用户密码
          _user.updatePassword({
           passwordOld:userInfo.password,
           passwordNew:userInfo.passwordNew
          },function(res,msg){
            //比如 Internal Server Error
            _mm.successTips(msg)
            window.location.href='./user-result.html?type=user-pass-update'
          },function(errMsg){
            _mm.errorTips(errMsg)
          });
        }else{
          _mm.errorTips(validateResult.msg)
        }
      })
    },
    //表单验证的开发
    validateForm : function(formData){
        var result = {
            status: false,
            msg:''
        };
        if(!_mm.validate(formData.password,'require')){
            result.msg = '原密码不能为空';
            return result;
        }
        if(!formData.passwordNew || formData.passwordNew.length < 6){
            result.msg = '密码长度不得少于6位';
            return result;
        }
        if(formData.passwordNew !== formData.passwordConfirm){
            result.msg = '两次输入的密码不一致';
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