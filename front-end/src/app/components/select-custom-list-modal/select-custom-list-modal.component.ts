import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomListService } from '../../services/custom-list.service';
import { ModalManagerService } from '../../services/modal-manager.service';
import { CustomList } from '../../models/custom-list.model';

@Component({
  selector: 'app-select-custom-list-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-custom-list-modal.component.html',
  styleUrls: ['./select-custom-list-modal.component.css']
})
export class SelectCustomListModalComponent implements OnInit {

  @Input() show = false;
  @Input() game!: any;

  lists: CustomList[] = [];
  selectedListId: number | null = null;

  constructor(
    private customListService: CustomListService,
    public modalManager: ModalManagerService
  ) {}

  ngOnInit() {
    this.customListService.getMyLists().subscribe(lists => {
      this.lists = lists;
    });
  }

  save() {
    if (!this.selectedListId || !this.game) return;

    this.customListService.addGameToList(this.selectedListId, {
      id: this.game.id,
      name: this.game.name,
      background_image: this.game.background_image
    }).subscribe(() => {
      this.modalManager.closeCustomListModal();
    });
  }
}
