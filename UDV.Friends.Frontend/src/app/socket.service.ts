import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment.development';
import { IFindFriendsResponse, IFriendUpdateResponse } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly _socket: Socket;
  private readonly _channel: string;

  constructor() {
    this._socket = io(environment.BASE_URL);
    this._channel = environment.FRIEND_CHANNEL;
  }

  public onListenUpdate(
    callback: (payload: IFriendUpdateResponse) => void
  ): void {
    this._socket.on(this._channel, (payload: IFriendUpdateResponse) => {
      callback(payload);
    });
  }

  public emitGetFriends(payload: { page: number; limit: number }): void {
    this._socket.emit('get_friends', payload);
  }

  public onFriendsPage(callback: (data: IFindFriendsResponse) => void): void {
    this._socket.on('friends_page', (data: IFindFriendsResponse) => {
      callback(data);
    });
  }

  public onDisconnect(): void {
    this._socket.disconnect();
  }
}
