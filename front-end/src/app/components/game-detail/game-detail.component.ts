import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RawgService } from '../../services/rawg.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [],
  templateUrl: './game-detail.component.html',
  styleUrl: './game-detail.component.css'
})
export class GameDetailComponent {

  gameId!: number;
  game: any;

  constructor(
    private route: ActivatedRoute,
    private rawgService: RawgService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.gameId = Number(params.get('id'));
      this.loadGame();
    });
  }

  loadGame() {
    this.rawgService.getGameById(this.gameId).subscribe((data: any) => {
      this.game = data;
    })
  }

}
