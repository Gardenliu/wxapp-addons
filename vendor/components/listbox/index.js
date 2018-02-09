Component({
    properties: {
        type:String, //horizontal: 竖排;vertical:横排
        listData: {
            type: Array,
            value: [],
        }
    },
    data: {
        // 这里是一些组件内部数据
        mydata:1
    },
    ready:function () {
        console.log('组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息')
    },
    methods: {

    }
})