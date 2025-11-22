import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-playtime-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './playtime-modal.component.html',
  styleUrl: './playtime-modal.component.css'
})
export class PlaytimeModalComponent {

  @Input() showPlaytime = false;
  @Input() initialPlaytime = 0;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<number>();

  playtime = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['showPlaytime'] && this.showPlaytime) {
      this.playtime = this.initialPlaytime ?? 0;
    }
  }

  setPlaytime(value: number) {
    this.playtime = value;
  }

  onConfirm() {
    this.save.emit(this.playtime);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
