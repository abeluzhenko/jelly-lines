import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { GridComponent } from '../grid/grid.component';
import { CellComponent } from '../cell/cell.component';
import { BallComponent } from '../ball/ball.component';
import { UiComponent } from '../ui/ui.component';
import { GridService } from '../grid.service';
import { AnimationBuilder } from '@angular/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ NoopAnimationsModule ],
      declarations: [
        GameComponent,
        GridComponent,
        CellComponent,
        BallComponent,
        UiComponent
      ],
      providers: [
        GridService,
        AnimationBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});