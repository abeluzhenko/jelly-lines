import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BallComponent } from '../components/ball/ball.component';
import { CellComponent } from '../components/cell/cell.component';
import { GridComponent } from '../components/grid/grid.component';
import { UiComponent } from '../components/ui/ui.component';
import { GameComponent } from '../components/game/game.component';
import { GridAnimationComponent } from '../components/grid-animation/grid-animation.component';

@NgModule({
  imports: [ CommonModule ],
  exports: [ GameComponent ],
  declarations: [
    BallComponent,
    CellComponent,
    GridComponent,
    UiComponent,
    GridAnimationComponent,
    GameComponent,
  ]
})
export class CoreModule { }
