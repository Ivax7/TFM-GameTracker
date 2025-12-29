import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top250GamesComponent } from './top-250-games.component';

describe('Top250GamesComponent', () => {
  let component: Top250GamesComponent;
  let fixture: ComponentFixture<Top250GamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Top250GamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Top250GamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
