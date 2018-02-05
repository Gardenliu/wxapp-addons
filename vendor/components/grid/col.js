Component({
    properties: {
        // 类似vue中的prop属性,也属于单向数据传递,通过自定义事件输出
        span: {
            type: String,
            value: '24'
        },
        offset:{
            type:String,
            value:'0'
        },
        colStyle:String,
        colClass:String,
    },
    data:{
        colClassData:''
    },
    ready(){
        this.data.colClass
    }
})