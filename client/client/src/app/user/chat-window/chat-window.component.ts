import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit{
  ngOnInit(): void {
  }
  @Input() selectedChat:any = null;
  constructor() {
  }

}
