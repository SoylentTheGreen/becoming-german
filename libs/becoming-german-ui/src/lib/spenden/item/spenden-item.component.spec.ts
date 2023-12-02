import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpendenItemComponent } from './spenden-item.component';

describe('SpendenItemComponent', () => {
  let component: SpendenItemComponent;
  let fixture: ComponentFixture<SpendenItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendenItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendenItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
