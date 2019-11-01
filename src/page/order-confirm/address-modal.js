'use strict'
var _mm = require('util/mm.js');
var _cities = require('util/cities/index.js');
var _address = require('service/address-service.js');
var templateAddressModal = require('./address-modal.string');

var addressModal = {// 显示函数
    show: function (option) {
        // option的绑定
        this.option = option;
        this.option.data = option.data || {};
        this.$modalWrap = $('.modal-wrap');
        // 渲染页面
        this.loadModal();
        // 绑定事件
        this.bindEvent();
    },
    // 事件绑定
    bindEvent: function () {
        var _this = this;
        // 省份和城市的联动
        this.$modalWrap.find('#receiver-province').change(function () {
            var selectedProvince = $(this).val();
            _this.loadCities(selectedProvince);
        });
        this.$modalWrap.find('.address-btn').click(function () {
            var receiverInfo = _this.getReceiverInfo(),
                        isUpdate = _this.option.isUpdate;
            // 使用新地址且验证通过
            if (!isUpdate && receiverInfo.status) {
                _address.save(receiverInfo.data, function (res) {
                    _mm.successTips('地址添加成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                        && _this.option.onSuccess(res);

                }, function (errMsg) {
                    _mm.errorTips(errMsg);
                });
                // 更新收件人地址且验证通过
            } else if (isUpdate && receiverInfo.status) {
                _address.update(receiverInfo.data, function (res) {
                    _mm.successTips('地址修改成功');
                    _this.hide();
                    typeof _this.option.onSuccess === 'function'
                        && _this.option.onSuccess(res);
                }, function (errMsg) {
                    _mm.errorTips(errMsg);
                });
            } else {
                // 验证不通过
                _mm.errorTips(receiverInfo.errMsg || '好像哪里不对了~');
            }
        });
        // 为了保证点击modal内容区的时候，不关闭弹窗
        this.$modalWrap.find('.modal-container').click(function (e) {
            // 阻止冒泡
            e.stopPropagation();
        });
        // 点击叉号或者蒙版区域，关闭弹窗
        this.$modalWrap.find('.close').click(function () {
            _this.hide();
        });
    },
    // 加载模型
    loadModal: function () {
        var addressModalHtml =
            // 渲染并实现表单回填
            _mm.renderHtml(templateAddressModal, {
                isUpdate: this.option.isUpdate,
                data: this.option.data
            });
        this.$modalWrap.html(addressModalHtml);
        // 加载省份
        this.loadProvince();
    },
    // 加载省份信息
    loadProvince: function () {
        var provinces = _cities.getProvinces() || [],
            $provinceSelect = this.$modalWrap.find('#receiver-province');
        $provinceSelect.html(this.getSelectOption(provinces));
        // 如果是更新地址，并且有省份信息，那么就做省份回填
        if (this.option.isUpdate && this.option.data.receiverProvince) {
            $provinceSelect.val(this.option.data.receiverProvince);
            //  加载城市
            this.loadCities(this.option.data.receiverProvince);
        }
    },
    // ==========================
    // 加载城市信息
    loadCities: function (provinceName) {
        var cities = _cities.getCities(provinceName) || [],
            $citySelect = this.$modalWrap.find('#receiver-city');
        $citySelect.html(this.getSelectOption(cities));
        // 如果是更新地址，并且有城市信息，那么就做城市回填
        if (this.option.isUpdate && this.option.data.receiverCity) {
            $citySelect.val(this.option.data.receiverCity);
        }
    },
    // =================
    // 获取select框的option选项，输入:array 输出：HTML
    getSelectOption: function (optionArray) {
        var html = '<option>请选择</option>';
        for (var i = 0, length = optionArray.length; i < length; i++) {
            html += '<option value="' + optionArray[i] + '">' +
                optionArray[i] + '</option>';
        }
        return html;
    },
    getReceiverInfo: function () {
        var receiverInfo = {},
            result = {
                status: false
            };
        // 输入框要加trim，选择框不用加trim
        // 下面是给receiverInfo动态赋值
        receiverInfo.receiverName = $.trim(this.$modalWrap.find('#receiver-name').val());
        receiverInfo.receiverProvince = this.$modalWrap.find('#receiver-province').val();
        receiverInfo.receiverCity = this.$modalWrap.find('#receiver-city').val();
        receiverInfo.receiverAddress = $.trim(this.$modalWrap.find('#receiver-address').val());
        receiverInfo.receiverPhone = $.trim(this.$modalWrap.find('#receiver-phone').val());
        receiverInfo.receiverZip = $.trim(this.$modalWrap.find('#receiver-zip').val());

        // 如果是会更新地址，则必须要有个id值
        if (this.option.isUpdate) {
            receiverInfo.id = this.$modalWrap.find('#receiver-id').val();
        }
        if (!receiverInfo.receiverName) {
            result.errMsg = '请输入收件人姓名';
        } else if (!receiverInfo.receiverProvince) {
            result.errMsg = '请输入收件人所在省份';
        } else if (!receiverInfo.receiverCity) {
            result.errMsg = '请输入收件人所在的城市';
        } else if (!receiverInfo.receiverAddress) {
            result.errMsg = '请输入收件人详细地址';
        } else if (!receiverInfo.receiverPhone) {
            result.errMsg = '请输入收件人手机号';
        } else {
            result.status = true;
            // 将数据封存到data中
            result.data = receiverInfo;
        }
        return result;
    },
    // 关闭弹窗
    hide: function () {
        this.$modalWrap.empty();
    },
    // =============};
}
module.exports = addressModal;

