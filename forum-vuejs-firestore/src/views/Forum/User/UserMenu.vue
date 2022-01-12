<template>
	<div class="user-menu" v-if="this.authUser && this.authUser.isAnonymous == false">
		<div class="user-menu--content">
			<p>Signed in as: <b>{{ authUser.displayName }}</b> (<router-link to="/user/settings">Settings</router-link>)</p>
			<button class="button" @click="signOut">Sign out</button>
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
				userData: null
			}
		},

		methods: {
			updateUserData () {
				firebase.firestore().collection('users').doc(this.authUser.uid)
					.update({userData: this.userData})
			},

			signOut () {
				firebase.auth().signOut()
				.then( () => {
					this.$router.push({ path: '/' })
				})
			}
		},

		created () {
      console.log("UserMenu");

      firebase.auth().onAuthStateChanged(user => {
				this.authUser = user
				if (user) {
					firebase.firestore().collection('users').doc(user.uid).get().then(snapshot => {
						if (snapshot.data()) {
              this.authUser.displayName = snapshot.data().username;
						}
					})
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.user-menu {
		background: var(--green-dark);

		.user-menu--content {
			color: #ffffff;
			max-width: 1200px;
			margin: 0 auto;
			font-size: 18px;
			line-height: 27px;
			padding: 5px 20px 25px;
			text-align: center;
			align-items: center;

			@media (min-width: 420px) {
				padding: 20px 40px;
			}

			@media (min-width: 445px) {
				display: flex;
				justify-content: space-between;
				text-align: left;
			}

			@media (min-width: 820px) {
				display: flex;
				justify-content: space-between;
				text-align: left;
			}

			@media (min-width: 1290px) {
				padding: 20px 0px;
			}

			a {
				color: #cccccc;
				font-weight: bold;
			}

			button.button {
				background: var(--green-light);
				color: #ffffff;
				cursor: pointer;
			}
		}
	}
</style>