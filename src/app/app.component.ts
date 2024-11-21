import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);

  public ngOnInit(): void {
    const currentColorTheme = this.themeService.getPreferredColorTheme();
    this.themeService.setColorTheme(currentColorTheme);
  }
}
