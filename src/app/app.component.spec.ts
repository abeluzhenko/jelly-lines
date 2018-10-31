import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { CellComponent } from './cell/cell.component';
import { BallComponent } from './ball/ball.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UiComponent } from './ui/ui.component';
import { GameComponent } from './game/game.component';
import { GridAnimationComponent } from './grid-animation/grid-animation.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule
      ],
      declarations: [
        AppComponent,
        GridComponent,
        CellComponent,
        BallComponent,
        UiComponent,
        GridAnimationComponent,
        GameComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
