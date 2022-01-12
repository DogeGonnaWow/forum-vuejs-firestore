<template>
	<div class="view--user-settings">
		<a class="back" @click="$router.go(-1)">← Back to Forum</a>
		<div class="view--user-settings-form">
			<form @submit.prevent="updateEmail">
				<h1>Settings</h1>
				<h2>Update Email</h2>
				<label>E-mail</label>
				<input v-model="email" placeholder="Your Email">
				<button>Update</button> <span class="form-success" v-if="emailHasBeenUpdated">Your E-mail has been updated</span><span class="form-error" v-if="emailIsInvalid">{{ emailErrorMessage }}</span>
			</form>
			<form @submit.prevent="updatePassword">
				<h2>Update Password</h2>
				<label>New Password</label>
				<input v-model="newPassword" type="password" placeholder="••••••••••">
				<button>Update</button> <span class="form-success" v-if="passwordHasBeenUpdated">Your password has been updated</span><span class="form-error" v-if="passwordIsInvalid">{{ passwordErrorMessage }}</span>
			</form>
		</div>
	</div>
</template>

<script>
import firebase from 'firebase'

	export default {
		data () {
			return {
				authUser: null,
				email: '',
				emailHasBeenUpdated: false,
				emailIsInvalid: false,
				emailErrorMessage: '',
				newPassword: null,
				passwordHasBeenUpdated: false,
				passwordIsInvalid: false,
				passwordErrorMessage: ''
			}
		},
		methods: {
			updateEmail () {
				this.authUser.updateEmail(this.email)
					.then(() => { 
						this.emailHasBeenUpdated = true
						this.emailIsInvalid = false 
					})
					.catch(error => {
						this.emailIsInvalid = true
						this.emailHasBeenUpdated = false
						this.emailErrorMessage = error.message
					})
			},
			updatePassword () {
				this.authUser.updatePassword(this.newPassword)
					.then(() => { 
						this.newPassword = null
						this.passwordHasBeenUpdated = true
						this.passwordIsInvalid = false
					})
					.catch(error => {
						this.passwordHasBeenUpdated = false
						this.passwordIsInvalid = true
						this.passwordErrorMessage = error.message
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
					this.displayName = user.displayName,
					this.photoURL = user.photoURL
					this.email = user.email
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.view--user-settings {
		padding: 0 20px;

		@media (min-width: 420px) {
			padding: 0 40px;
		}
		h1 {
			font-size: 48px;
			line-height: 72px;
			text-align: center;
			margin-bottom: 50px;
			margin-top: 0;
			color: var(--green-dark);
		}
		a {
			color: var(--green-light);
			text-decoration: none;
			font-weight: bold;

			&.back {
				text-align: center;
				display: flex;
				justify-content: center;
				margin: 40px 0 0;
				cursor: pointer;
			}
		}
		.view--user-settings-form {
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
				background: #ffffff;
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
</style>