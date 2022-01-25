<template>
	<div class="view--post">
			<div class="view--post-breadcrumbs">
				<ul>
					<li><router-link to="/">Forum</router-link></li>
					<li><router-link :to="'/forum/' + $route.params.topic">{{ topic }}</router-link></li>
					<li><a href="#">{{ post.title }}</a></li>
				</ul>
			</div>
			<div class="view--post-content" >
				<div class="view--post-content-wrapper" v-show="page === 1">
					<h1>{{ post.title }}</h1>
					<div class="view--post-content-avatar" :class="post.color" >
						<span>{{ post.userLetter }}</span>
					</div>
          <div style="border: lightgrey 1px solid;width:100%;padding:10px;border-radius: 5px;display:block">

            <div v-if="authUser.displayName === post.user" class="view--post-content-delete">
              <button @click="deletePost($route.params.topic, $route.params.post)" class="delete"> <v-icon color="red" style="font-size: 1.4em">delete</v-icon>  </button>
            </div>

            <div v-if="authUser.displayName === post.user" class="view--post-content-delete">
              <button @click="editPost($route.params.topic, $route.params.post)" class="delete"> <v-icon color="grey" style="font-size: 1.4em;margin-right:10px;">edit</v-icon>  </button>
            </div>
          <div class="view--post-content-details">
						<div class="view--post-content-details-title">{{ post.user }}</div>
            <div style="width:100%;height:1px;background-color: lightgrey;margin-bottom:3px;margin-top:5px;"></div>
						<div class="view--post-content-details-date">
              <TimeSince style="font-size: 0.7em;margin-left:5px" v-if="post.date" :date="post.date" />
            </div>
					</div>
					<div class="view--post-content-body">
            <div v-if="isEditable">
						<textarea v-model="post.content" style="width:100%"></textarea>
              <v-btn  @click="validatePost($route.params.topic, $route.params.post, post)" style="background-color: #42b983;color:white;float:right;margin-right:15px;">Accept</v-btn>
            </div>
            <div v-else>
              <p>{{post.content}}</p>
            </div>
					</div>
				</div>
        </div>
				<div class="view--post-content-comments">
					<p><b><i style="font-size: 0.7em;margin-left:5px">{{ totalReplie ? totalReplie : 0 }} replies</i></b></p>
					<ul v-if="post.comments">
						<li class="comments-in" v-for="(commentUser, index) in post.comments" :key="index" :index="index" ref="comment">
							<div class="view--post-content-comments-comment">

                <div style="border: lightgrey 1px solid;width:100%;padding:10px;border-radius: 5px;display:block">

                  <div v-if="authUser.displayName === commentUser.user" class="view--post-content-delete">
                    <button @click="deleteComment($route.params.topic, $route.params.post, commentUser.id)" class="delete"> <v-icon color="red" style="font-size: 1.4em;margin-top:-40px;">delete</v-icon>  </button>
                  </div>
                  <div v-if="authUser.displayName === commentUser.user" class="view--post-content-delete">
                    <button @click="editComment($route.params.topic, $route.params.post, commentUser.index)" class="delete"> <v-icon color="grey" style="font-size: 1.4em;margin-right:10px;margin-top:-40px;">edit</v-icon>  </button>
                  </div>
                  <div class="view--post-content-details">
                    <div class="view--post-content-details-title">{{ commentUser.user }}</div>
                    <div style="width:100%;height:1px;background-color: lightgrey;margin-bottom:3px;margin-top:5px;"></div>
                    <div class="view--post-content-details-date">
                      <TimeSince style="font-size: 0.7em;margin-left:5px"  :date="commentUser.date" />
                    </div>
                  </div>
                  <div class="view--post-content-body">
                    <div v-if="commentUser.editable">
                      <textarea v-model="commentUser.content" style="width:100%"></textarea>
                      <v-btn  @click="validateEdition($route.params.topic, $route.params.post, commentUser)" style="background-color: #42b983;float:right;margin-right:15px;">Accept</v-btn>
                    </div>
                    <div v-else>
                      <p>{{commentUser.content}}</p>
                    </div>
                  </div>
                </div>
							</div>
						</li>
					</ul>

          <div class="text-center">
            <v-pagination
                @next="getPostsByPage()"
                @previous="getPostsByPage()"
                @input="getPostsByPage()"
                v-model="page"
                :length="pages"
                :total-visible="7"
            ></v-pagination>
          </div>
					<h3>Add Comment</h3>
          <button onclick="addComment($route.params.topic, $route.params.post)"> </button>

          <form @submit.prevent="addComment($route.params.topic, $route.params.post)">
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
        page: 1,
        pages:8,
        limitPosts:10,
        totalReplie:0,
        isEditable:false,
        docList:[],
        lastDoc:null,
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
      editPost(topic, postId) {
        this.isEditable = !this.isEditable;
      },
      validatePost(topic, postId, userContent){
        firebase.firestore().collection(topic + '/').doc(postId).update({content: userContent.content});
        this.isEditable = !this.isEditable;
        this.$forceUpdate();
      },
      editComment(topic, postId, index) {
        this.post.comments[index].editable = !this.post.comments[index].editable;
        this.$forceUpdate();
      },
      validateEdition(topic, postId, userContent){
        firebase.firestore().collection(topic + '/').doc(postId).collection('comments').doc(userContent.id).update({content: userContent.content});
        this.post.comments[userContent.index].editable = !this.post.comments[userContent.index].editable;
        this.$forceUpdate();
      },
      getPostsByPage(){
        let postId = this.$route.params.post;
        this.postId = postId;
        let topic = this.$route.params.topic;
        this.topic = topic[0].toUpperCase() + topic.slice(1);
        firebase.firestore().collection(topic).doc(postId).get().then( snapshot => {
          this.lastDoc = null;
          if (snapshot.data()) {
            this.post = snapshot.data();
            let indexLatest = ((this.page - 1) * this.limitPosts);
            console.log("index" , indexLatest)
            if(indexLatest < 0) indexLatest = 0;
            firebase.firestore().collection(topic).doc(postId).collection('comments').where('index', '==', indexLatest).get().then((snapshot => {
              snapshot.forEach(doc => this.lastDoc = doc);
              if(this.lastDoc) {
                firebase.firestore().collection(topic).doc(postId).collection('comments').orderBy('index').limit(this.limitPosts).startAt(this.lastDoc).onSnapshot((snapshot => {
                  this.post.comments = [];
                  if (snapshot) {
                    let index = 0;
                    snapshot.forEach(comment => {
                      console.log(comment.data())
                      this.post.comments.push(comment.data());
                      this.post.comments[index].id = snapshot.docs[index].id;
                      this.post.comments[index].editable = false;
                      this.post.comments.sort((a, b) => a.index - b.index);
                      console.log( this.post.comments);
                      index++;
                    });

                  }
                }));
              }
            }))
          }
        })
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
				if (todaysMonth.toString().length < 2) {
					todaysMonth = '0' + todaysMonth
				}

				firebase.firestore().collection(topic).doc(postId).collection('comments').add(
					{
						content: this.comment.content,
						date: todaysMonth.toString() + todaysDay + todaysYear,
						user: this.authUser.displayName,
						color: this.comment.color,
						userLetter: this.authUser.displayName.substring(0,1).toUpperCase(),
            index: this.docList[this.docList.length - 1 ] ? (this.docList[this.docList.length - 1].index + 1) : 0
					}
				).then(() => this.comment.content = "");
			},

			/**
			 * Delete comment using topic, postId params and commentId value
			 */
			deleteComment(topic, postId, commentId) {
				firebase.firestore().collection(topic).doc(postId).collection('comments').doc(commentId).delete();
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
					firebase.firestore().collection(topic).doc(postId).get().then( snapshot => {
						if (snapshot.data()) {
                this.post = snapshot.data();
                this.post.comments = [];
              firebase.firestore().collection(topic).doc(postId).collection('comments').orderBy('index').limit(this.limitPosts).onSnapshot((snapshot => {
                if(snapshot){
                  this.post.comments = [];
                  let index = 0 ;
                  snapshot.forEach(comment => {
                    this.post.comments.push(comment.data());
                    this.post.comments[index].id = snapshot.docs[index].id;
                    this.post.comments[index].editable = false;
                    this.post.comments.sort((a, b) => a.index - b.index);
                    index++;
                  });
                }
              }))
						}
					})
          firebase.firestore().collection(topic).doc(postId).collection('comments').onSnapshot((snapshot => {
            this.docList = [];
            let index = 0 ;
            snapshot.forEach(doc => {
              this.docList.push(doc.data());
              this.docList[index].id = snapshot.docs[index].id;
              this.docList.sort((a, b) => a.index - b.index);
              index++;
            }
          );

            this.totalReplie = this.docList.length;
            this.pages = Math.ceil(this.totalReplie / this.limitPosts);
          }))
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

    .comments-in{
      animation: linear 0.5s fadeIn;
    }

    .fadeIn {
      -webkit-animation-name: fadeIn;
      animation-name: fadeIn;
    }

    @-webkit-keyframes fadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }



    .view--post-content {
			display: block;
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
          float:right;
					font-weight: bold;
					line-height: 21px;
					font-size: 0.8em;
					text-transform: uppercase;
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
				width: calc(100% - 1px);

				.view--post-content-details-title {
					font-size: 0.9em;
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
				margin: 5px;

				p {
					font-size: 0.9em;
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