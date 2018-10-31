import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAnimationComponent } from './grid-animation.component';

describe('GridAnimationComponent', () => {
  let component: GridAnimationComponent;
  let fixture: ComponentFixture<GridAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridAnimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
