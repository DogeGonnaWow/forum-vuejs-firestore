<template>
	<div class="view--topic">
		<div class="view--topic-content-wrapper">
			<div class="view--topic-content">
				<div class="forum-menu">
					<div class="forum-menu-content">
						<div class="forum-menu-content-left">
							<div class="forum-breadcrumbs">
								<ul>
									<li><router-link to="/Forum">Forum</router-link></li>
									<li><a href="#">{{ topic }}</a></li>
								</ul>
							</div>
						</div>
						<div class="forum-menu-content-right">
              <router-link :to="'/user/post/' + $route.params.topic"><button style="text-decoration: none;color:grey;text-underline: none !important;border:none"><b>Create Post</b></button> </router-link>
						</div>
					</div>
				</div>
				<div class="topic--posts">
					<ul>
						<li v-for="(post, index) in posts" :key="index" :index="index" ref="post">
							<router-link :to="$route.params.topic + '/' + post.id">
								<div class="topic--posts-post">
									<div class="topic--posts-post-avatar" :class="post.color">
										<span>{{ post.user.substring(0,1).toUpperCase() }}</span>
									</div>
									<div class="topic--posts-post-details">
										<div class="topic--posts-post-details-title">{{ post.title }}</div>
										<div class="topic--posts-post-details-date">by {{ post.user }}&nbsp;</div>
                    <TimeSince style="font-size: 0.8em;color: grey" :date="post.date" />
									</div>
									<div class="topic--posts-post-stats">
                    <v-icon style="font-size: 1.5em;margin:3px;" color="black">question_answer</v-icon>
                    <span>{{ Object.keys(post.comments).length || 0 }}</span>
									</div>
								</div>
							</router-link>
						</li>
					</ul>
				</div>
        <div class="text-center">
          <v-pagination
              @next="getTopicsByPage()"
              @previous="getTopicsByPage()"
              @input="getTopicsByPage()"
              v-model="page"
              :length="pages"
              :total-visible="7"
          ></v-pagination>
        </div>
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
				posts: [],
				authUser: '',
				post: '',
        page: 1,
        pages: 8,
        limitPosts:5
      }
		},
		components: {
			TimeSince
		}, 
		mounted () {
			window.scrollTo(0, 0)
			let topic = this.$route.params.topic
			if (topic !== 'general') {
				this.$router.push({ path: '/forum' })
			} else {
				this.topic = topic[0].toLowerCase() + topic.slice(1)
				firebase.auth().onAuthStateChanged(user => { 
					this.user = user
					this.authUser = user
					if (user) {
            firebase.firestore().collection(this.topic).onSnapshot(snapshot => {
              if (snapshot) {
                let listTopic = []
                snapshot.forEach(post => {
                  listTopic.push(post.data());
                });
                this.pages = Math.ceil(listTopic.length / this.limitPosts);
              }
            });
              firebase.firestore().collection(this.topic).limit(this.limitPosts).orderBy('index').onSnapshot(snapshot => {
							if (snapshot) {
                let index = 0;
                snapshot.forEach(post => {
                  this.posts.push(post.data());
                  this.posts[index].id = snapshot.docs[index].id;
                  index++;
                  this.posts.sort((a, b) => a.index - b.index);
                });
              }
						})
					}
				})
			}
		},
    methods:{
      getTopicsByPage(){
        firebase.firestore().collection(this.topic).onSnapshot( snapshot => {
          this.lastDoc = null;
          if (snapshot) {
            firebase.firestore().collection(this.topic).where('index', '==', ((this.page - 1) * this.limitPosts)).get().then((snapshot => {
              snapshot.forEach(doc => {this.lastDoc = doc});
              if(this.lastDoc) {
                firebase.firestore().collection(this.topic).orderBy('index').limit(this.limitPosts).startAfter(this.lastDoc).onSnapshot((snapshot => {
                  this.posts = [];
                  if (snapshot) {
                    let index = 0;
                    snapshot.forEach(post => {
                      this.posts.push(post.data());
                      this.posts[index].id = snapshot.docs[index].id;
                      index++;
                      this.posts.sort((a, b) => a.index - b.index);
                    });
                  }
                }));
              }
            }))
          }
        })
      }
    }
	}
