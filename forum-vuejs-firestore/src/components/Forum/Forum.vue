<template>
	<div class="view--forum">
		<div>
			<div class="forum-topics">
				<ul>
					<li>
						<router-link to="forum/general">
							<div class="category">
								<div class="category--details">
									<div class="category--details-title">General</div>
									<div class="category--details-description">Anything and everything</div>
								</div>
								<div class="category--stats">
									<div class="category--stats-posts">
										<IconPosts />
										<span>{{ generalPostCount }}</span>
									</div>
									<div class="category--stats-replies">
										<IconReplies />
										<span>{{ generalPostReplyCount }}</span>
									</div>
								</div>
							</div>
						</router-link>
					</li>
					<li>
						<router-link to="forum/gaming">
							<div class="category">
								<div class="category--details">
									<div class="category--details-title">Gaming</div>
									<div class="category--details-description">This is just a sample description</div>
								</div>
								<div class="category--stats">
									<div class="category--stats-posts">
										<IconPosts />
										<span>{{ gamingPostCount }}</span>
									</div>
									<div class="category--stats-replies">
										<IconReplies />
										<span>{{ gamingPostReplyCount }}</span>
									</div>
								</div>
							</div>
						</router-link>
					</li>
					<li>
						<router-link to="forum/music">
							<div class="category">
								<div class="category--details">
									<div class="category--details-title">Music</div>
									<div class="category--details-description">This is another sample description</div>
								</div>
								<div class="category--stats">
									<div class="category--stats-posts">
										<IconPosts />
										<span>{{ musicPostCount }}</span>
									</div>
									<div class="category--stats-replies">
										<IconReplies />
										<span>{{ musicPostReplyCount }}</span>
									</div>
								</div>
							</div>
						</router-link>
					</li>
					<li>
						<router-link to="forum/internet">
							<div class="category">
								<div class="category--details">
									<div class="category--details-title">Internet</div>
									<div class="category--details-description">This is a unique sample description</div>
								</div>
								<div class="category--stats">
									<div class="category--stats-posts">
										<IconPosts />
										<span>{{ internetPostCount }}</span>
									</div>
									<div class="category--stats-replies">
										<IconReplies />
										<span>{{internetPostReplyCount }}</span>
									</div>
								</div>
							</div>
						</router-link>
					</li>
					<li>
						<router-link to="forum/television">
							<div class="category">
								<div class="category--details">
									<div class="category--details-title">Television</div>
									<div class="category--details-description">This is just a sample description</div>
								</div>
								<div class="category--stats">
									<div class="category--stats-posts">
										<IconPosts />
										<span>{{ televisionPostCount }}</span>
									</div>
									<div class="category--stats-replies">
										<IconReplies />
										<span>{{ televisionPostReplyCount }}</span>
									</div>
								</div>
							</div>
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import IconPosts from '@/components/Body/Forum/Icon/IconPosts'
	import IconReplies from '@/components//Body/Forum/Icon/IconReplies'
  import firebase from 'firebase';


	export default {
		data () {
			return {
				authUser: null,
				registered: true,

				users: '',
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

				generalPosts: '',
				generalPostReplyCount: 0,

				gamingPosts: '',
				gamingPostReplyCount: 0,

				musicPosts: '',
				musicPostReplyCount: 0,

				internetPosts: '',
				internetPostReplyCount: 0,

				televisionPosts: '',
				televisionPostReplyCount: 0
			}
		},
		components: {
			IconPosts,
			IconReplies
		},
		methods: {
			register () {
				let match = false
				for (let user in Object.entries(this.users)) {
					if (Object.entries(this.users)[user][1]['username'] == this.username) {
						match = true
					}
				}
				if (this.username == '' || this.email == '' || this.password == '') {
					this.signInInvalid = true
					this.usernameIsTaken = false
					this.usernameIsInvalid = false
				}
				else if (match == true) {
					this.signInInvalid = false
					this.usernameIsTaken = true
					this.usernameIsInvalid = false
				} else if (this.username == '') {
					this.signInInvalid = false
					this.usernameIsInvalid = true
					this.usernameIsTaken = false
				} else {
					this.signInInvalid = false
					this.usernameIsTaken = false
					this.usernameIsInvalid = false
					firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
						.then(() => {
							this.registerUserName(this.username)
						})
						.catch(error => {
							this.signInInvalid = true
							this.signInErrorMessage = error.message
						})
				}
			},
			registerUserName(username) {
				// Set username in firebase rtdb
				firebase.database().ref('users').child(this.authUser.uid)
					.update({username: username})
					.catch(error => {
						console.log(error)
					})
				// Set username in firebase auth
				this.authUser.updateProfile({ displayName: username})
					.catch(error => {
						console.log(error)
					})
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
				if (email == '') {
					this.emailIsInvalid = true
				} else {
					const auth = getAuth();
					sendPasswordResetEmail(auth, email)
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
			gamingPostCount () {
				return Object.keys(this.gamingPosts).length
			},
			musicPostCount () {
				return Object.keys(this.musicPosts).length
			},
			internetPostCount () {
				return Object.keys(this.internetPosts).length
			},
			televisionPostCount () {
				return Object.keys(this.televisionPosts).length
			}
		},
		watch: {
			generalPosts: function(posts) {
				Object.keys(posts).forEach((post) => {
					this.generalPostReplyCount += Object.keys(posts[post]['comments']).length
				})
			},
			gamingPosts: function(posts) {
				Object.keys(posts).forEach((post) => {
					this.gamingPostReplyCount += Object.keys(posts[post]['comments']).length
				})
			},
			musicPosts: function(posts) {
				Object.keys(posts).forEach((post) => {
					this.musicPostReplyCount += Object.keys(posts[post]['comments']).length
				})
			},
			internetPosts: function(posts) {
				Object.keys(posts).forEach((post) => {
					this.musicPostReplyCount += Object.keys(posts[post]['comments']).length
				})
			},
			television: function(posts) {
				Object.keys(posts).forEach((post) => {
					this.musicPostReplyCount += Object.keys(posts[post]['comments']).length
				})
			}
		},
		mounted () {
			window.scrollTo(0, 0)
		},
		created () {
			firebase.auth().onAuthStateChanged(user => { 
				this.authUser = user
				if (user) {
					firebase.database().ref('users').on('value', snapshot => {
						if (snapshot.val()) {
							this.users = snapshot.val()
						}
					})
					firebase.database().ref('general').on('value', snapshot => {
						if (snapshot.val()) {
							this.generalPosts = snapshot.val()
						}
					})
					firebase.database().ref('gaming').on('value', snapshot => {
						if (snapshot.val()) {
							this.gamingPosts = snapshot.val()
						}
					})
					firebase.database().ref('music').on('value', snapshot => {
						if (snapshot.val()) {
							this.musicPosts = snapshot.val()
						}
					})
					firebase.database().ref('internet').on('value', snapshot => {
						if (snapshot.val()) {
							this.internetPosts = snapshot.val()
						}
					})
					firebase.database().ref('television').on('value', snapshot => {
						if (snapshot.val()) {
							this.televisionPosts = snapshot.val()
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
			border-radius: inherit;
			width: 100%;
			max-width: 614px;
			margin: 0 auto;
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

		h1 {
			font-size: 24px;
			line-height: 36px;
			color: var(--green-dark);
			max-width: 960px;
			margin: 0 auto;
			padding: 20px 0 0;
			text-align: left;

			@media (min-width: 820px) {
				font-size: 36px;
				line-height: 55px;
				padding: 40px 0 0;
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
						font-size: 20px;
						line-height: 30px;
						font-weight: bold;
						color: var(--green-dark);
					}

					.category--details-description {
						font-size: 16px;
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