export interface Message {
  id: number;
  authorId: number;
  messageText: string;
  readStatus: boolean;
  createTime: Date;
  dialogId: number;
}
