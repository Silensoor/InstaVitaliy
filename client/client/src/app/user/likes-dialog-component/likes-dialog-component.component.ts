import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-likes-dialog-component',
  templateUrl: './likes-dialog-component.component.html',
  styleUrls: ['./likes-dialog-component.component.css']
})
export class LikesDialogComponentComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {users: string[]}) {}
}
