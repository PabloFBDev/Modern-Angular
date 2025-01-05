import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { HeaderComponent } from './shared/components/header/header.component';

describe(AppComponent.name, () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: jest.Mocked<ThemeService>;

  beforeEach(async () => {
    // Mock do ThemeService usando Jest
    service = {
      getPreferredColorTheme: jest.fn().mockReturnValue('dark'),
      setColorTheme: jest.fn(),
      isCurrentThemeDark: jest.fn().mockReturnValue(true), // Configurado como método
    } as unknown as jest.Mocked<ThemeService>;

    // Configurando o ambiente de testes
    await TestBed.configureTestingModule({
      imports: [AppComponent, HeaderComponent],
      providers: [{ provide: ThemeService, useValue: service }],
    }).compileComponents();

    // Criando o componente e o fixture
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  it('deve criar o aplicativo', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o HeaderComponent', () => {
    fixture.detectChanges(); // Garante que a renderização do DOM seja concluída
    const headerElement = fixture.debugElement.nativeElement.querySelector(
      '[data-testid=header]'
    );
    expect(headerElement).toBeTruthy();
  });

  describe('Método ngOnInit', () => {
    it('deve chamar os métodos do ThemeService corretamente', () => {
      component.ngOnInit(); // Executa o ciclo de inicialização

      expect(service.getPreferredColorTheme).toHaveBeenCalledTimes(1);
      expect(service.setColorTheme).toHaveBeenCalledWith('dark');
    });

    it('deve lidar com temas diferentes retornados pelo ThemeService', () => {
      service.getPreferredColorTheme.mockReturnValue('light'); // Simula outro tema
      component.ngOnInit();

      expect(service.setColorTheme).toHaveBeenCalledWith('light');
    });

    it('deve lidar graciosamente com erros no ThemeService', () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      service.getPreferredColorTheme.mockImplementation(() => {
        throw new Error('Error fetching theme');
      });

      component.ngOnInit();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching theme:',
        expect.any(Error)
      );
      expect(service.setColorTheme).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore(); // Restaura o console.error original
    });
  });
});
