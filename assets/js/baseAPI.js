// 每次调用 $.get() 或者 $.post() 或者 $.ajax() 的时候，都先调用 ajaxPrefilter 函数，可以拿到Ajax 的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);

    // 对需要权限的接口配置头信息
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token' || ''),
        }
    }

    // 登录拦截
    // 无论成功与否，都会执行 complete 回调函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制删除 token 值
            localStorage.removeItem('token')
            // 强制跳转到登陆页面
            location.href = '/login.html';
        }
    }

})