import {Component, Inject, Input, OnInit} from '@angular/core';
import {Message} from "../../models/Message";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../models/User";
import {ChatService} from "../../service/chat.service";
import {NotificationService} from "../../service/notification.service";

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  responseMessage?: any;
  messageText: string = '';


  constructor(
    public dialogRef: MatDialogRef<ChatWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private messageService: ChatService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {

  }

  @Input() selectedChat: any = null;

  adjustTextarea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  sendMessage(message: string, userId: any): void {
    this.messageService.sendMessageById(message, userId)
      .subscribe(data => {
        this.responseMessage = data;
        this.notificationService.showSnackBar("Сообщение " + this.responseMessage.messageText + " отправлено")
      }, error => {
        this.notificationService.showSnackBar("Cообщение не было отправлено")
      });
  }
}
