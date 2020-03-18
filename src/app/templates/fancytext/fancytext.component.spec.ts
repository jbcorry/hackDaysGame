import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FancytextComponent } from './fancytext.component';

describe('FancytextComponent', () => {
  let component: FancytextComponent;
  let fixture: ComponentFixture<FancytextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FancytextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FancytextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
