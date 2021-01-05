import { TestBed, async } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/services/core.module';
import { AppComponent } from './app.component';
import { GridService } from './core/services/grid.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        CoreModule,
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        GridService,
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));
});
