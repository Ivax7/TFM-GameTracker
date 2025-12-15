import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomListModalComponent } from './custom-list-modal/custom-list-modal.component';
import { CustomListService } from '../../../services/custom-list.service';
import { CustomList } from '../../../models/custom-list.model';

@Component({
  selector: 'app-custom-lists',
  standalone: true,
  imports: [CommonModule, CustomListModalComponent],
  templateUrl: './custom-lists.component.html',
  styleUrls: ['./custom-lists.component.css']
})
export class CustomListsComponent implements OnInit {

  showCreateModal = false;
  lists: CustomList[] = [];

  constructor(
    private customListService: CustomListService
  ) {}

  ngOnInit() {
    this.customListService.getMyLists().subscribe(lists => {
      console.log('Lists from API:', lists);
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
    console.log(data)
    this.customListService.createList(data).subscribe(list => {
      console.log('Created list:', list);
      this.lists = [...this.lists, list];
    });
    this.closeModal();
  }


  trackById(index: number, list: CustomList) {
    return list.id;
  }

}
