// 每次调用 $.get() 或者 $.post() 或者 $.ajax() 的时候，都先调用 ajaxPrefilter 函数，可以拿到Ajax 的配置对象
$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);
})