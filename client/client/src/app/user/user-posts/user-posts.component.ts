import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {PostService} from "../../service/post.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {CommentService} from "../../service/comment.service";
import {NotificationService} from "../../service/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {LikesDialogComponentComponent} from "../likes-dialog-component/likes-dialog-component.component";

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  openedCommentsIndex: number | null = null;
  isLUserPostsLoaded = false;
  posts!: Post[];

  constructor(private postService: PostService,
              private imageService: ImageUploadService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.postService.getPostForCurrentUser()
      .subscribe(data => {
        console.log(data);
        this.posts = data;
        this.getImagesToPosts(this.posts);
        this.getCommentsToPosts(this.posts);
        this.isLUserPostsLoaded = true;
      });


  }

  getImagesToPosts(posts: Post[]): void {
    posts.forEach(p => {
      if (p.id != null) {
        this.imageService.getImageToPost(p.id)
          .subscribe(data => {
            p.image = data.imageBytes;
          });
      }
    });
  }

  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      if (p.id != null) {
        this.commentService.getCommentsToPost(p.id)
          .subscribe(data => {
            p.comments = data;
          });
      }
    });
  }

  removePost(post: Post, index: number): void {
    console.log(post);
    const resullt = confirm('Do you really want to delete this post?');
    if (resullt) {
      if (post.id != null) {
        this.postService.deletePost(post.id)
          .subscribe(() => {
            this.posts?.splice(index, 1);
            this.notificationService.showSnackBar("Post deleted");
          });
      }
    }
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  deleteComment(commentId: number, postIndex: number, commentIndex: number): void {

    this.commentService.delete(commentId)
      .subscribe(() => {
        this.posts[postIndex].comments!.splice(commentIndex, 1);
        this.notificationService.showSnackBar('Comment removed');

      });
  }

  toggleComments(i: number): void {
    if (this.openedCommentsIndex === i) {
      this.openedCommentsIndex = null;
    } else {
      this.openedCommentsIndex = i;
    }
  }

  openDialog(usersLiked: string[]): void {
    const dialogRef = this.dialog.open(LikesDialogComponentComponent, {
      width: '250px',
      data: {users: usersLiked}
    });
  }
}
