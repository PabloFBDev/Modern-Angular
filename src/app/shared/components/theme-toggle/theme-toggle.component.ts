import { Component, inject } from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIcon,
    MatIconButton,
    MatTooltipModule,
  ],
  template: `
    <button
      data-testid="button"
      type="button"
      mat-icon-button
      class="m-1 p-0"
      (click)="themeService.toggleColorTheme()"
      [matTooltip]="themeService.isCurrentThemeDark() ? 'Claro' : 'Escuro'">
      @if (themeService.isCurrentThemeDark()) {
        <mat-icon
          data-testid="icon-light-mode"
          class="font-icon text-amber-500">
          light_mode
        </mat-icon>
      } @else {
        <mat-icon data-testid="icon-dark-mode" class="font-icon text-sky-500">
          dark_mode
        </mat-icon>
      }
    </button>
  `,
  styles: ``,
})
export class ThemeToggleComponent {
  public themeService = inject(ThemeService);
}
