import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridComponent } from './grid.component';
import { CellComponent } from '../cell/cell.component';
import { BallComponent } from '../ball/ball.component';
import { By } from '@angular/platform-browser';
import { GridService } from '../grid.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Grid } from '../grid.model';
import { UiComponent } from '../ui/ui.component';
import { AnimationBuilder } from '@angular/animations';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule
      ],
      declarations: [
        GridComponent,
        CellComponent,
        BallComponent,
        UiComponent
      ],
      providers: [
        AnimationBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly dispatch cell click', () => {
    component.data = { cells: Grid.getRandomGrid() };
    fixture.detectChanges();
    const cellEls = fixture.debugElement.queryAll(By.css('app-cell'));
    expect(cellEls.length).toBe(component.data.cells.length);

    const onClickSpy = spyOn(component, 'cellClicked').and.callThrough();

    for (let i = 0; i < cellEls.length; i++) {
      const cellEl = cellEls[i];
      cellEl.nativeElement.click();
      fixture.detectChanges();
    }
    expect(onClickSpy).toHaveBeenCalledTimes(component.data.cells.length);
  });
});
