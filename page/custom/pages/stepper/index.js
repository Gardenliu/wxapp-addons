Page({
  data: {
    value:2
  },
  onShow() {

  },
    changeAction(ev){
        console.log('父级log',ev.detail.value)
    },
    tapAction(){
        console.log(this.data.value)
    }
})
