import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../models/Post";
import {PostService} from "../../service/post.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {NotificationService} from "../../service/notification.service";
import {Router} from "@angular/router";
import {ProfileComponent} from "../profile/profile.component";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  postForm!: FormGroup;
  selectedFile!: File;
  createdPost!: Post;
  previewImgUrl: any;

  constructor(private postService: PostService,
              private imageService: ImageUploadService,
              private notificationService: NotificationService,
              private router: Router,
              private fb: FormBuilder,
              private profileComponent:ProfileComponent) {
  }

  ngOnInit(): void {
    this.profileComponent.onAddButtonClick();
    this.postForm = this.createPostForm();
  }

  createPostForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      caption: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])]
    });
  }

  submit(): void {
    let post: Post = {
      title: this.postForm.value.title,
      caption: this.postForm.value.caption,
      location: this.postForm.value.location
    }

    this.postService.createPost(post).subscribe(data => {
      this.createdPost = data;
      console.log(data);
      if (this.createdPost.id
        != null) {
        this.imageService.uploadImageToPost(this
          .selectedFile, this.createdPost.id).subscribe(
          () => {
            this.notificationService.showSnackBar('Post created successfully'
            );
            this.onAddButtonClick();
            this.router.navigate(['/profile']);
          });
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.previewImgUrl = reader.result;
    };
  }

  onAddButtonClick() {
    this.profileComponent.onAddButtonClick2();
  }
}

