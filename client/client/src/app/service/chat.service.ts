import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Dialog} from "../models/Dialog";
import {Message} from "../models/Message";
import {Observable} from "rxjs";

const API_CHAT = 'http://localhost:8080/api/dialog/'

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    constructor(private http: HttpClient) {
    }

    getChats() {
        return this.http.get<Dialog[]>(API_CHAT + 'all');
    }

    getMessagesWithUser(username: string) {
        return this.http.get(API_CHAT + username);
    }

    sendMessage(message: string, username: any) {
        return this.http.post(API_CHAT + username + '/create', message);
    }

    sendMessageById(message: string, userId: any):Observable<any> {
        return this.http.post(API_CHAT + userId + '/create', message);
    }

    getMessages(id: any) {
        return this.http.get<Message[]>(API_CHAT + id);
    }


    updateReadStatus(unreadMessageIds: number[]) {
        return this.http.put(API_CHAT+'read', unreadMessageIds);
    }
}
