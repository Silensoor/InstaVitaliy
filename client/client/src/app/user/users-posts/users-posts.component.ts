import {Component, OnInit} from '@angular/core';
import {PostService} from "../../service/post.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {CommentService} from "../../service/comment.service";
import {NotificationService} from "../../service/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {Post} from "../../models/Post";
import {LikesDialogComponentComponent} from "../likes-dialog-component/likes-dialog-component.component";

@Component({
  selector: 'app-users-posts',
  templateUrl: './users-posts.component.html',
  styleUrls: ['./users-posts.component.css']
})
export class UsersPostsComponent implements OnInit {

  openedCommentsIndex: number | null = null;
  isLUserPostsLoaded = false;
  posts!: Post[];
  email!: string;

  constructor(private postService: PostService,
              private imageService: ImageUploadService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email') || '';
    this.postService.getPostForUser(this.email)
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

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
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
