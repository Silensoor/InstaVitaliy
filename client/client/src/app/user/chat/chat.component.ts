import {Component, OnInit} from '@angular/core';
import {ChatService} from "../../service/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chats: any = [];
  selectedChat = null;

  constructor(private chatService: ChatService) {
  }

  ngOnInit(): void {
    this.chatService.getChats()
      .subscribe(data => {
        this.chats = data;
      });
  }

  selectChat(chat: any): void {
    this.selectedChat = chat;
  }
}
