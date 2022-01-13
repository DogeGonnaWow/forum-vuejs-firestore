<template>
  <div class="view--forum">
    <div v-if="this.authUser && this.authUser.isAnonymous === false">
      <div class="forum-topics">
        <h2>Forum</h2>
        <ul>
          <li>
            <router-link to="forum/general">
              <div class="category">
                <div class="category--details">
                  <div class="category--details-title">General</div>
                  <div class="category--details-description">Talk about what you want</div>
                </div>
                <div class="category--stats">
                  <div class="category--stats-posts">
                    <v-icon style="font-size: 1.5em;margin:3px;" color="black">description</v-icon>
                    <span>{{ generalPostCount }}</span>
                  </div>
                  <div class="category--stats-replies">
                    <v-icon style="font-size: 1.5em;margin:3px;" color="black">question_answer</v-icon>
                    <span>{{ generalPostReplyCount }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <div class="user-auth--error-message" v-if="emailIsInvalid">A valid email address is required.</div>
      <div class="user-auth--error-message" v-if="usernameIsTaken">This username already exists.</div>
      <div class="user-auth--error-message" v-if="usernameIsInvalid">You must choose a username.</div>
      <div class="user-auth--error-message" v-if="signInInvalid">E-mail or password invalid.</div>
      <div class="user-auth--signup" v-if="registered === false">
        <div class="user-auth--form">
          <form @submit.prevent="register">
            <h1>Register</h1>
            <label for="email">Username</label>
            <input type="text" v-model="username" placeholder="Username" />
            <label for="email">Email</label>
            <input type="email" v-model="email" placeholder="account@domain.com" />
            <label for="password">Password</label>
            <input type="password" v-model="password" placeholder="••••••••••" />
            <div>
              <button>Submit</button>
              <p>Already have an account? <a href="#" @click="registered = true">Sign in</a></p>
            </div>
          </form>
        </div>
      </div>
      <div class="user-auth--signin" v-else>
        <div class="user-auth--form">
          <form @submit.prevent="signIn">
            <h1>Sign in</h1>
            <label for="email">Email</label>
            <input type="email" v-model="email" placeholder="account@domain.com" />
            <label for="password">Password</label>
            <input type="password" v-model="password" placeholder="••••••••••" />
            <div>
              <button>Submit</button>
              <p>Don't have an account? <a href="#" @click="registered = false">Register</a></p>
              <p><a href="#" @click="resetPassword(email)">Forgot Password</a></p>
              <p v-if="passwordHasBeenReset">Password reset email has been sent!</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

import 'firebase/database'
import 'firebase/auth'

	export default {
		data () {
			return {
        authUser: null,
        registered: true,

        users: [],
        user: '',
        username: '',
        usernameIsTaken: false,
        usernameIsInvalid: false,

        email: '',
        emailIsInvalid: false,
        emailErrorMessage: '',

        password: '',
        newPassword: null,
        passwordHasBeenReset: false,
        passwordIsInvalid: false,
        passwordErrorMessage: '',

        signInInvalid: false,
        signInErrorMessage: '',

        generalPosts: [],
        generalPostReplyCount: 0,

			}
		},
		methods: {
			register () {
				let match = false
				for (let user in Object.entries(this.users)) {
					if (Object.entries(this.users)[user][1]['username'] === this.username) {
						match = true
					}
				}
				if (this.username === '' || this.email === '' || this.password === '') {
					this.signInInvalid = true
					this.usernameIsTaken = false
					this.usernameIsInvalid = false
				}
				else if (match === true) {
					this.signInInvalid = false
					this.usernameIsTaken = true
					this.usernameIsInvalid = false
				} else if (this.username === '') {
					this.signInInvalid = false
					this.usernameIsInvalid = true
					this.usernameIsTaken = false
				} else {
					this.signInInvalid = false
					this.usernameIsTaken = false
					this.usernameIsInvalid = false
					firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
						.then((user) => {
							this.registerUserName(this.username, user.user.uid)
						})
						.catch(error => {
							this.signInInvalid = true
							this.signInErrorMessage = error.message
						})
				}
			},
			registerUserName(username, uid) {
				firebase.firestore().collection('users').doc(uid).set({username: username}).then(() => {
          this.authUser.updateProfile({ displayName: username})
              .catch(error => {
                console.log(error)
              })
        })
					.catch(error => {
						console.log(error)
					});

			},
			signOut () {
				firebase.auth().signOut()
			},
			signIn() {
				firebase.auth().signInWithEmailAndPassword(this.email, this.password)
					.catch(error => {
						this.signInInvalid = true
						this.signInErrorMessage = error.message
					})
			},
			resetPassword(email) {
				if (email === '') {
					this.emailIsInvalid = true
				} else {
					const auth = firebase.getAuth();
					this.sendPasswordResetEmail(auth, email)
					.then(() => {
						this.passwordHasBeenReset = true
						this.emailIsInvalid = false
					})
					.catch((error) => {
						console.log(error)
					});
				}
			}
		},
		computed: {
			generalPostCount () {
				return Object.keys(this.generalPosts).length
			},
		},
		watch: {
			generalPosts: function(posts) {
				Object.keys(posts).forEach((post) => {
					this.generalPostReplyCount += Object.keys(posts[post]['comments']).length
				})
			}
		},
		mounted () {
			window.scrollTo(0, 0)
		},
		created () {
			firebase.auth().onAuthStateChanged(user => { 
				this.authUser = user;
				console.log(this.authUser)
				if (user) {
					firebase.firestore().collection('users').onSnapshot( snapshot => {
						if (snapshot) {
              snapshot.forEach(users => {
                this.users.push(users.data());
              });
						}
					})
					firebase.firestore().collection('general').onSnapshot(snapshot => {
            if (snapshot) {
              snapshot.forEach(generalPost => {
                this.generalPosts.push(generalPost.data());
              });
            }
					})
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.view--forum {
		padding: 0 20px 0;

		@media (min-width: 420px) {
			padding: 0 40px;
		}

		h1 {
			font-size: 48px;
			line-height: 72px;
			text-align: center;
			margin-bottom: 50px;
			color: #273849;
		}

		a {
			color: #273849;
			text-decoration: none;
			font-weight: bold;
		}

		.user-auth--error-message {;
			width: calc(100% - 80px);
			position: absolute;
			top: -10px;
			padding: 35px;
			border-radius: 4px;
			text-align: center;
			opacity: 0;
			color: #d5445e;
			animation: errorMessageFadeIn .15s linear forwards;
			font-weight: bold;
		}

		@keyframes errorMessageFadeIn {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}

		.user-auth--signin, .user-auth--signup {
			padding-top: 50px;
		}

		.user-auth--form {
			padding: 7px;
			width: 100%;
			max-width: 614px;
			position: relative;
			overflow: hidden;
			border-radius: 10px;
			margin: 25px auto;

			form {
				max-width: 600px;
				padding: 20px;
				border-radius: 0;
				color: var(--green-dark);
				margin: 0 auto;

				&:first-of-type {
					border-radius: 8px 8px 0 0;
				}

				&:last-of-type {
					border-radius: 0 0 8px 8px;
				}

				input {
					margin-bottom: 20px;
				}

				div {
					text-align: center;
				}
			}
		}
	}

	.forum-topics {

		h2 {
			font-size: 2em;
			line-height: 36px;
			color: var(--green-dark);
			max-width: 960px;
			margin: 0 auto;
			padding: 10px 0 0;
			text-align: left;

			@media (min-width: 820px) {
				font-size: 2em;
				line-height: 40px;
				padding: 20px 0 0;
			}
		}
		
		ul {
			margin: 0 auto;
			padding: 0 0 50px;
			list-style-type: none;
			max-width: 960px;

			@media (min-width: 820px) {
				padding: 25px 0 50px;
			}

			li {
				a {
					text-decoration: none;
					position: relative;
					display: block;
					animation: .25s categoryFadeIn linear forwards;
					opacity: 0;

					@keyframes categoryFadeIn {
						0% {
							opacity: 0;
						}
						100% {
							opacity: 1;
						}
					}
				}

				&:nth-of-type(1) a {
					animation-delay: .0s;
				}

				&:nth-of-type(2) a {
					animation-delay: .1s;
				}

				&:nth-of-type(3) a {
					animation-delay: .2s;
				}

				&:nth-of-type(4) a {
					animation-delay: .3s;
				}

				&:nth-of-type(5) a {
					animation-delay: .4s;
				}

				&:nth-of-type(6) a {
					animation-delay: .5s;
				}

				&:nth-of-type(7) a {
					animation-delay: .6s;
				}

				&:nth-of-type(8) a {
					animation-delay: .7s;
				}

				&:nth-of-type(9) a {
					animation-delay: .9s;
				}

				&:nth-of-type(10) a {
					animation-delay: 1s;
				}

				&:nth-of-type(11) a {
					animation-delay: 1.1s;
				}

				&:nth-of-type(12) a {
					animation-delay: 1.2s;
				}
			}

			.category {
				background: #ffffff;
				padding: 20px 20px;
				margin: 20px 0;
				border-radius: 5px;
				box-shadow: 0 0 25px rgb(0 0 0 / 10%);
				display: flex;
				flex-flow: row wrap;
				justify-content: space-between;
				z-index: 2;
				position: relative;

				.category--details {
					.category--details-title {
						font-size: 1.2em;
						line-height: 30px;
						font-weight: bold;
						color: var(--green-dark);
					}

					.category--details-description {
						font-size: 0.8em;
						line-height: 24px;
						color: #777777;
						font-weight: lighter;
						max-width: 220px;
						margin-top: 5px;

						@media (min-width: 820px) {
							max-width: 100%;
							margin-top: 0;
						}
					}
				}

				.category--stats {
					display: flex;
					width: 20%;
					flex-direction: column;
					justify-content: flex-end;
					align-items: flex-end;

					@media (min-width: 820px) {
						justify-content: center;
						align-items: center;
						width: auto;
						flex-direction: row;
					}

					.category--stats-posts, .category--stats-replies {
						display: flex;
						margin: 10px 0;

						@media (min-width: 820px) {
							margin: auto;
						}
					}

					svg {
						width: 35px;
						fill: var(--green-dark);
						margin-right: 15px;

						@media (min-width: 820px) {
							margin-left: 25px;
						}
					}

					span {
						color: var(--text-a);
						text-decoration: none;
						font-size: 20px;
						line-height: 30px;
						margin: 5px 0;
						width: 35px;
					}
				}
			}
		}
	}
</style>