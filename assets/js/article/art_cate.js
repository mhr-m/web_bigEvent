$(function () {
    var layer = layui.layer;
    var form = layui.form;
    // 文章类别列表
    initArtCateList();

    // 封装函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 调用模板引擎渲染数据
                var htmlStr = template('tpl-cate', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    // 给添加类别按钮一个点击事件,在弹出层中渲染 form 表单结构
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#tpl-form').html()
        });
    })

    // 提交文章分类的添加
    var indexAdd = null;
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 重新渲染数据
                initArtCateList();
                // 关闭弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 点击编辑按钮弹出编辑框,修改成功后关闭弹出层
    var indexEdit = null;
    $('tbody').on('click', '#btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        // 获取id值,根据id值获取对应分类的数据信息.将获取的信息填充到表单中
        var id = $(this).attr("data-id")
        // console.log(id);
        // 发请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 快速为表单填充数据
                form.val('form-edit', res.data);
            }
        })
    })

    // 点击按钮注册一个提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 重新渲染数据
                initArtCateList();
                // 关闭弹出层
                layer.close(indexEdit);
            }
        })
    })


    // 为删除按钮绑定一个点击事件
    $('tbody').on('click', '#btn_del', function () {
        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 重新渲染数据
                    initArtCateList();
                    // 关闭弹出层
                    layer.close(index);
                }
            })
            
        });
    })
})