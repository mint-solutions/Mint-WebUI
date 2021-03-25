import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatestockComponent } from './createstock.component';

describe('CreatestockComponent', () => {
  let component: CreatestockComponent;
  let fixture: ComponentFixture<CreatestockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreatestockComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatestockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
