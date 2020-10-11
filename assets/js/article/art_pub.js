$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 定义分类的模板引擎,渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render()
            }
        })
    }

    // 实现基本裁剪效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 更换裁剪图片
    $('#coverFile').on('change', function (e) {
        // 获取文件的列表数组
        var file = e.target.files[0]
        // 判断用户是否选择了图片
        if (file.length === 0) {
            return layer.msg('请选择要裁剪的图片');
        }
        // 根据文件创建对应的 url 地址
        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = "已发布";
    $('#btnSave2').on('click', function () {
        art_state = "草稿"
    })

    // 为表单绑定 submit 提交事件
    $('#form_pub').on('submit', function (e) {
        e.preventDefault();
        // 基于 form 表单,快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        // 将状态追加到 fd 中
        fd.append('state', art_state);
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })
        // 将封面裁剪过后的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象 blob 存储到 fd 中
                fd.append('cover_img', blob);
                // 发起 ajax 请求实现文章发布功能
                publishArticle(fd);
            })


    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果提交的是FormDate格式的数据,必须天机以下两个属性
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // location.href = '/article/art_list.html';
                setTimeout(function () {
                    // console.log(window.parent.document.getElementById("art_list"));
                    window.parent.document.querySelector('#art_list').click();
                }, 1500);
            }
        })
    }
})