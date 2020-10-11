$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + "-" + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 补零操作
    function padZero(n) {
        return n = n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象,将来请求数据的时候,将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, //每页显示条数
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的状态:已发布或草稿
    }

    initTable();

    // 获取 文章列表 数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 文章列表渲染的同时调用渲染分页的方法,根据 total总条数,动态渲染几页数据
                renderPage(res.total);
            }
        })
    }

    initCate();
    // 初始化 文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域
                form.render();
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        // 将获取的值添加到 q 中
        q.cate_id = cate_id;
        q.state = state;

        // 初始化文章列表
        initTable();
    })

    // 定义渲染分页的方法,当表格渲染完成以后,渲染分页
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号

            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时触发 jump 回调
            jump: function (obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值赋值给 q 参数对象中
                q.pagenum = obj.curr;
                // 把最新的条数赋值给 q 查询参数对象中
                q.pagesize = obj.limit;
                // 根据最新 q 获取对应的数据列表,并渲染表格
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 删除功能
    $('body').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length;
        // console.log(len);
        var id = $(this).attr('data-id');
        // 询问用户是否要删除数据
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    // 当数据删除完成后,需要判断当前页面中,是否还有剩余的数据,如果没有剩余数据后,页码值 -1, 再重新调用 initTable 方法
                    // 如果 len 的值为1, 说明删除后页面上就没有数据了,就页码值 -1,如果当前页面为第一页,就不减 1 了
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // if ($('.btn-delete').length === 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})