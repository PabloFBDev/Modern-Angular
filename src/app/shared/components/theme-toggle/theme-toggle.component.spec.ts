import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '../../../services/theme.service';
import { ThemeToggleComponent } from './theme-toggle.component';

describe(ThemeToggleComponent.name, () => {
  let component: ThemeToggleComponent;
  let fixture: ComponentFixture<ThemeToggleComponent>;
  let themeServiceMock: jest.Mocked<ThemeService>; // Mockado com Jest

  beforeEach(async () => {
    // Mock do ThemeService com Jest
    themeServiceMock = {
      toggleColorTheme: jest.fn(),
      isCurrentThemeDark: jest.fn(),
    } as unknown as jest.Mocked<ThemeService>;

    // Configuração do ambiente de teste
    await TestBed.configureTestingModule({
      imports: [
        ThemeToggleComponent,
        MatButtonModule,
        MatCardModule,
        MatTooltipModule,
      ],
      providers: [{ provide: ThemeService, useValue: themeServiceMock }],
    }).compileComponents();

    // Criando o componente e o fixture
    fixture = TestBed.createComponent(ThemeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar toggleColorTheme quando o botão for clicado', () => {
    const button = fixture.nativeElement.querySelector('[data-testid=button]');
    button.click();
    fixture.detectChanges();
    expect(themeServiceMock.toggleColorTheme).toHaveBeenCalled();
  });

  it('deve exibir o ícone "light_mode" quando o tema estiver escuro', () => {
    themeServiceMock.isCurrentThemeDark.mockReturnValue(true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector(
      '[data-testid=icon-light-mode]'
    );
    expect(icon.textContent.trim()).toBe('light_mode');
  });

  it('deve exibir o ícone "dark_mode" quando o tema estiver claro', () => {
    themeServiceMock.isCurrentThemeDark.mockReturnValue(false);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector(
      '[data-testid=icon-dark-mode]'
    );
    expect(icon.textContent.trim()).toBe('dark_mode');
  });

  it('não deve exibir o ícone "dark_mode" quando o tema estiver escuro', () => {
    themeServiceMock.isCurrentThemeDark.mockReturnValue(true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector(
      '[data-testid=icon-dark-mode]'
    );
    expect(icon).toBeNull();
  });

  it('deve exibir o tooltip "Claro" quando o tema estiver escuro', () => {
    themeServiceMock.isCurrentThemeDark.mockReturnValue(true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('[data-testid=button]');
    expect(button.getAttribute('ng-reflect-message')).toBe('Claro');
  });

  it('deve exibir o tooltip "Escuro" quando o tema estiver claro', () => {
    themeServiceMock.isCurrentThemeDark.mockReturnValue(false);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('[data-testid=button]');
    expect(button.getAttribute('ng-reflect-message')).toBe('Escuro');
  });
});
