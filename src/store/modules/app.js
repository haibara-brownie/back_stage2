import { login as loginApi } from '@/api/login'
import router from '@/router'
import { setTokenTime } from '@/util/auth'

export default {
  namespaced: true,
  state: {
    token: localStorage.getItem('token') || '',
    sideBarType: true,
    lang: localStorage.getItem('lang') || 'zh'
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    changeSideBarType(state) {
      state.sideBarType = !state.sideBarType
    },
    changeLang(state, lang) {
      state.lang = lang
    }
  },
  actions: {
    // token 来自登录页面 点击登录之后，所以不如直接放到actions中
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo)
          .then((res) => {
            console.log(res)
            commit('setToken', res.token)
            setTokenTime()
            router.replace('/')
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 退出
    logout({ commit }) {
      commit('setToken', '')
      localStorage.clear()
      router.replace('/login')
    }
  }
}
