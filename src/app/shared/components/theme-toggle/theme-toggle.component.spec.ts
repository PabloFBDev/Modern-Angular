import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../services/theme.service';
import { ThemeToggleComponent } from './theme-toggle.component';

describe(ThemeToggleComponent.name, () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    themeServiceSpy = jasmine.createSpyObj('ThemeService', [
      'toggleColorTheme',
      'isCurrentThemeDark',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ThemeToggleComponent,
        MatButtonModule,
        MatCardModule,
        MatIcon,
        MatIconButton,
        MatTooltipModule,
      ],
      providers: [{ provide: ThemeService, useValue: themeServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleColorTheme when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('[data-testid=button]');
    button.click();
    fixture.detectChanges();
    expect(themeServiceSpy.toggleColorTheme).toHaveBeenCalled();
  });

  it('should display light_mode icon when theme is dark', () => {
    themeServiceSpy.isCurrentThemeDark.and.returnValue(true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector(
      '[data-testid=icon-light-mode]'
    );
    expect(icon.textContent.trim())
      .withContext('Expected light_mode icon when theme is dark')
      .toBe('light_mode');
  });

  it('should display dark_mode icon when theme is light', () => {
    themeServiceSpy.isCurrentThemeDark.and.returnValue(false);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector(
      '[data-testid=icon-dark-mode]'
    );
    expect(icon.textContent.trim())
      .withContext('Expected dark_mode icon when theme is light')
      .toBe('dark_mode');
  });

  it('should not display dark_mode icon when theme is dark', () => {
    themeServiceSpy.isCurrentThemeDark.and.returnValue(true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector(
      '[data-testid=icon-dark-mode]'
    );
    expect(icon).toBeNull();
  });

  it('should display "Claro" tooltip when theme is dark', () => {
    themeServiceSpy.isCurrentThemeDark.and.returnValue(true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('[data-testid=button]');
    expect(button.getAttribute('ng-reflect-message')).toBe('Claro');
  });

  it('should display "Escuro" tooltip when theme is light', () => {
    themeServiceSpy.isCurrentThemeDark.and.returnValue(false);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('[data-testid=button]');
    expect(button.getAttribute('ng-reflect-message')).toBe('Escuro');
  });
});
