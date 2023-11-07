import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondaryNav2Component } from './secondary-nav2.component';

describe('SecondaryNav2Component', () => {
  let component: SecondaryNav2Component;
  let fixture: ComponentFixture<SecondaryNav2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondaryNav2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryNav2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
