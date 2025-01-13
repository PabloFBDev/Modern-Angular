import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CategoryComponent } from '../../features/category/views/category/category.component';
import { TaskComponent } from '../../features/task/views/task/task.component';

const COMPONENTS = [CategoryComponent, TaskComponent];
const MODULES = [MatDividerModule];

@Component({
  selector: 'app-main',
  imports: [...COMPONENTS, ...MODULES],
  template: `
    <div class="h-screen flex w-full">
      <!-- Categories -->
      <app-category class="w-1/4" />

      <!-- Divisor -->
      <mat-divider class="h-full opacity-50" vertical />

      <!-- Tasks -->
      <app-task class="w-3/4" />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {}
