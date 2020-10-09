$(function () {
    // 表单验证
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度在 1~6 位之间';
            }
        }
    })
    
    // 2. 初始化用户基本信息
    initUserInfo();
    
    // 因为后面要用，所以封装为函数
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 使用 form.val() 将 res 中的值赋值到页面中
                // 在 form 表单中进行数据的渲染，表单必须通过 lay-filter 属性进行定义
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 3.重置表单数据
    $('#reset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    // 4.修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 调用父框架中的方法
                window.parent.getUserInfo();
            }
        })
    })

})