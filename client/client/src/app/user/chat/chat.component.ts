import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../service/chat.service';
import {Dialog} from '../../models/Dialog';
import {Message} from '../../models/Message';
import {UserService} from '../../service/user.service';
import {finalize, forkJoin, map} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {User} from "../../models/User";
import {ImageUploadService} from "../../service/image-upload.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  chats!: Dialog[];
  selectedChat!: Dialog | null;
  messages!: Message[];
  isImageLoading: boolean = false;
  messageText = '';
  user!: User;
  map = new Map<number, string>();

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private imageService: ImageUploadService,
  ) {
  }

  ngOnInit(): void {
    this.isImageLoading = true;
    forkJoin([
      this.chatService.getChats(),
      this.userService.getCurrentUser()
    ]).pipe(
      tap(([chats, user]) => {
        this.chats = chats;
        this.user = user;
      }),
      switchMap(([chats, _]) => {
        const userIds = chats.reduce((acc, chat) => {
          if (!acc.includes(chat.firstPersonId)) acc.push(chat.firstPersonId);
          if (!acc.includes(chat.secondPersonId)) acc.push(chat.secondPersonId);
          return acc;
        }, [] as number[]);
        return forkJoin(
          userIds.map(userId => this.imageService.getPersonAvatar(userId).pipe(
            map(image => ({userId, image}))
          ))
        );
      }),
      tap(userImages => {
        userImages.forEach(userImage => {
          this.map.set(userImage.userId, userImage.image);
        });
      }),
      finalize(() => this.isImageLoading = false),
    ).subscribe({
      error: err => console.error('Error:', err) // вывод ошибок в консоль
    });
  }

  selectChat(chat: Dialog): void {
    this.isImageLoading = true;
    this.selectedChat = chat;
    this.chatService.getMessages(chat.id).pipe(
      finalize(() => this.isImageLoading = false)
    ).subscribe(messages => {
      this.messages = messages;
    });
  }
  getPersonName(chat: Dialog): string {
    return this.user.id === chat.firstPersonId ? chat.secondPersonName : chat.firstPersonName;
  }
  getImageByUserId(userId: number): any {
    const img = this.map.get(userId);
    return this.formatImage(img);
  }

  getOtherPersonId(chat: Dialog): number {
    if (chat.firstPersonId === this.user.id) {
      return chat.secondPersonId;
    } else {
      return chat.firstPersonId;
    }
  }
  getImageByChatId(chatId: number): any {
    const chat = this.chats.find(chat => chat.id === chatId);
    if (chat && this.user) {
      let img: any;
      if (chat.firstPersonId === this.user.id) {
        img = this.map.get(chat.secondPersonId);
      } else {
        img = this.map.get(chat.firstPersonId);
      }
      return this.formatImage(img);
    }
    return null;
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  closeChat(): void {
    this.selectedChat = null;
  }

  sendMessage(message: string, userId: any): void {
    this.chatService.sendMessageById(message, userId)
      .subscribe(data=>{
        this.messageText = '';
      })
  }
}
