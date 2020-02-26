import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';
import { BallComponent } from '../ball/ball.component';
import { BallState, BallColor } from '../shared/Ball';
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

  // TODO: replace with async test
  it('should emit an event when clicked', (done) => {
    component.cell = {
      id: 0,
      ball: { id: 0, state: BallState.idle, color: BallColor.red }
    };

    component.clicked.subscribe((cell) => {
      expect(cell).toBe(component.cell);
      done();
    });

    fixture.debugElement.triggerEventHandler('click', {});
  });
});
