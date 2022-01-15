<template>
  <div class="view--add-post">
    <div class="view--add-post-content-wrapper">
      <div class="view--add-post-content">
        <a class="back" @click="$router.go(-1)">← Return to topic</a>
        <h1>Add a post in <span>{{ topic }}</span></h1>
        <div class="form-wrapper">
          <form id="form--add-post" class="form--add-post" @submit.prevent="addPost">
            <fieldset>
              <div class="input-group">
                <label>Post Title*</label>
                <input
                    type="text"
                    v-model="post.title"
                    placeholder="A consice title"
                />
              </div>
            </fieldset>
            <fieldset>
              <div class="input-group">
                <label>Post Content</label>
                <textarea
                    v-model="post.content"
                    placeholder="A detailed post"
                >
								</textarea>
              </div>
            </fieldset>
            <button>Submit</button>
            <span v-if="formStateError" class="error">All fields are required.</span>
            <span v-if="formStateSuccess" class="success">Request submitted successfully!</span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase';

export default {
  data () {
    return {
      formStateSuccess: false,
      formStateError: false,
      authUser: '',
      topic: '',
      route: '',

      post: {
        title: '',
        content: '',
        date: '',
        user: '',
        color: ''
      }

    }
  },
  methods: {
    animate() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        });
      });
      observer.observe(document.getElementById('form--add-post'))
    },
    addPost () {

      // Set post.user
      this.post.user = this.authUser.displayName


      // Set post.date
      let 	today = new Date(),
          todaysMonth = today.getMonth() + 1,
          todaysYear = today.getFullYear(),
          todaysDay = today.getDate()

      if (todaysDay < 10) {
        todaysDay = '0' + todaysDay
      }

      if (todaysMonth.toString().length < 2) {
        todaysMonth = '0' + todaysMonth
      }

      this.post.date = todaysMonth.toString() + todaysDay + todaysYear
      console.log(this.post.user.substring(0,1).toUpperCase())
      // Push post to database
      firebase.firestore().collection(this.route)
          .add(
              {
                title: this.post.title,
                content: this.post.content,
                date: this.post.date,
                user: this.post.user,
                color: this.post.color,
                userLetter: this.post.user.substring(0,1).toUpperCase(),
                comments: ''
              }
          )
          .catch(() => {
            this.formStateError = true
          })
          .then(() => {
            this.formStateSuccess = true
            this.formStateError = false
            this.formFieldNameError = false
            this.formFieldEmailError = false
            this.formFieldDetailsError = false
          })

      // Reset form data
      this.post.title = '';
      this.post.content = '';

      // Redirect to topic
      this.$router.push({ path: '/forum/' + this.route })

    }
  },
  mounted () {

    // Capitalize topic for frontend use
    let topic = this.$route.params.topic
    this.route = topic
    this.topic = topic[0].toUpperCase() + topic.slice(1)

    // Run animations
    this.animate()

    // Scroll to top on load
    window.scrollTo(0, 0)
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      this.authUser = user
    })
  }
}
</script>

<style lang="scss" scoped>
.view--add-post {
  background: var(--background-a);

  .view--add-post-content-wrapper {
    background: var(--background-a);

    .view--add-post-content {
      padding: 0 20px 50px;
      background: var(--background-b);

      @media (min-width: 420px) {
        padding: 0 40px 20px;
      }

      h1 {
        font-size: 28px;
        line-height: 42px;
        text-align: center;
        padding: 40px 0 0;
        margin-bottom: 40px;
        margin-top: 0;

        @media (min-width: 820px) {
          font-size: 48px;
          line-height: 72px;
        }
      }

      a.back {
        max-width: 1200px;
        margin: 0 auto;
        display: block;
        color: #fff;
        position: relative;
        top: 25px;
        left: 0;
        cursor: pointer;
        font-weight: bold;
        color: var(--green-light);
        text-align: center;
      }

      .form-wrapper {
        padding: 7px;
        border-radius: inherit;
        width: 100%;
        max-width: 614px;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        margin: 50px auto;
      }

      .form--add-post {
        background: transparent;
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
        background: var(--background-b);

        &.visible {
          fieldset {
            opacity: 1;
          }
          button {
            opacity: 1;
            transition-delay: .6s;
            width: auto;
          }
        }
      }
    }
  }
}
</style>