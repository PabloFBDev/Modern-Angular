import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockDocument: Document;

  beforeEach(() => {
    mockDocument = {
      documentElement: {
        classList: {
          add: jasmine.createSpy('add'),
          remove: jasmine.createSpy('remove'),
        },
      },
    } as unknown as Document;

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: DOCUMENT, useValue: mockDocument }],
    });

    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPreferredColorTheme', () => {
    it('should return "light" if no theme is stored', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
      const result = service.getPreferredColorTheme();
      expect(result).toBe('light');
    });

    it('should return "dark" if "dark" is stored in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify({ colorTheme: 'dark' })
      );
      const result = service.getPreferredColorTheme();
      expect(result).toBe('dark');
    });

    it('should return "light" if "light" is stored in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(
        JSON.stringify({ colorTheme: 'light' })
      );
      const result = service.getPreferredColorTheme();
      expect(result).toBe('light');
    });
  });

  describe('setColorTheme', () => {
    it('should add "dark" class to document if theme is "dark"', () => {
      service.setColorTheme('dark');
      expect(mockDocument.documentElement.classList.add).toHaveBeenCalledWith(
        'dark'
      );
      expect(
        mockDocument.documentElement.classList.remove
      ).not.toHaveBeenCalled();
    });

    it('should remove "dark" class from document if theme is "light"', () => {
      service.setColorTheme('light');
      expect(
        mockDocument.documentElement.classList.remove
      ).toHaveBeenCalledWith('dark');
      expect(mockDocument.documentElement.classList.add).not.toHaveBeenCalled();
    });

    it('should update isCurrentThemeDark signal correctly', () => {
      service.setColorTheme('dark');
      expect(service.isCurrentThemeDark()).toBeTrue();

      service.setColorTheme('light');
      expect(service.isCurrentThemeDark()).toBeFalse();
    });
  });

  describe('toggleColorTheme', () => {
    it('should toggle to "dark" if current theme is "light"', () => {
      spyOn(localStorage, 'setItem');
      service.isCurrentThemeDark.set(false);

      service.toggleColorTheme();

      expect(service.isCurrentThemeDark()).toBeTrue();
      expect(mockDocument.documentElement.classList.add).toHaveBeenCalledWith(
        'dark'
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'DPA:THEME',
        JSON.stringify({ colorTheme: 'dark' })
      );
    });

    it('should toggle to "light" if current theme is "dark"', () => {
      spyOn(localStorage, 'setItem');
      service.isCurrentThemeDark.set(true);

      service.toggleColorTheme();

      expect(service.isCurrentThemeDark()).toBeFalse();
      expect(
        mockDocument.documentElement.classList.remove
      ).toHaveBeenCalledWith('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'DPA:THEME',
        JSON.stringify({ colorTheme: 'light' })
      );
    });
  });

  describe('_getStoredTheme', () => {
    it('should return undefined if localStorage is undefined', () => {
      // Sobrescrevendo localStorage para undefined
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        configurable: true,
      });

      const result = (service as any)._getStoredTheme();

      expect(result).toBeUndefined(); // Deve retornar undefined

      // Restaurando localStorage após o teste
      Object.defineProperty(window, 'localStorage', {
        value: Storage.prototype,
        configurable: true,
      });
    });

    it('should return undefined if stored theme is invalid JSON', () => {
      spyOn(localStorage, 'getItem').and.returnValue('{ invalid json }');
      spyOn(console, 'error'); // Espião para verificar logs de erro

      const result = (service as any)._getStoredTheme();

      expect(result).toBeUndefined(); // Deve retornar undefined
      expect(console.error).toHaveBeenCalledWith(
        'Invalid JSON in localStorage for theme.'
      );
    });

    it('should return undefined if stored theme is missing "colorTheme"', () => {
      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({}));

      const result = (service as any)._getStoredTheme();
      expect(result).toBeUndefined(); // Deve retornar undefined
    });
  });

  describe('_setStoredColorTheme', () => {
    let originalLocalStorage: Storage | undefined;

    beforeEach(() => {
      // Salva o estado original do localStorage
      originalLocalStorage = window.localStorage;
    });

    afterEach(() => {
      // Restaura o localStorage após cada teste
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      });
    });

    it('should return immediately if localStorage is undefined', () => {
      // Simula a ausência de localStorage
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        configurable: true,
      });

      // Chama o método e garante que não lança erros nem realiza ações
      expect(() => {
        (service as any)._setStoredColorTheme('dark');
      }).not.toThrow();
    });

    it('should store the theme in localStorage if localStorage is defined', () => {
      // Garante que o localStorage está presente
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        configurable: true,
      });

      spyOn(localStorage, 'setItem');

      (service as any)._setStoredColorTheme('dark');

      // Verifica se o tema foi salvo corretamente
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'DPA:THEME',
        JSON.stringify({ colorTheme: 'dark' })
      );
    });
  });
});
