import { createStore } from 'vuex'

export default createStore({
  state: {
    token:''
  },
  getters: {
    GET_TOKEN: state => {
      return sessionStorage.getItem("token")
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      // state.token = token
      sessionStorage.setItem("token", token)
    }
  },
  actions: {
  },
  modules: {
  }
})
