import {jumpUrl} from "../../../util/base.js";
Component({
    properties: {
        list: {
            type: Array,
            value: []
        }
    },
    data: {
        pageNum:12
    },
    ready:function () {
        let list = this.data.list,pageNum = 12;
        let result = [],first=[];//拆分
        for(let i=0,len=list.length;i<len;i+=pageNum){
            if(!i) first=list[i];
            result.push(list.slice(i,i+pageNum));
        }
        let hasChild=first.hasOwnProperty('child') && first.child.length>0;
        this.setData({
            classic:result,
            indicatorDots:result.length>1?true:false,
            subCate:hasChild?first.child:[],
            'curentSub.subTitle':hasChild && first.name,
            'curentSub.subId':hasChild && first.id,
        });
    },
    methods: {
        bindClassic:function (ev) {
            let { going } = this.data,{item}=ev.currentTarget.dataset;
            if(item.hasOwnProperty('child') && item.child.length>0){
                this.setData({
                    subCate: item.child,
                    'curentSub.subTitle':item.name,
                    'curentSub.subId':item.id
                });
            }else{
                if(going) return ;
                jumpUrl(item.url)
            }
        },
    }
})