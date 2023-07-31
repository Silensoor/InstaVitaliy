import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ChatService} from "../../service/chat.service";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  chats: any = [];
  @Output() chatSelected = new EventEmitter();
  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.chatService.getChats()
      .subscribe(data => {
        this.chats = data;
      });
  }

  selectChat(chat: any): void {
    this.chatSelected.emit(chat);
  }
}
