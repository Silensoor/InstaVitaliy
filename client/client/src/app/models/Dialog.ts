export interface Dialog{
  id: number;
  firstPersonId: number;
  secondPersonId: number;
  lastActiveTime: Date;
  lastMessage: string;
  image:File;
  secondPersonName:string;
  firstPersonName:string;
}
