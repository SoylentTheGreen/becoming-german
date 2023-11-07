import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresseComponent } from './presse.component';

describe('PresseComponent', () => {
  let component: PresseComponent;
  let fixture: ComponentFixture<PresseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PresseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PresseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
