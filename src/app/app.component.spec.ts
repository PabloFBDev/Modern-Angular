import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ThemeService } from './services/theme.service';
import { HeaderComponent } from './shared/components/header/header.component';

describe(AppComponent.name, () => {
  let component: AppComponent; // Referência para o componente a ser testado
  let fixture: ComponentFixture<AppComponent>; // Representação do componente no ambiente de testes
  let themeServiceSpy: jasmine.SpyObj<ThemeService>; // Mock do serviço ThemeService

  beforeEach(async () => {
    // Criando um mock para ThemeService com métodos espiados
    themeServiceSpy = jasmine.createSpyObj('ThemeService', [
      'getPreferredColorTheme',
      'setColorTheme',
    ]);

    // Configurando o mock para retornar "dark" por padrão
    themeServiceSpy.getPreferredColorTheme.and.returnValue('dark');

    // Configurando o ambiente de testes para o AppComponent
    await TestBed.configureTestingModule({
      imports: [AppComponent, HeaderComponent], // Declarando os componentes utilizados
      providers: [{ provide: ThemeService, useValue: themeServiceSpy }], // Injetando o mock do ThemeService
    }).compileComponents();

    // Criando uma instância do componente e do fixture
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy(); // Valida se o componente foi inicializado
  });

  it('should render the HeaderComponent', () => {
    const headerElement =
      fixture.debugElement.nativeElement.querySelector('app-header');
    expect(headerElement).toBeTruthy(); // Verifica se o HeaderComponent foi renderizado no DOM
  });

  it('should call ThemeService methods on ngOnInit', () => {
    component.ngOnInit(); // Executa o ciclo de inicialização do componente

    expect(themeServiceSpy.getPreferredColorTheme).toHaveBeenCalledTimes(1); // Verifica se o método foi chamado uma vez
    expect(themeServiceSpy.setColorTheme).toHaveBeenCalledWith('dark'); // Verifica se o tema "dark" foi configurado
  });

  it('should handle different themes returned by ThemeService', () => {
    themeServiceSpy.getPreferredColorTheme.and.returnValue('light'); // Simula o retorno de um tema diferente
    component.ngOnInit(); // Executa o ciclo de inicialização do componente

    expect(themeServiceSpy.setColorTheme).toHaveBeenCalledWith('light'); // Verifica se o tema "light" foi configurado
  });

  it('should handle errors in ThemeService gracefully', () => {
    spyOn(console, 'error'); // Espião para capturar logs de erro
    themeServiceSpy.getPreferredColorTheme.and.throwError(
      'Error fetching theme'
    );

    component.ngOnInit(); // Executa o método ngOnInit

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching theme:',
      jasmine.any(Error)
    );
    expect(themeServiceSpy.setColorTheme).not.toHaveBeenCalled(); // Não deve chamar setColorTheme
  });
});
