import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from "./material-module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthInterceptorService} from "./helper/auth-interceptor.service";
import {ErrorInterceptorService} from "./helper/error-interceptor.service";
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { IndexComponent } from './layout/index/index.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavigationComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  providers: [
    {multi: true, provide:HTTP_INTERCEPTORS,useClass:AuthInterceptorService},
    {multi:true,provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptorService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
