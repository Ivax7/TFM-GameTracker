import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CustomList } from '../../../../models/custom-list.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-list-modal.component.html',
  styleUrls: ['./custom-list-modal.component.css']
})
export class CustomListModalComponent implements OnInit {

  @Input() list?: CustomList;
  
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<{ title: string; description: string }>();
  @Output() update = new EventEmitter<{
    id: number;
    title: string;
    description: string;
  }>();
  
  title = '';
  description = '';

    ngOnInit() {
    if (this.list) {
      this.title = this.list.title;
      this.description = this.list.description ?? '';
    }
  }

  submit() {
    if (!this.title.trim()) return;

    const payload = {
      title: this.title.trim(),
      description: this.description.trim()
    };

    if (this.list) {
      this.update.emit({
        id: this.list.id,
        ...payload
      });
    } else {
      this.create.emit(payload);
    }
  }




}
