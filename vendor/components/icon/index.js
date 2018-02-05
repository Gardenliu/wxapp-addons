/**
 * icon插件
 */
Component({
    properties: {
        // 类似vue中的prop属性,也属于单向数据传递,通过自定义事件输出
        type: String,
        color: {
            type: String,
            value: '#333'
        },
        size: {
            type: String,
            value: '12'
        }
    }
})