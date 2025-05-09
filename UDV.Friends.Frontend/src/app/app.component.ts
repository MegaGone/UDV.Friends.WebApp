import {
  IFindFriendsResponse,
  IFriend,
  IFriendUpdateResponse,
} from './interfaces';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './socket.service';
import { MatTableModule } from '@angular/material/table';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, MatTableModule, MatPaginatorModule],
})
export class AppComponent implements OnInit, OnDestroy {
  public total = 0;
  public limit = 10;

  public title = 'UDV.Friends.Frontend';

  public friends: Array<IFriend> = [];
  private readonly _socketService = inject(SocketService);
  public displayedColumns: Array<string> = ['id', 'name', 'gender'];

  ngOnInit(): void {
    this._onListenUpdate();
    this._loadFriendsPage();
  }

  private _onListenUpdate(): void {
    this._socketService.onListenUpdate((payload: IFriendUpdateResponse) => {
      console.log('Cambio recibido desde el backend:', payload);

      const index = this.friends.findIndex(
        (friend) => friend.id === payload.new.id
      );

      if (index !== -1) {
        this.friends[index] = payload.new;
      } else {
        this.friends.push(payload.new);
      }
    });
  }

  private _loadFriendsPage(page: number = 1, limit: number = 10): void {
    this._socketService.emitGetFriends({ page, limit });

    this._socketService.onFriendsPage((res: IFindFriendsResponse) => {
      this.total = res.total;
      this.limit = res.limit;
      this.friends = res.data;
    });
  }

  public onPageChange(event: PageEvent): void {
    const newPage = event.pageIndex + 1;
    const newLimit = event.pageSize;
    this._loadFriendsPage(newPage, newLimit);
  }

  ngOnDestroy(): void {
    this._socketService.onDisconnect();
  }
}
