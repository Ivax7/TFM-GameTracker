import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomListModalComponent } from './custom-list-modal.component';

describe('CustomListModalComponent', () => {
  let component: CustomListModalComponent;
  let fixture: ComponentFixture<CustomListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomListModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
