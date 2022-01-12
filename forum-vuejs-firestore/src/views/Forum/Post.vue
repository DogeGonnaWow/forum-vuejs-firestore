<template>
	<div class="view--post">
			<div class="view--post-breadcrumbs">
				<ul>
					<li><router-link to="/">Forum</router-link></li>
					<li><router-link :to="'/forum/' + $route.params.topic">{{ topic }}</router-link></li>
					<li><a href="#">{{ post.title }}</a></li>
				</ul>
			</div>
			<div class="view--post-content">
				<div class="view--post-content-wrapper">
					<h1>{{ post.title }}</h1>
					<div class="view--post-content-avatar" :class="post.color">
						<span>{{ post.userLetter }}</span>
					</div>
					<div class="view--post-content-details">
						<div class="view--post-content-details-title">{{ post.user }}</div>
						<div class="view--post-content-details-date">
              <TimeSince v-if="post.date" :date="post.date" /></div>
					</div>
					<div class="view--post-content-body">
						<p>{{ post.content }}</p>
					</div>
					<div v-if="this.authUser.displayName === post.user" class="view--post-content-delete">
						<button @click="deletePost($route.params.topic, $route.params.post)" class="delete"><span>&times;</span> Delete Post</button>
					</div>
				</div>
				<div class="view--post-content-comments">
					<h3>{{ post.comments ? post.comments.length : 0 }} replies</h3>
					<ul>
						<li v-for="(comment, index) in post.comments" :key="index" :index="index" ref="comment">
							<div class="view--post-content-comments-comment">
								<div class="view--post-content-avatar" :class="comment.color">
									<span>{{ comment.userLetter }}</span>
								</div>
								<div class="view--post-content-details">
									<div class="view--post-content-details-title">{{ comment.user }}</div>
									<div class="view--post-content-details-date"><TimeSince v-if="comment.date"  :date="comment.date" /></div>
								</div>
								<div class="view--post-content-body">
									<p>{{ comment.content }}</p>
								</div>
								<div v-if="authUser.displayName === comment.user" class="view--post-content-comments-comment-delete">
									<button @click="deleteComment($route.params.topic, $route.params.post, index)" class="delete"><span>&times;</span> Delete Comment</button>
								</div>
							</div>
						</li>
					</ul>
					<h3>Add Comment</h3>
          <button onclick="addComment($route.params.topic, $route.params.post, comments)"> </button>

          <form @submit.prevent="addComment($route.params.topic, $route.params.post, comments)">
						<fieldset>
							<div class="input-group">
								<textarea v-model="comment.content"></textarea>
								<button class="button">Reply</button>
							</div>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
</template>

