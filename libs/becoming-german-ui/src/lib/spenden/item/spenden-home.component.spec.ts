import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpendenHomeComponent } from './spenden-home.component';

describe('SpendenHomeComponent', () => {
  let component: SpendenHomeComponent;
  let fixture: ComponentFixture<SpendenHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpendenHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendenHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
