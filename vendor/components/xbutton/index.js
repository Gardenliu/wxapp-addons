Component({
    properties: {
        size:{
            type:String,
            observer: function(newVal){
                let size = !newVal?'':`gd-btn--${newVal}`;
                this.setData({
                    sizeClass:size
                })
            }
        }, //默认,large,small,mini
        type:{
            type:String,
            observer: function(newVal){
                let type = !newVal?'':`gd-btn--${newVal}`;
                this.setData({
                    typeClass:type
                })
            }
        },    //默认 , primary,danger,warn
        plain:Boolean,
        loading:Boolean,
        disabled:Boolean
    },
    data: {
        sizeClass:'',
        typeClass:''
    }
})