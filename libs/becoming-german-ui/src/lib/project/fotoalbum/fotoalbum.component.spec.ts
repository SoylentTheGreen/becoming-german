import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FotoalbumComponent } from './fotoalbum.component';

describe('FotoalbumComponent', () => {
  let component: FotoalbumComponent;
  let fixture: ComponentFixture<FotoalbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FotoalbumComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FotoalbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