</script>

<style lang="scss" scoped>
	.view--topic-content {
		padding: 0 20px;

		@media (min-width: 420px) {
			padding: 0 40px;
		}
	}
	.forum-menu {
		color: #ffffff;
		margin: 0 auto;
		text-align: center;
		max-width: 960px;
		padding-top: 40px;

		.forum-menu-content {
			max-width: 1200px;
			margin: 0 auto;
			font-size: 20px;
			line-height: 30px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.forum-menu-content-left {
				text-align: left;
			}

			.forum-menu-content-right {
				text-align: right;
			}

			a.button {
				padding: 10px 30px;
				border-radius: 30px;
				font-weight: bold;
				font-size: 1.5em;


				@media (min-width: 820px) {
					padding: 15px 35px;
				}
			}

			.forum-breadcrumbs {
				ul {
					margin: 0;
					padding: 0;
					list-style-type: none;
					display: flex;
					align-items: center;
					color: #ccc;

					li {
						a {
							color: var(--green-dark);
							text-decoration: none;
							font-size: 18px;
							line-height: 27px;

							&:after {
								content: '/';
								margin: 0 20px;
							}
						}

						&:last-of-type a {
							color: #aaa;

							&:after {
								content: '';
							}	margin: 0;
						}
					}
				}
			}
		}
	}

	.topic--posts {
		max-width: 960px;
		margin: 40px auto;
		border-radius: 10px;
		display: block;

		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-direction: column;
			border-radius: 10px;
			box-shadow: 0 0 20px rgba(0, 0, 0, 10%);

			li {
				opacity: 0;
				animation: postFadeIn .25s linear forwards;

				&:nth-of-type(1) {
					animation-delay: .0s;
				}

				&:nth-of-type(2) {
					animation-delay: .1s;
				}

				&:nth-of-type(3) {
					animation-delay: .2s;
				}

				&:nth-of-type(4) {
					animation-delay: .3s;
				}

				&:nth-of-type(5) {
					animation-delay: .4s;
				}

				&:nth-of-type(6) {
					animation-delay: .5s;
				}

				&:nth-of-type(7) {
					animation-delay: .6s;
				}

				&:nth-of-type(8) {
					animation-delay: .7s;
				}

				&:nth-of-type(9) {
					animation-delay: .9s;
				}

				&:nth-of-type(10) {
					animation-delay: 1s;
				}

				&:nth-of-type(11) {
					animation-delay: 1.1s;
				}

				&:nth-of-type(12) {
					animation-delay: 1.2s;
				}

				@keyframes postFadeIn {
					0% {
						opacity: 0;
					}
					100% {
						opacity: 1;
					}
				}

				a {
					text-decoration: none;
				}
			}
		}

		.topic--posts-post {
			display: flex;
			border-bottom: 1px solid #eee;
			padding: 20px;
			color: var(--green-dark);

			.topic--posts-post-avatar {
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

			.topic--posts-post-details {
				width: calc(100% - 124px);

				.topic--posts-post-details-title {
					font-size: 1.2em;
					line-height: 26px;
					font-weight: bold;
					color: var(--green-dark);
				}
				.topic--posts-post-details-date {
					font-size: 0.8em;
					line-height: 24px;
					color: var(--green-dark);
					display: flex;
				}
			}

			.topic--posts-post-stats {
				display: flex;
				align-items: center;
				right: 0;
				position: relative;
				font-size: 18px;
				line-height: 27px;

				svg {
					fill: var(--green-dark);
					width: 30px;
					margin-right: 10px;
				}

				span {
					width: 25px;
				}
			}
		}
	}
</style>