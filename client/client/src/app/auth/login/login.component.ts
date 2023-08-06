import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {TokenStorageService} from "../../service/token-storage.service";
import {NotificationService} from "../../service/notification.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;

  constructor(private authService: AuthService,
              private tokenService: TokenStorageService,
              private notificationService: NotificationService,
              private router: Router,
              private fb: FormBuilder,
              private routes: ActivatedRoute) {
    if (this.tokenService.getToken()) {
      this.router.navigate(['main']);
    }
  }

  ngOnInit(): void {
    this.routes.queryParams.subscribe(params => {
      const jwt = params['jwt'];
      if (jwt) {
        this.tokenService.saveUser(params);
        this.tokenService.saveToken(jwt);
        window.location.reload();
      }
    });
    this.loginForm = this.createLoginForm();
  }

  createLoginForm(): FormGroup {
    return this.fb.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    })
  }

  oauthGoogle(): void {
    this.authService.oauthAuthorization();
  }

  submit(): void {
    this.authService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    }).subscribe(data => {
      console.log(data);
      this.tokenService.saveUser(data);
      this.tokenService.saveToken(data.token);
      this.notificationService.showSnackBar('Successfully logged in');
      this.router.navigate(['/']);
      window.location.reload();
    }, error => {
      console.log(error);
      this.notificationService.showSnackBar(error.message);
    })
  }

}