<script>
	import TimeSince from '../Forum/Utility/TimeSince'
  import firebase from 'firebase'

	export default {
		data () {
			return {
				topic: '',
				postId: '',
				authUser: '',
				post: '',
				comment: {
					content: '',
					color: '',
					user: '',
					date: ''
				}
			}
		},
		components: {
			TimeSince
		},
		methods: {
			/**
			 * Remove post using topic and postId params
			 */
			deletePost(topic, postId) {
				firebase.firestore().collection(topic + '/').doc(postId).delete()
				this.$router.push({ path: '/forum/' + topic })
			},

			/**
			 * Push new comment into to post.comment
			 */
			addComment(topic, postId) {

        const 	groupA = ['A', 'a', 'b', 'c', 'D', 'd', 'E', 'V', 'F', 'f', 'G', 'g'],
						groupB = ['I', 'i', 'J', 'j', 'K', 'L', 'l', 'M', 'C', 'B', 'P', 'W'],
						groupC = ['Q', 'p', 'R', 'S', 's', 'e', 'T', 'U', 'u','H', 'Z', 'Y'],
						groupD = ['t', 'm', 'N', 'n', 'q', 'o','k', 'x', 'r', 'h', 'y', 'z'],
						groupE = ['O', 'v', 'w', 'X', 'y'];
				for (let i=0; i < groupA.length; i++) {
					if (this.authUser.displayName.charAt(0) === groupA[i]) {
						this.comment.color = 'blue'
					} else if (this.authUser.displayName.charAt(0) === groupB[i]) {
						this.comment.color = 'purple'
					} else if (this.authUser.displayName.charAt(0) === groupC[i]) {
						this.comment.color = 'pink'
					} else if (this.authUser.displayName.charAt(0) === groupD[i]) {
						this.comment.color = 'orange'
					} else if (this.authUser.displayName.charAt(0) === groupE[i]) {
						this.comment.color = 'yellow'
					}
				}
				let 	today = new Date(),
						todaysMonth = today.getMonth() + 1,
						todaysYear = today.getFullYear(),
						todaysDay = today.getDate()
				if (todaysDay < 10) {
					todaysDay = '0' + todaysDay
				}
				if (todaysMonth.toString().charAt(0) !== '1') {
					todaysMonth = '0' + todaysMonth
				}
				firebase.firestore().collection(topic + '/' + postId + '/comments').add(
					{
						content: this.comment.content,
						date: todaysMonth.toString() + todaysDay + todaysYear,
						user: this.authUser.displayName,
						color: this.comment.color,
						userLetter: this.authUser.displayName.substring(0,1).toUpperCase(),
					}
				)
			},

			/**
			 * Delete comment using topic, postId params and commentId value
			 */
			deleteComment(topic, postId, commentId) {
				firebase.firestore().collection(topic + '/' + postId + '/comments/').doc(commentId).delete();
				this.comment.content = ''
			}
		},

		mounted () {
			window.scrollTo(0, 0)
			let postId = this.$route.params.post
			this.postId = postId
			let topic = this.$route.params.topic
			this.topic = topic[0].toUpperCase() + topic.slice(1)
			firebase.auth().onAuthStateChanged(user => {
				this.authUser = user
        if (user) {
          console.log(topic+'/'+postId)
					firebase.firestore().collection(topic).doc(postId).get().then( snapshot => {
						if (snapshot.data()) {
                this.post = snapshot.data();
						}
					})
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.view--post {
		padding: 0 20px 50px;
		max-width: 960px;
		margin: 0px auto;
		display: block;
		position: relative;

		@media (min-width: 420px) {
			padding: 0 40px 50px;
		}

		.view--post-breadcrumbs {
			padding: 43px 0;

			ul {
				margin: 0;
				padding: 0;
				list-style-type: none;
				display: flex;
				align-items: center;
				color: #ccc;
				background: transparent;

				li {
					a {
						text-decoration: none;
						font-size: 18px;
						line-height: 27px;
						color: var(--green-dark);

						&:after {
							content: '/';
							margin: 0 20px;
						}
					}

					&:last-of-type a {
						color: #aaaaaa;

						&:after {
							content: '';
						}	margin: 0;
					}
				}
			}
		}

		.view--post-content {
			display: flex;
			flex-flow: wrap;
			padding: 0;
			color: var(--green-dark);
			position: relative;
			border-radius: 15px;

			.view--post-content-wrapper {
				display: flex;
				flex-flow: wrap;
			}

			.view--post-content-delete {
				button.delete {
					background: transparent;
					color: #d5445e;
					border-radius: 20px;
					border: none;
					cursor: pointer;
					font-weight: bold;
					line-height: 21px;
					font-size: 14px;
					text-transform: uppercase;
					padding: 10px 0;
					}

					span {
						font-size: 22px;
						margin-bottom: -10px;
						display: inline-block;
						bottom: -3px;
						position: relative;
					}
				}
			}

			h1 {
				width: 100%;
				font-size: 20px;
				line-height: 30px;
				margin-top: 0;
				
				@media (min-width: 820px) {
					font-size: 28px;
					line-height: 42px;
				}
			}

			.view--post-content-avatar {
				width: 50px;
				height: 50px;
				font-size: 20px;
				line-height: 30px;
				font-weight: bold;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 20px;
				color: #ffffff;

				&.blue {
					background: var(--blue);
				}

				&.purple {
					background: var(--purple);
				}

				&.pink {
					background: var(--pink);
				}

				&.orange {
					background: var(--orange);
				}

				&.yellow {
					background: var(--yellow);
				}
			}

			.view--post-content-details {
				width: calc(100% - 124px);

				.view--post-content-details-title {
					font-size: 20px;
					line-height: 26px;
					font-weight: bold;
					color: var(--green-dark);
				}
				.view--post-content-details-date {
					font-size: 16px;
					line-height: 24px;
					color: var(--green-dark);
					width: 100%;
				}
			}

			.view--post-content-body {
				width: 100%;
				margin: 0;

				p {
					font-size: 16px;
					line-height: 24px;
				}
			}
		}

	.view--post-content-comments {
		padding: 0;
		width: 100%;

		form {
			textarea {
				resize: none;
				font-size: 16px;
				line-height: 24px;
			}
		}

		button {
			background: var(--green-dark);
			color: #ffffff;
			box-shadow: none;
			text-shadow: none;
			border: none;
			margin: 20px 0;
		}

		h3 {
			margin: 20px 0;
			padding: 20px 0 0;
			border-top: 1px solid #eeeeee;
		}

		ul {
			margin: 0;
			padding: 0;
			list-style-type: none;

			li { 
				display: flex; 
				flex-flow: wrap;
				border-bottom: 1px solid #eeeeee;
				margin: 40px 0;
				padding-bottom: 10px;

				&:last-of-type {
					border-bottom: 0;
					margin-bottom: 0;
				}

				.view--post-content-comments-comment {
					padding: 0;
					display: flex;
					flex-flow: wrap;
					width: 100%;
					position: relative;

					.view--post-content-comments-comment-delete {
						button.delete {
							background: transparent;
							color: #d5445e;
							border-radius: 10px;
							border: none;
							cursor: pointer;
							font-weight: bold;
							line-height: 21px;
							font-size: 14px;
							text-transform: uppercase;
							padding: 0;

							span {
								font-size: 22px;
								margin-bottom: -10px;
								display: inline-block;
								bottom: -3px;
								position: relative;
							}
						}
					}
				}
			}
		}
	}
</style>