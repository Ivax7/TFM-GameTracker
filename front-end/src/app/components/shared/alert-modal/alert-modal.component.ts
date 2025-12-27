import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPayload } from './alert.types';
import { SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.css'
})
export class AlertModalComponent {
  @Input() alert: AlertPayload | null = null;
  @Output() close = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alert'] && this.alert) {
      setTimeout(() => this.close.emit(), 5000);
    }
  }
}
