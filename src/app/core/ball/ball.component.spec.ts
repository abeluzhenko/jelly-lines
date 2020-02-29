import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallComponent } from './ball.component';
import { BallColor, BallState } from '../shared/Ball';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';


const DEFAULT_BALL_COLOR = BallColor.purple;

describe('BallComponent', () => {
  let component: BallComponent;
  let fixture: ComponentFixture<BallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule
      ],
      declarations: [ BallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render proper color', () => {
    component.ball = { id: 0, state: BallState.idle, color: DEFAULT_BALL_COLOR };

    fixture.detectChanges();

    const ballEl = fixture.debugElement.query(By.css('.ball'));
    expect(ballEl.classes[DEFAULT_BALL_COLOR]).toBeTruthy();
  });

  describe('should render proper class for the ball', () => {
    let ballEl: DebugElement;

    beforeEach(() => {
      component.ball = { id: 0, state: BallState.idle, color: DEFAULT_BALL_COLOR };

      fixture.detectChanges();

      ballEl = fixture.debugElement.query(By.css('.ball'));
    });

    it('should be inactive', () => {
      expect(ballEl.classes['active']).toBeFalsy();
    });

    it('should be active', () => {
      component.ball = { id: 0, state: BallState.active, color: BallColor.red };
      fixture.detectChanges();

      expect(ballEl.classes['active']).toBeTruthy();
    });
  });
});
