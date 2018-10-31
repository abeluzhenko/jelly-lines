import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAnimationComponent } from './grid-animation.component';
import { BallComponent } from '../ball/ball.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GridAnimationComponent', () => {
  let component: GridAnimationComponent;
  let fixture: ComponentFixture<GridAnimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule ],
      declarations: [ GridAnimationComponent, BallComponent ]
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
