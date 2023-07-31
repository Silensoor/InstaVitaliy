import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {TokenStorageService} from "./token-storage.service";

const AUTH_API = 'http://localhost:8080/api/auth/'
const OAUTH_API = 'http://localhost:8080/oauth2/authorization/google'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
              private tokenService:TokenStorageService) {
  }

  public login(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: user.username,
      password: user.password
    });
  }

  public register(user: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      password: user.password,
      confirmPassword: user.confirmPassword
    });
  }

  public oauthAuthorization(): void {

   window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

}
