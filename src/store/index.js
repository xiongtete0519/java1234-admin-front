import {createStore} from 'vuex'
import router from '@/router'

export default createStore({
    state: {
        token: '', //token
        menuList: '',//菜单列表
        userInfo: '',  //用户信息
        perms:'',//权限字符列表
        hasRoutes: false,  //路由是否动态加载
        editableTabsValue: '/index', //选中的tabs
        editableTabs: [ //所有的tabs
            {
                title: '首页',
                name: '/index'
            }
        ]
    },
    getters: {
        GET_TOKEN: state => {
            let token=state.token
            return window.sessionStorage.getItem('token');
        },
        GET_MENULIST: state => {
            let menuList=state.menuList
            return JSON.parse(window.sessionStorage.getItem("menuList"))
        },
        GET_USERINFO: state => {
            let userInfo=state.userInfo
            return JSON.parse(sessionStorage.getItem("userInfo"))
        },
        GET_PERMS: state=>{
            let perms=state.perms
            return JSON.parse(sessionStorage.getItem('perms'))
        }

    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token=token
            window.sessionStorage.setItem("token", token)
        },
        SET_MENULIST: (state, menuList) => {
            state.menuList=JSON.stringify(menuList)
            sessionStorage.setItem("menuList", JSON.stringify(menuList))
        },
        SET_USERINFO: (state, userInfo) => {
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
        },
        SET_ROUTES_STATE: (state, hasRoutes) => {
            state.hasRoutes = hasRoutes
        },
        SET_PERMS:(state,perms)=>{
          sessionStorage.setItem("perms",JSON.stringify(perms));
        },
        ADD_TABS: (state, tab) => {
            if (state.editableTabs.findIndex(e => e.name === tab.path) === -1) {  //没找到
                state.editableTabs.push({
                    title: tab.name,
                    name: tab.path
                })
            }
            state.editableTabsValue = tab.path //选中
        },
        RESET_TABS:(state)=>{
            state.editableTabsValue='/index';
            state.editableTabs=[
                {
                    title:'首页',
                    name:'/index'
                }
            ]
        }

    },
    actions: {
        //安全退出
        logout() {
            window.sessionStorage.clear();
            console.log('触发清空sessionStorage')
            router.replace('/login')
        }
    },
    modules: {}
})
