import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';
import { BallComponent } from '../ball/ball.component';
import { Cell } from './cell.model';
import { Ball } from '../ball/ball.model';
import { By } from '@angular/platform-browser';

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellComponent, BallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should promote an event when ball is clicked', done => {
    component.data = new Cell(new Ball());
    fixture.detectChanges();
    component.ballClicked.subscribe(ball => {
      expect(ball).toBe(component.data.ball);
      done();
    });
    const ballEl = fixture.debugElement.query(By.css('.ball'));
    ballEl.nativeElement.click();
    fixture.detectChanges();
  });

  it('should emit an event when clicked', done => {
    component.data = new Cell(new Ball());
    component.clicked.subscribe(cell => {
      expect(cell).toBe(component.data);
      done();
    });
    fixture.debugElement.triggerEventHandler('click', {});
  });
});
