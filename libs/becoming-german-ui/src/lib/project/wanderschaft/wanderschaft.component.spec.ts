import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WanderschaftComponent } from './wanderschaft.component';

describe('WanderschaftComponent', () => {
  let component: WanderschaftComponent;
  let fixture: ComponentFixture<WanderschaftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WanderschaftComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WanderschaftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
