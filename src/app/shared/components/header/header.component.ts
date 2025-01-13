import { Component, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  imports: [ThemeToggleComponent, MatToolbarModule],
  template: `
    <mat-toolbar data-testid="matToolbar">
      <div class="flex justify-between w-full items-center">
        <span data-testid="title">{{ title() }}</span>
        <app-theme-toggle data-testid="themeToggle" />
      </div>
    </mat-toolbar>
  `,
  styles: ``,
})
export class HeaderComponent {
  title = signal('Gerenciador');
}
