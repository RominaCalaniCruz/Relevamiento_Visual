import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VotarFeosPage } from './votar-feos.page';

describe('VotarFeosPage', () => {
  let component: VotarFeosPage;
  let fixture: ComponentFixture<VotarFeosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VotarFeosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
