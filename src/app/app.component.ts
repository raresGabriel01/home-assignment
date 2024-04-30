import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TGridComponent } from './components/t-grid/t-grid.component';
import { TProgressComponent } from './components/t-progress/t-progress.component';
import { MockUser, createMockData } from '../stories/t-grid/utils';
import { TColumnComponent } from './components/t-column/t-column.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TGridComponent, TColumnComponent, TProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  data: MockUser[] = createMockData(100);
}
