import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalManagerService {

  private statusModalState = new BehaviorSubject({
    show: false,
    game: null as any
  });

  statusModal$ = this.statusModalState.asObservable();

  openStatusModal(game: any) {
    this.statusModalState.next({
      show: true,
      game
    });
  }

  closeStatusModal() {
    this.statusModalState.next({
      show: false,
      game: null
    });
  }
}
