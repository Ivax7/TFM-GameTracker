import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-list-modal.component.html',
  styleUrls: ['./custom-list-modal.component.css']
})
export class CustomListModalComponent {

  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<{ title: string; description: string }>();

  title = '';
  description = '';

  submit() {
    if (!this.title.trim()) return;

    this.create.emit({
      title: this.title.trim(),
      description: this.description.trim()
    });
  }
}
