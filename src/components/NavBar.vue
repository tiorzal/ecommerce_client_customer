<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand @click.prevent="goToMainPage">Pasar Terang</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="status === 'loggedIn'" @click.prevent="goToHistory">
          <b-icon icon="cart-check-fill"></b-icon> history
        </b-nav-item>
        <b-nav-item v-if="status === 'loggedIn'" @click.prevent="gotToCart">
          <b-icon icon="minecart-loaded" ></b-icon> cart
        </b-nav-item>
        <b-nav-item v-if="status === 'loggedIn'" @click.prevent="doLogOut">
          <b-icon icon="box-arrow-in-right"></b-icon> logout
        </b-nav-item>
        <b-nav-item v-if="status === 'loggedOut'" @click.prevent="showLoginModal">
          <b-icon icon="box-arrow-in-left" ></b-icon> login
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <LoginModal></LoginModal>
  </div>
</template>

<script>
import LoginModal from '../components/LoginModal'
export default {
  components: {
    LoginModal
  },
  name: 'NavBar',
  computed: {
    status () {
      return this.$store.state.status
    }
  },
  methods: {
    showLoginModal () {
      // console.log('ke klik')
      this.$bvModal.show('modal-login')
    },
    doLogOut () {
      this.$toasted.info('log out ?', {
        action: [
          {
            text: 'yes',
            onClick: (e, toastObject) => {
              this.$store.commit('setStatus', 'loggedOut')
              localStorage.clear()
              this.$toasted.success('byeeeee')
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
    gotToCart () {
      if (this.$router.history.current.path !== '/carts') {
        this.$router.push('/carts')
      }
      // this.$router.push('/carts')
    },
    goToMainPage () {
      if (this.$router.history.current.path !== '/') {
        this.$router.push('/')
      }
    },
    goToHistory () {
      if (this.$router.history.current.path !== '/history') {
        this.$router.push('/history')
      }
    }
  }
}
</script>

<style>

</style>
