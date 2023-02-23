import store from "@/store";
//按钮权限判断
export const myFunc={
    methods: {
        hasAuth(perm) {
            let perms = store.getters.GET_PERMS;
            return perms.indexOf(perm) >= 0
        }
    }
}
