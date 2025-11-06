import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-status-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-status-modal.component.html',
  styleUrl: './game-status-modal.component.css'
})
export class GameStatusModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Output() selectStatus = new EventEmitter<string>();

  statuses = ['Playing', 'Played', 'Completed 100%', 'Abandoned'];

  onSelect(status: string, event: MouseEvent) {
    event.stopPropagation();
    this.selectStatus.emit(status);
    this.close.emit();
  }
  
  onBackdropClick(event: MouseEvent) {
    event.stopPropagation();
    this.close.emit();
  }
  
  onCloseClick(event: MouseEvent) {
    event.stopPropagation();
    this.close.emit();
  }
}
