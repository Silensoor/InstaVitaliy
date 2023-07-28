import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Post} from "../../models/Post";
import {PostService} from "../../service/post.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {NotificationService} from "../../service/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  postForm!: FormGroup;
  selectedFile!: File;
  isPostCreated = false;
  createdPost!: Post;
  previewImgUrl: any;

  constructor(private postService:PostService,
              private imageService:ImageUploadService,
              private notificationService:NotificationService,
              private router:Router,
              private fb:FormBuilder) {
  }

  ngOnInit(): void {
  }

}
