import Vue from 'vue'
import Storage from 'vue-ls'
import storage from '@/utils/storage'

Vue.use(Storage, {
  namespace: 'pro__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
})
Vue.prototype.$storage = storage
