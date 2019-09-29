'use strict'
require('./index.css');
require('@/common/nav-simple/index.css');
require('node_modules/font-awesome/css/font-awesome.min.css');
var _user =require('service/user-service.js');
var _mm = require('util/mm.js');

  //表单里的错误提示
var formError = {
    show : function(errMsg){
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide : function(){
        $('.error-item').hide().find('.err-msg').text('');
    }
};
var page = {
    init:function() {
        this.bindEvent();
    },
    
    //绑定事件的函数
    bindEvent:function(){
        var _this = this
        //验证username，当username失去焦点的时候
        $('#username').blur(function(){
            var username = $.trim($(this).val());
            //如果username为空，直接返回不做验证
            if(!username){
                return
            }
            //异步验证用户名是否存在
            _user.checkUsername(username,function(){
                formError.hide()
            },function(errMsg){
                formError.show(errMsg)
               
            })
        })
        //注册按钮
        $('#submit').click(function(){
            _this.submit();
         })
        //如果按下回车键，也进行提交
        $('.user-content').keyup(function(e){
            //keyCode == 13 表示回车键
            if(e.keyCode === 13){
                _this.submit()
            }
        })
    },
    //提交表单的函数
    submit:function(){
        //从表单上获取的实际数据
        var formData = {
            username : $.trim($('#username').val()),
            password : $.trim($('#password').val()),
            passwordConfirm : $.trim($('#password-confirm').val()),
            phone : $.trim($('#phone').val()),
            email : $.trim($('#email').val()),
            question : $.trim($('#question').val()),
            answer : $.trim($('#answer').val()),
        };

        //表单验证结果
        var validateResult = this.formValidate(formData);
        //前端验证成功
        console.log(validateResult.status,88888888888,validateResult.msg);
        if(validateResult.status){
            console.log('表单验证成功,继续服务器端验证!');
            //提交
            _user.register(formData,function(res){
                // window.location.href = _mm.getUrlParam('redirect') || './index.html';
                window.location.href = './user-result.html?type=rigster';
            },function(errMsg){
                formError.show(errMsg);
            });
        }else{
            formError.show(validateResult.msg);
        }
    },

    //表单验证的开发
    formValidate : function(formData){
        var result = {
            status: false,
            msg:''
        };
        if(!_mm.validate(formData.username,'require')){
            result.msg = '用户名不能为空';
            return result;
        }
        if(!_mm.validate(formData.password,'require')){
            result.msg = '密码不能为空';
            return result;
        }
        if(formData.password.length<6){
            result.msg = '密码长度不能少于6位';
            return result;
        }
        if(formData.password !== formData.passwordConfirm){
            result.msg = '两次输入的密码不一致';
            return result;
        }
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
    },
};
$(function(){
    page.init();
});
       