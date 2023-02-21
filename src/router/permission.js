import router from '@/router/index'
import store from '@/store'

//beforeEach 全局前置守卫
router.beforeEach((to,from,next)=>{
    const whiteList=[   //白名单
        '/login'
    ]
    let token=store.getters.GET_TOKEN
    if(token){
        next()
    }else{
        if(whiteList.includes(to.path)){    //如果在白名单里，放行
            next()
        }else{
            next('/login')
        }
    }


})
