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
  @Input() currentStatus: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() selectStatus = new EventEmitter<string>();

  statuses = [
    { key: 'Playing', label: 'Playing' },
    { key: 'Played', label: 'Played' },
    { key: 'Completed', label: 'Completed 100%' },
    { key: 'Abandoned', label: 'Abandoned' },
  ];

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
