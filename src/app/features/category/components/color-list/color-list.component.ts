import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

const MODULES = [MatDividerModule];

@Component({
  selector: 'app-color-list',
  imports: [...MODULES],
  template: `
    <section class="flex flex-col gap-4">
      <!-- Divisor -->
      <mat-divider class="opacity-50" />

      <!-- Color list -->
      <div>LIST</div>
    </section>
  `,
})
export class ColorListComponent {}
