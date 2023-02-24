import router from '@/router/index'
import store from '@/store'

//beforeEach 全局前置守卫
router.beforeEach((to,from,next)=>{
    const whiteList=[   //白名单
        '/login'
    ]
    let token=store.getters.GET_TOKEN;
    let hasRoutes=store.state.hasRoutes;
    let menuList=store.getters.GET_MENULIST;
    console.log(menuList)
    if(token){
        if(!hasRoutes){
            console.log('hasRoutes')
            bindRoute(menuList);
            store.commit('SET_ROUTES_STATE',true);
            console.log('hasRoutes Over')
        }
        next();
    }else{
        console.log('else')
        if(whiteList.includes(to.path)){    //如果在白名单里，放行
            console.log('白名单放行')
            next();
        }else{
            console.log('重定向到/login')
            next('/login');
        }
    }
});
//动态绑定路由
const bindRoute=(menuList)=>{
    // console.log('动态路由中menuList:',menuList)
    let newRoutes=router.options.routes;
    menuList.forEach(menu=>{
        if(menu.children){
           menu.children.forEach(m=>{
               //菜单转成路由
               let route=menuToRoute(m,menu.name);
               if(route){
                   newRoutes[0].children.push(route);//添加到路由管理
               }
           })
        }
    })
    //重新添加到路由
    newRoutes.forEach(route=>{
        router.addRoute(route);
    })
    console.log(router)
}

//菜单对象转成路由对象
const menuToRoute=(menu,parentName)=>{
    if(!menu.component){    //没有component就不用转了(核对下数据库)
        return null;
    }else{
        let route={
            name:menu.name,
            path:menu.path,
            meta:{
                parentName:parentName
            }
        }
        route.component=()=>import('@/views/'+menu.component+'.vue')
        return route
    }
}
