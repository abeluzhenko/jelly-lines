import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallComponent } from './ball.component';
import { Ball, BallColors, BallColor, BallState } from './ball.model';
import { By } from '@angular/platform-browser';

describe('BallComponent', () => {
  let component: BallComponent;
  let fixture: ComponentFixture<BallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
    for (const color of BallColors) {
      component.data = new Ball(0, color as BallColor);
      fixture.detectChanges();
      const ballEl = fixture.debugElement.query(By.css('.ball'));
      expect(ballEl.classes['color--' + color]).toBeTruthy();
    }
  });

  it('should render proper class', () => {
    component.data = new Ball(0);
    fixture.detectChanges();
    const ballEl = fixture.debugElement.query(By.css('.ball'));
    expect(ballEl.classes['active']).toBeFalsy();
    component.data.state = BallState.active;
    fixture.detectChanges();
    expect(ballEl.classes['active']).toBeTruthy();
  });

  it('should emit an event when clicked', done => {
    expect(component).toBeTruthy();
    component.clicked.subscribe(ball => {
      expect(ball).toBe(component.data);
      done();
    });
    fixture.debugElement.triggerEventHandler('click', {});
  });
});
