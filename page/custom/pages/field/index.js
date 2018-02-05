var verify = ()=>{

}
Page({
    data: {
      obj:{
        href:'/page/component/pages/view/view'
      },
        fields:[
            {
                name:'username',
                type:'input',
                verify:[
                    { required: true, message: 'Mailbox cannot be empty' },
                    { type: 'email', message: 'Incorrect email format'},
                    { validator:'',message: 'Incorrect email format'},
                ]
            }
        ]
    },

    onLoad: function () {

    },

    onShow: function() {
    },
})

