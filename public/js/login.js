$(document).ready(()=>{

    "use strict"
    const email = $("#email")
    const pass = $("#password")
    $("form").click(e =>{
        e.preventDefault()
   
    $("#loginBtn").click(async () =>{
        try{
            const data = await axios.post('/vendor/auth/user/auth',{
                email:email.val(),
                password:pass.val()
            })
            console.log(data)
            const token = data.data.token
            const user = data.data.user
     
            console.log("Bearer " + token)

            const __data = await axios.post('/vendor/auth/login',{
                email:email.val(),
                password:pass.val(),
                Headers:{
                     "Authorization" : "Bearer john sunday" 
                },

            })
            window.location = 'home.html'
        }catch(error){


            console.log(error)
        //     console.log(error.response.data.msg)
        //     $('#error').text(error.response.data.msg).show(1000).hide(6000)
        }
            
        
    
        
        
        
    })
})
})