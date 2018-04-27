import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerExistComponent } from './marker-exist.component';

describe('MarkerExistComponent', () => {
  let component: MarkerExistComponent;
  let fixture: ComponentFixture<MarkerExistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkerExistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
