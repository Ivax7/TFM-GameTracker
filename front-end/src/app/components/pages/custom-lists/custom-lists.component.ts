import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomListModalComponent } from './custom-list-modal/custom-list-modal.component';
import { CustomListService } from '../../../services/custom-list.service';
import { CustomList } from '../../../models/custom-list.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-custom-lists',
  standalone: true,
  imports: [CommonModule, CustomListModalComponent, RouterLink],
  templateUrl: './custom-lists.component.html',
  styleUrls: ['./custom-lists.component.css']
})
export class CustomListsComponent implements OnInit {

  showCreateModal = false;
  lists: CustomList[] = [];
  listToEdit?: CustomList;

  constructor(
    private customListService: CustomListService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLists();
  }

  loadLists() {
    this.customListService.getMyLists().subscribe(lists => {
      this.lists = lists;
    });
  }

  openModal() {
    this.showCreateModal = true;
  }

  closeModal() {
    this.showCreateModal = false;
    this.listToEdit = undefined;
  }

  onCreateList(data: { title: string; description: string }) {
    this.customListService.createList(data).subscribe(list => {
      this.lists = [...this.lists, list];
      this.closeModal();
    });
  }

  trackById(index: number, list: CustomList) {
    return list.id;
  }

  deleteList(listId: number, event: MouseEvent) {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this list?')) {
      return;
    }

    this.customListService.deleteList(listId).subscribe({
      next: () => {
        this.lists = this.lists.filter(list => list.id !== listId);
      },
      error: err => {
        console.error(err);
        alert('Error deleting list');
      }
    });
  }

  editList(list: CustomList, event: MouseEvent) {
    event.stopPropagation();
    this.listToEdit = list;
    this.showCreateModal = true;
  }
  
  onUpdateList(data: { id: number; title: string; description: string }) {
    this.customListService.updateList(data.id, data).subscribe(updated => {
      this.lists = this.lists.map(list =>
        list.id === updated.id ? updated : list
      );
      this.closeModal();
    });
  }

}
