import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopIndieGamesComponent } from './top-indie-games.component';

describe('TopIndieGamesComponent', () => {
  let component: TopIndieGamesComponent;
  let fixture: ComponentFixture<TopIndieGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopIndieGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopIndieGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
