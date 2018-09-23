import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';
import { BallComponent } from '../ball/ball.component';
import { Cell } from './cell.model';
import { Ball, BallState, BallColor } from '../ball/ball.model';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule
      ],
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

  it('should emit an event when clicked', done => {
    component.data = new Cell(0, { id: 0, state: BallState.idle, color: BallColor.red });
    component.clicked.subscribe(cell => {
      expect(cell).toBe(component.data);
      done();
    });
    fixture.debugElement.triggerEventHandler('click', {});
  });
});
