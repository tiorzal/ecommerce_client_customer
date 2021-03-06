import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../config/axiosins'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    products: [],
    carts: [],
    totalPrice: 0,
    histories: []
  },
  mutations: {
    setStatus (state, payload) {
      // console.log(payload)
      state.status = payload
    },
    setProducts (state, payload) {
      state.products = payload
    },
    setCarts (state, payload) {
      state.carts = payload
    },
    setTotalPrice (state, payload) {
      state.totalPrice = payload
    },
    setHistories (state, payload) {
      state.histories = payload
    }
  },
  actions: {
    login (context, payload) {
      // console.log(payload)
      axios({
        url: '/logincustomer',
        method: 'post',
        data: payload
      })
        .then(({ data }) => {
          // console.log(data)
          localStorage.setItem('access_token', data.access_token)
          context.commit('setStatus', 'loggedIn')
          Vue.toasted.success('welcome ' + payload.email.split('@')[0], { icon: 'crown' })
          if (router.history.current.name !== 'Home') {
            router.push('/')
          }
        })
        .catch(err => {
          // console.log(err.response.data.message)
          Vue.toasted.error(err.response.data.message)
        })
    },
    register (context, payload) {
      // console.log(payload)
      axios({
        url: '/register',
        method: 'post',
        data: payload
      })
        .then(({ data }) => {
          // console.log(data)
          router.push('/')
        })
        .catch(_ => {
          // console.log(err)
        })
    },
    fetch (context, payload) {
      axios({
        url: '/products',
        method: 'get'
      })
        .then(({ data }) => {
          // console.log(data)
          context.commit('setProducts', data.products)
        })
        .catch(_ => {
          // console.log(error)
        })
    },
    fetchCart (context, payload) {
      axios({
        url: '/carts',
        method: 'get',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then(({ data }) => {
          const { carts, totalPrice } = data
          // console.log(carts, totalPrice)
          context.commit('setCarts', carts)
          context.commit('setTotalPrice', totalPrice)
        })
        .catch(_ => {
          // console.log(err)
        })
    },
    changeQuantity (context, payload) {
      // console.log(payload)
      axios({
        url: '/carts',
        method: 'post',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: payload
      })
        .then(_ => {
          context.dispatch('fetchCart')
        })
        .catch(err => {
          // console.log(err.response.data)
          Vue.toasted.error(err.response.data.message)
        })
    },
    deleteCart (context, payload) {
      // console.log(payload)
      Vue.toasted.error('are you sure ?', {
        action: [
          {
            text: 'yes',
            onClick: (e, toastObject) => {
              axios({
                url: '/carts',
                method: 'delete',
                headers: {
                  access_token: localStorage.getItem('access_token')
                },
                data: payload
              })
                .then(_ => {
                  context.dispatch('fetchCart')
                  Vue.toasted.success('deleted')
                })
                .catch(_ => {
                  // console.log(err)
                })
            }
          },
          {
            text: 'no',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            }
          }
        ]
      })
    },
    checkout (context, payload) {
      // console.log('hit')
      axios({
        url: '/carts',
        method: 'put',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then(_ => {
          context.dispatch('fetchCart')
          Vue.toasted.success('success')
        })
        .catch(_ => {
          context.dispatch('fetchCart')
          // console.log(err)
          Vue.toasted.error('something went wrong')
        })
    },
    fetchHistories (context, payload) {
      axios({
        url: '/carts/histories',
        method: 'get',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then(({ data }) => {
          // console.log(data)
          context.commit('setHistories', data)
        })
        .catch(_ => {
          // console.log(error)
        })
    }
  },
  modules: {
  }
})
