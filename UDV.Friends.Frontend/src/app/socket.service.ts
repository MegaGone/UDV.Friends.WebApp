import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../environments/environment.development';

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

  public onListenUpdate(callback: (payload: unknown) => void): void {
    this._socket.on(this._channel, (payload: unknown) => {
      callback(payload);
    });
  }

  public emitGetFriends(payload: { page: number; limit: number }): void {
    this._socket.emit('get_friends', payload);
  }

  public onFriendsPage(callback: (data: any) => void): void {
    this._socket.on('friends_page', (data) => {
      callback(data);
    });
  }

  public onDisconnect(): void {
    this._socket.disconnect();
  }
}
