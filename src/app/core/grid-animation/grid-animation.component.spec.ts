import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAnimationComponent } from './grid-animation.component';
import { BallComponent } from '../ball/ball.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GridAnimation, GridAnimationType } from '../shared/GridAnimation';
import { BallState, BallColor } from '../shared/Ball';

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

  it('should properly put all input animations to the queue', () => {
    let animations: GridAnimation[];
    animations = [{
      type: GridAnimationType.Move, cells: [
        { id: 0, ball: { id: 0, state: BallState.idle, color: BallColor.red } },
        { id: 1, ball: { id: 1, state: BallState.idle, color: BallColor.red } },
        { id: 2, ball: { id: 2, state: BallState.idle, color: BallColor.red } },
      ]
    }];
    component.animation = animations;

    expect(component.animationQueue).toBeDefined();
    expect(component.animationQueue.length).toBe(1);

    animations = [
      {
        type: GridAnimationType.Move, cells: [
          { id: 0, ball: { id: 0, state: BallState.idle, color: BallColor.red } },
          { id: 1, ball: { id: 1, state: BallState.idle, color: BallColor.red } },
          { id: 2, ball: { id: 2, state: BallState.idle, color: BallColor.red } },
        ]
      },
      {
        type: GridAnimationType.Add, cells: [
          { id: 3, ball: { id: 3, state: BallState.idle, color: BallColor.red } },
          { id: 4, ball: { id: 4, state: BallState.idle, color: BallColor.red } },
          { id: 5, ball: { id: 5, state: BallState.idle, color: BallColor.red } },
        ]
      },
    ];
    component.animation = animations;
    expect(component.animationQueue.length).toBe(2);
  });

  it('should emit an event when all the animations are completed', (done) => {
    const animations = [
      {
        type: GridAnimationType.Move, cells: [
          { id: 0, ball: { id: 0, state: BallState.idle, color: BallColor.red } },
          { id: 1, ball: { id: 1, state: BallState.idle, color: BallColor.red } },
          { id: 2, ball: { id: 2, state: BallState.idle, color: BallColor.red } },
        ]
      },
      {
        type: GridAnimationType.Add, cells: [
          { id: 3, ball: { id: 3, state: BallState.idle, color: BallColor.red } },
          { id: 4, ball: { id: 4, state: BallState.idle, color: BallColor.red } },
          { id: 5, ball: { id: 5, state: BallState.idle, color: BallColor.red } },
        ]
      },
    ];
    component.completed.subscribe(() => {
      expect(component.animationQueue.length).toBe(0);
      done();
    });
    component.animation = animations;
    expect(component.animationQueue.length).toBe(2);
  });
});
