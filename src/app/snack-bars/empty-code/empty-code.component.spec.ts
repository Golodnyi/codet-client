import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyCodeComponent } from './empty-code.component';

describe('EmptyCodeComponent', () => {
  let component: EmptyCodeComponent;
  let fixture: ComponentFixture<EmptyCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
