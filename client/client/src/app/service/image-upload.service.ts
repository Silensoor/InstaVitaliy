import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/Post";
import {switchMap} from "rxjs/operators";

const IMAGE_API = 'http://localhost:8080/api/image/'

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) {
  }

  public uploadImageToUser(file: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', file);
    return this.http.post(IMAGE_API + 'upload', uploadData);
  }

  public uploadImageToPost(file: File, postId: number): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', file);
    return this.http.post(IMAGE_API + postId + '/upload', uploadData);
  }

  public getProfileImage(): Observable<any> {
    return this.http.get(IMAGE_API + 'profileImage');
  }

  public getProfileImageByUserName(username: any): Observable<any> {
    return this.http.get(IMAGE_API + username);
  }
  public getProfileImageByUserEmail(email: any): Observable<any> {
    return this.http.get(IMAGE_API + 'email/'+email);
  }

  public getImageToPost(postId: number): Observable<any> {
    return this.http.get(IMAGE_API + postId + '/image');
  }

  getPersonAvatar(personId: number): Observable<string> {
    return this.http.get(IMAGE_API + 'userId/' + personId, {responseType: 'text'});
  }

}
