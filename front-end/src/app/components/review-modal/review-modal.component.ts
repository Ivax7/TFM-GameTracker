import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.css']
})
export class ReviewModalComponent {

  @Input() showReview: boolean = false;
  @Input() initialReview: string = '';
  @Input() game: any;


  @Output() save = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  reviewText = '';

  ngOnChanges(changes: SimpleChanges) {
    if(changes['showReview'] && this.showReview) {
      this.reviewText = '';
    }
  }
}
