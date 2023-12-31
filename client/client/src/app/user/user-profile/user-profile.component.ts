import {Component, OnInit} from '@angular/core';
import {User} from "../../models/User";
import {TokenStorageService} from "../../service/token-storage.service";
import {PostService} from "../../service/post.service";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification.service";
import {ImageUploadService} from "../../service/image-upload.service";
import {UserService} from "../../service/user.service";
import {ActivatedRoute} from "@angular/router";
import {ChatWindowComponent} from "../chat-window/chat-window.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  isUserDataLoaded = false;
  user!: User;
  userProfileImage?: File;
  previewImgUrl: any;
  email!: string;

  constructor(private tokenService: TokenStorageService,
              private postService: PostService,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private imageService: ImageUploadService,
              private userService: UserService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email') || '';
    this.userService.getUserByUserEmail(this.email)
      .subscribe(data => {
        this.user = data;
        this.isUserDataLoaded = true;
      });
    this.imageService.getProfileImageByUserEmail(this.email)
      .subscribe(data => {
        this.userProfileImage = data.imageBytes;
      });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  openMessageDialog(): void {
    const dialogRef = this.dialog.open(ChatWindowComponent, {
      width: '400px',
      data: this.user
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
