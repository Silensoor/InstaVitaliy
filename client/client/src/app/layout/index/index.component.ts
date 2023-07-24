import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {PostService} from "../../service/post.service";
import {UserService} from "../../service/user.service";
import {CommentService} from "../../service/comment.service";
import {NotificationService} from "../../service/notification.service";
import {ImageUploadService} from "../../service/image-upload.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  posts!: Post[];
  isPostsLoaded = false;
  isUserDataLoaded = false;
  user!: User;

  constructor(private postService:PostService,
              private userService:UserService,
              private commentService:CommentService,
              private notificationService:NotificationService,
              private imageService:ImageUploadService) {
  }

  ngOnInit(): void {
    
  }

}
