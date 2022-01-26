<template>
  <v-app>
    <v-main>
      <UserMenu :user="this.authUser" />
      <transition name="slideFade" mode="out-in">
        <router-view/>
      </transition>
    </v-main>
  </v-app>
</template>

<script>

import UserMenu from "./views/Forum/User/UserMenu";
import firebase from 'firebase'
import 'firebase/auth'

export default {
  name: 'App',
  components: {
    UserMenu
  },
  data: () => ({
    authUser: ''
  }),
  created () {
    firebase.auth().onAuthStateChanged(user => {
      this.authUser = user
    })
  }
};
</script>
<style lang="scss">
* {
  box-sizing: border-box;
}

::selection {
  background: var(--green-dark);
  color: #ffffff;
}

:root {
  --yellow: #f4e206;
  --orange: #f45e06;
  --pink: #b700df;
  --purple: #684cdc;
  --blue: #139eda;
  --green-light: #dedede;
  --green-dark: #494949;
}

.slideFade-enter-active, .slideFade-leave-active {
  transition: opacity .5s
}

.slideFade-enter, .slideFade-leave-to {
  opacity: 0;
}

body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  font-family: Lato, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--green-dark);

  #app.fixed .section--masthead-text {
    padding-top: 62px;
  }

  .wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;

    @media (min-width: 1290px) {
      padding: 0;
    }
  }

  .button {
    padding: 10px 30px;
    border-radius: 30px;
    text-decoration: none;
    font-weight: bold;
    font-size: 18px;
    background: var(--text-a);
    color: var(--background-a);
    border: none;

    @media (min-width: 820px) {
      padding: 15px 35px;
      font-size: 20px;
    }
  }

  h1 {
    color: var(--text-a);
    font-size: 24px;
    animation: mastheadFadeIn 1s linear forwards;
    line-height: 36px;

    @media (min-width: 420px) {
      font-size: 34px;
      line-height: 51px;
    }

    @media (min-width: 820px) {
      font-size: 65px;
      line-height: 97px;
    }
  }

  form {

    fieldset {
      border: none;
      margin: 0;
      padding: 0;
      transition: 1s ease opacity;

      &:nth-of-type(1) {
        transition-delay: .1s
      }

      &:nth-of-type(2) {
        transition-delay: .2s
      }

      &:nth-of-type(3) {
        transition-delay: .3s
      }

      &:nth-of-type(4) {
        transition-delay: .4s
      }
    }

    .input-group {
      padding: 0 0 15px 0;
      position: relative;
    }

    label {
      text-transform: uppercase;
      font-size: 14px;
      font-weight: bold;
      display: inline-block;
      margin-top: 10px;
      margin-bottom: 20px;
      color: var(--text-a);
    }

    input, textarea {
      background: var(--background-b);
      padding: 15px 20px;
      margin: 0;
      outline: none;
      border: 1px solid #ccc;
      font-size: 18px;
      width: 100%;
      display: block;
      border-radius: 10px;
      color: var(--green-dark);
      font-family: Lato, sans-serif;

      &:focus {
        border: 1px solid #273849;
      }
    }

    textarea {
      height: 200px;
    }

    select {
      background: var(--background-b);
      color: #fff;
      width: 175px;
      padding: 16px;
      display: inline-block;
      margin: 0;
      -webkit-appearance: none;
      position: relative;
      min-width: 100%;
      font-size: 18px;
      padding: 15px 20px;
      border-radius: 10px;
      border: 1px solid var(text-b);

      &:focus {
        border: #273849;
        outline: none;
      }
    }

    .select-item-wrapper {
      display: block;
      position: relative;
    }

    .select-item-wrapper::after {
      content: '\25BE';
      right: 21px;
      top: 9px;
      position: absolute;
      color: var(--text-a);
      font-size: 24px;
    }

    .error, .success {
      text-align: center;
      width: 100%;
      display: block;
    }

    button {
      box-shadow: none;
      background: #273849;
      color: #fff;
      margin: 25px 0;
      transition: 1s ease opacity;
      transition-delay: 1.4s;
      border: none;
      -webkit-appearance: none;
      padding: 15px 35px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: bold;
      font-size: 20px;
      width: 100%;
    }
  }
}
</style>
