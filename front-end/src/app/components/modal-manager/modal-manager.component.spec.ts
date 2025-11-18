import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalManagerComponent } from './modal-manager.component';

describe('ModalManagerComponent', () => {
  let component: ModalManagerComponent;
  let fixture: ComponentFixture<ModalManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
