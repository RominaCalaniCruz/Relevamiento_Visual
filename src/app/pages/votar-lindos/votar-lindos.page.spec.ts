import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VotarLindosPage } from './votar-lindos.page';

describe('VotarLindosPage', () => {
  let component: VotarLindosPage;
  let fixture: ComponentFixture<VotarLindosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VotarLindosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
