import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { SuggestionService } from '../../../services/suggestion.service';
import { Suggestion } from '../../../models/suggestion.model';
import { AlertService } from '../../../services/alert.service';
@Component({
  selector: 'app-suggestions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {

  showSuggestionModal = false;
  title = '';
  suggestionText = '';
  suggestions: Suggestion[] = [];

  constructor(
    private suggestionService: SuggestionService,
    public auth: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadSuggestions();
  }

  loadSuggestions() {
    this.suggestionService.getSuggestions().subscribe({
      next: (data) => this.suggestions = data,
      error: (err) => console.error('Error loading suggestions:', err)
    });
  }

  uploadSuggestionModal() {
    if (!this.title.trim() || !this.suggestionText.trim()) {
      alert('Suggestion cannot be empty.');
      return;
    }

    const user = this.auth.getCurrentUser();
    if (!user) {
      alert('You must be logged in to send suggestions.');
      return;
    }

    const newSuggestion: Suggestion = {
      title: this.title,
      suggestion: this.suggestionText,
      userId: user.username,
      userName: user.username,
      date: new Date()
    };

    this.suggestionService.createSuggestion(newSuggestion).subscribe({
      next: () => {
        this.showSuggestionModal = false;
        this.title = '';
        this.suggestionText = '';
        this.loadSuggestions();
        this.alertService.show('SUGGESTION_POSTED');
      },
      error: (err) => {
        console.log(err);
        alert('Something went wrong, please try again.');
      }
    });
  }



}
