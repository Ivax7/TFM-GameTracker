import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionStatusComponent } from './collection-status.component';

describe('CollectionStatusComponent', () => {
  let component: CollectionStatusComponent;
  let fixture: ComponentFixture<CollectionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
