import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallComponent } from './ball.component';
import { BallColors, BallColor, BallState } from '../../shared/Ball';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
    for (const color of BallColors) {
      component.data = { id: 0, state: BallState.idle, color: color as BallColor };
      fixture.detectChanges();
      const ballEl = fixture.debugElement.query(By.css('.ball'));
      expect(ballEl.classes[color]).toBeTruthy();
    }
  });

  it('should render proper class', () => {
    component.data = { id: 0, state: BallState.idle, color: BallColor.red };
    fixture.detectChanges();
    const ballEl = fixture.debugElement.query(By.css('.ball'));
    const shadowEl = fixture.debugElement.query(By.css('.ball'));
    expect(ballEl.classes['active']).toBeFalsy();
    expect(shadowEl.classes['active']).toBeFalsy();
    component.data = { id: 0, state: BallState.active, color: BallColor.red };
    fixture.detectChanges();
    expect(ballEl.classes['active']).toBeTruthy();
    expect(shadowEl.classes['active']).toBeTruthy();
  });
});
