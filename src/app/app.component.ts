import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
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
