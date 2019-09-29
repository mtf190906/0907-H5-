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
        this.bindEvent()
    },
    //绑定事件的函数
    bindEvent:function(){
        var _this = this
        //登录按钮的点击事件
        $('#submit').click(function(){
            _this.submit()
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
        var _this = this;
        var formData = {
            username : $.trim($('#username').val()),
            password : $.trim($('#password').val())
        };
        var validateResult = _this.formValiDate(formData);
        if(validateResult.status){
            console.log('表单验证成功,继续服务器端验证!')
            _user.login(formData,function(res){
                 
                 window.location.href = _this.myddd() || './index.html';
                 
            },function(errMsg){
                formError.show(errMsg);
            });
        }else{
            console.log('表单验证失败!')
            formError.show(validateResult.msg);
        }
    },
    myddd:function(){
        var isHas = Boolean(_mm.getUrlParam('redirect'))
       // console.log(isHas)
        alert(isHas)
        if (isHas) {
            //alert(decodeURIComponent(_mm.getUrlParam('redirect')))
            return decodeURIComponent(_mm.getUrlParam('redirect'))
        }else{
           // alert('草拟吗')
            return null
        }
    },
    //表单验证的开发
    formValiDate : function(formData){
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
        //如果通过验证，则返回正确提示
        result.status = true;
        result.msg = '认证通过';
        //返回结果对象
        return result;
    }
};
$(function(){
    page.init();
});
       