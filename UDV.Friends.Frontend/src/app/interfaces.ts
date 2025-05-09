export interface IFriend {
  id: number;
  name: string;
  gender: string;
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
