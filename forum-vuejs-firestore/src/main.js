import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'
import firebaseConfig from './plugins/firebase-config'

Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig);
firebase.auth().languageCode = 'fr';

const database = firebase.firestore();
Vue.prototype.$db = database;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
