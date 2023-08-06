import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('messagesContainer', { static: false }) private messagesContainer!: ElementRef;

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
      setTimeout(() => { // Add a delay
        this.scrollToFirstUnreadOrBottom();
      }, 0);
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
    const newMessage: Message = {
      id: Math.floor(Math.random() * 10000), // Только для локального использования.
      authorId: this.user.id,
      messageText: message,
      readStatus: false, // Все отправленные сообщения автоматически помечаются как прочитанные
      createTime: new Date(),
      dialogId: this.selectedChat!.id
    };
    this.messages.push(newMessage);
    this.chatService.sendMessageById(message, userId)
        .subscribe((returnedMessage: Message) => { // Указываем, что returnedMessage имеет тип Message
          this.messageText = '';
          newMessage.id = returnedMessage.id; // Обновляем локальный ID сообщения в соответствии с ID, возвращенным сервером.
          newMessage.createTime = returnedMessage.createTime; // Обновляем временную метку, так как сервер может назначить другое время.
          // Scroll to the newly sent message
          setTimeout(() => {
            this.scrollToMessage(this.messages.length - 1);
          }, 0);
        })
  }
  scrollToMessage(index: number): void {
    try {
      this.messagesContainer.nativeElement.children[index].scrollIntoView({ behavior: 'smooth' });
    } catch(err) { }
  }
  scrollToFirstUnreadOrBottom(): void {
    // Найти первое не прочитанное сообщение от другого пользователя
    const firstUnreadMessageIndex = this.messages.findIndex(message => !message.readStatus && message.authorId !== this.user.id);

    if (firstUnreadMessageIndex !== -1) {
      // Найдено не прочитанное сообщение, прокрутить контейнер к этому элементу
      this.scrollToMessage(firstUnreadMessageIndex);
    } else {
      // Если не найдено непрочитанных сообщений, прокрутить до конца
      this.scrollToMessage(this.messages.length - 1);
    }
  }

  onScroll(event: any): void {
    const scrollTop = event.target.scrollTop;
    const scrollHeight = event.target.scrollHeight;
    const offsetHeight = event.target.offsetHeight;
    const isBottom = Math.ceil(scrollTop + offsetHeight) >= scrollHeight;

    if (isBottom) {
      // Если пользователь прокрутил до конца, обновите статусы прочтения сообщений.
      this.updateReadStatuses();
    }
  }

  updateReadStatuses(): void {
    const unreadMessages = this.messages.filter(message => !message.readStatus && message.authorId !== this.user.id);
    const unreadMessageIds = unreadMessages.map(message => message.id);

    if (unreadMessageIds.length > 0) {
      this.chatService.updateReadStatus(unreadMessageIds)
          .subscribe(() => {
            // Обновите статусы прочтения сообщений на клиенте после успешного ответа от сервера.
            unreadMessages.forEach(message => message.readStatus = true);
          });
    }
  }

}
