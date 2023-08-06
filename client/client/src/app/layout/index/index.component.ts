import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {PostService} from "../../service/post.service";
import {UserService} from "../../service/user.service";
import {CommentService} from "../../service/comment.service";
import {NotificationService} from "../../service/notification.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  posts!: Post[];
  isLoading = false;
  isUserDataLoaded = false;
  user!: User;
  showAllComments: boolean[] = [];
  commentText: string[] = [];
  page = 0;


  constructor(private postService: PostService,
              private userService: UserService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService,
              private router:Router) {
  }

  ngOnInit(): void {
    this.loadMorePosts();
    this.userService.getCurrentUser()
      .subscribe(data => {
        this.user = data;
        this.isUserDataLoaded = true;
      });
  }

  loadMorePosts(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      this.postService.getAllPosts(this.page)
        .subscribe(data => {
          this.posts = this.posts ? [...this.posts, ...data] : [...data];
          this.getCommentsToPosts(data);
          this.getImageToPosts(data);
          this.isLoading = false;
          this.page++;
          this.commentText = Array(this.posts.length).fill('');
        });
    }
  }

  navigateToProfile(email: any) {
    if (email === this.user.email) {

      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/user-profile', email]);
    }
  }

  getImageToPosts(posts: Post[]): void {
    posts.forEach(p => {
      if (p.id != null) {
        this.imageService.getImageToPost(p.id)
          .subscribe(data => {
            p.image = data.imageBytes;
          })
      }
    });
  }

  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      if (p.id != null) {
        this.commentService.getCommentsToPost(p.id)
          .subscribe(data => {
            p.comments = data;
          })
      }
    });
  }

  likePost(postId: number, postIndex: number): void {
    const post = this.posts[postIndex];

    if (post.usersLiked?.includes(this.user.username)) {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          const index = post.usersLiked?.indexOf(this.user.username, 0);
          if (index != undefined && index > -1) {
            post.usersLiked?.splice(index, 1);
            // Уменьшаем количество лайков на 1 после успешного запроса
            if (post.likes != null && post.likes > 0) {
              post.likes--;
            }
          }
        });
    } else {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          post.usersLiked?.push(this.user.username);
          this.notificationService.showSnackBar('Liked!');
          if (post.likes != null) {
            // Увеличиваем количество лайков на 1 после успешного запроса
            post.likes++;
          }
        });
    }
  }

  postComment(message: string, postId: number, postIndex: number): void {
    const post = this.posts[postIndex];
    console.log(post);
    this.commentService.addCommentToPost(postId, message)
      .subscribe(data => {
        console.log("POSTS" + data);
        post.comments?.push(data);
      });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }
}
