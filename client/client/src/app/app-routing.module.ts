import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegisterComponent} from "./auth/register/register.component";
import {IndexComponent} from "./layout/index/index.component";
import {AuthGuardService} from "./helper/auth-guard.service";
import {ProfileComponent} from "./user/profile/profile.component";
import {UserPostsComponent} from "./user/user-posts/user-posts.component";
import {AddPostComponent} from "./user/add-post/add-post.component";
import {ChatComponent} from "./user/chat/chat.component";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";
import {UsersPostsComponent} from "./user/users-posts/users-posts.component";

const routes: Routes = [
  {path:'user-profile/:username',component:UserProfileComponent,canActivate:[AuthGuardService],children:[
      {path: '',component: UsersPostsComponent,canActivate: [AuthGuardService]}
    ]},
  {path: 'chat',component:ChatComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'main', component: IndexComponent, canActivate: [AuthGuardService]},
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], children: [
      {path: '', component: UserPostsComponent, canActivate: [AuthGuardService]},
      {path: 'add', component: AddPostComponent, canActivate: [AuthGuardService]}
    ]
  },
  {path: '', redirectTo: 'main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
