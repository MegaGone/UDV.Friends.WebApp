import {
  OnInit,
  inject,
  OnDestroy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  IFriend,
  IFindFriendsResponse,
  IFriendUpdateResponse,
} from './interfaces';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './socket.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterOutlet, CommonModule, MatTableModule, MatPaginatorModule],
})
export class AppComponent implements OnInit, OnDestroy {
  public total = 0;
  public limit = 10;

  public title = 'UDV.Friends.Frontend';

  public friends: Array<IFriend> = [];
  private readonly _socketService = inject(SocketService);
  public displayedColumns: Array<string> = [
    'id',
    'name',
    'gender',
    'createdAt',
    'updatedAt',
  ];

  ngOnInit(): void {
    this._onListenUpdate();
    this._loadFriendsPage();
  }

  private _onListenUpdate(): void {
    this._socketService.onListenUpdate((payload: IFriendUpdateResponse) => {
      Swal.fire({
        icon: 'info',
        confirmButtonText: 'Aceptar',
        title: 'Actualización de usuario',
        text: `Se ha actualizado el usuario: ${payload?.old?.name} con el nuevo nombre: ${payload?.new?.name}`,
      });

      this._updateFriendList(payload.new);
    });
  }

  private _updateFriendList(updatedFriend: IFriend): void {
    const index = this.friends.findIndex(
      (friend) => friend.id === updatedFriend.id
    );

    this.friends =
      index !== -1
        ? [
            ...this.friends.slice(0, index),
            updatedFriend,
            ...this.friends.slice(index + 1),
          ]
        : [...this.friends, updatedFriend];
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
