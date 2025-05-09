export interface IFriend {
  id: number;
  name: string;
  gender: string;
  created_at: Date;
  updated_at: Date;
}

export interface IFindFriendsResponse {
  total: number;
  limit: number;
  data: Array<IFriend>;
}

export interface IFriendUpdateResponse {
  table: string;
  old: IFriend;
  new: IFriend;
}
