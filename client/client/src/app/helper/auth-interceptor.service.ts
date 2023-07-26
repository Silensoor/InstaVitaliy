import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {TokenStorageService} from "../service/token-storage.service";
import {Observable} from "rxjs";

const TOKEN_KEY = 'Authorization'

@Injectable({
  providedIn: 'root'
})
export class fwcAPIInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.tokenService.getToken();

    if (token != null) {
      req=req.clone({
        headers: req.headers.set(TOKEN_KEY, token)
      });
    }
    console.log('Intercepted HTTP call', req);

    return next.handle(req);
  }
}


