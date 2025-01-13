import { Component, inject, OnInit } from '@angular/core';
import { MainComponent } from './layouts/main/main.component';
import { ThemeService } from './services/theme.service';

const COMPONENTS = [MainComponent];

@Component({
  selector: 'app-root',
  imports: [...COMPONENTS],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    try {
      const currentColorTheme = this.themeService.getPreferredColorTheme();
      this.themeService.setColorTheme(currentColorTheme);
    } catch (error) {
      console.error('Error fetching theme:', error);
    }
  }
}
