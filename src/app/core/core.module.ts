import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BallComponent } from './ball/ball.component';
import { CellComponent } from './cell/cell.component';
import { GridComponent } from './grid/grid.component';
import { UiComponent } from './ui/ui.component';
import { GameComponent } from './game/game.component';
import { GridAnimationComponent } from './grid-animation/grid-animation.component';
import { GridService } from './grid.service';

@NgModule({
  imports: [
    CommonModule,
    BallComponent,
    CellComponent,
    GridComponent,
    UiComponent,
    GridAnimationComponent,
    GameComponent,
  ],
  exports: [ GameComponent ],
  providers: [ GridService ],
  declarations: []
})
export class CoreModule { }
