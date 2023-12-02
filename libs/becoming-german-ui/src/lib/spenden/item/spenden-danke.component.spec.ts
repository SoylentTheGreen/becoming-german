import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpendenDankeComponent } from './spenden-danke.component';

describe('SpendenDankeComponent', () => {
  let component: SpendenDankeComponent;
  let fixture: ComponentFixture<SpendenDankeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendenDankeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpendenDankeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
