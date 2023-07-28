import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Post} from "../models/Post";
import {Observable} from "rxjs";

const POST_API = 'http://localhost:8080/api/post/'

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  public createPost(post: Post): Observable<any> {
    return this.http.post(POST_API + 'create', post);
  }

  public getAllPosts(): Observable<any> {
    return this.http.get(POST_API + 'all');
  }

  public getPostForCurrentUser(): Observable<any> {
    return this.http.get(POST_API + 'user/posts');
  }

  public deletePost(id: number): Observable<any> {
    return this.http.post(POST_API + id + '/delete', null);
  }

  public likePost(id: number, username: string): Observable<any> {
    return this.http.post(POST_API + id + '/' + username + '/like', null);
  }


}
