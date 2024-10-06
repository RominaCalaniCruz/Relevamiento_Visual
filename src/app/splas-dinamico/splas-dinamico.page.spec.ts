import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplasDinamicoPage } from './splas-dinamico.page';

describe('SplasDinamicoPage', () => {
  let component: SplasDinamicoPage;
  let fixture: ComponentFixture<SplasDinamicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SplasDinamicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
