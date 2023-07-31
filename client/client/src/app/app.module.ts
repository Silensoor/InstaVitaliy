import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material-module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {fwcAPIInterceptor} from "./helper/auth-interceptor.service";
import {ErrorInterceptorService} from "./helper/error-interceptor.service";
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { IndexComponent } from './layout/index/index.component';
import { ProfileComponent } from './user/profile/profile.component';
import { UserPostsComponent } from './user/user-posts/user-posts.component';
import { AddPostComponent } from './user/add-post/add-post.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { LikesDialogComponentComponent } from './user/likes-dialog-component/likes-dialog-component.component';
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import { ChatComponent } from './user/chat/chat.component';
import { ChatListComponent } from './user/chat-list/chat-list.component';
import { ChatWindowComponent } from './user/chat-window/chat-window.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UsersPostsComponent } from './user/users-posts/users-posts.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavigationComponent,
    IndexComponent,
    ProfileComponent,
    UserPostsComponent,
    EditUserComponent,
    AddPostComponent,
    EditUserComponent,
    LikesDialogComponentComponent,
    ChatComponent,
    ChatListComponent,
    ChatWindowComponent,
    UserProfileComponent,
    UsersPostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CdkFixedSizeVirtualScroll,
    InfiniteScrollModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {multi: true, provide:HTTP_INTERCEPTORS,useClass:fwcAPIInterceptor},
    {multi:true,provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptorService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
