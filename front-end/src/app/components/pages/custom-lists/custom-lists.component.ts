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
}
