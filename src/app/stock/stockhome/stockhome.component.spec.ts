import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockhomeComponent } from './stockhome.component';

describe('StockhomeComponent', () => {
  let component: StockhomeComponent;
  let fixture: ComponentFixture<StockhomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StockhomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
