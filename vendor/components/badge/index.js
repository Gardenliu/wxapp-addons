Component({
    properties: {
        num:{
            type:Number,
            value:null
        },
        max:{
            type:Number,
            value:100
        }
    },
    data:{
        showNum:''
    },
    ready:function () {
        this.getUpdata();
    },
    methods:{
        getUpdata(){
            let {num , max} = this.properties;
            let maxin = max === null ? 99 : max;
            let show = num > maxin ? `${maxin}+`:num;
            this.setData({
                showNum:show
            })
        }
    }
})