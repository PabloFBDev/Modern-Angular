import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe(ThemeService.name, () => {
  let service: ThemeService;

  let mockDocument: Document;
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };

  beforeEach(() => {
    // Mock global de localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      configurable: true,
    });

    // Mock do Document
    mockDocument = {
      documentElement: {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      },
    } as unknown as Document;

    // Configuração do TestBed
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: DOCUMENT, useValue: mockDocument }],
    });

    service = TestBed.inject(ThemeService) as jest.Mocked<ThemeService>;

    // Reset dos mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restaura mocks para evitar interferências
  });

  it('deve criar o serviço corretamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getPreferredColorTheme', () => {
    it.each([
      { storedTheme: null, expected: 'light' },
      { storedTheme: JSON.stringify({ colorTheme: 'dark' }), expected: 'dark' },
      {
        storedTheme: JSON.stringify({ colorTheme: 'light' }),
        expected: 'light',
      },
    ])(
      'deve retornar "$expected" quando "$storedTheme" estiver armazenado no localStorage',
      ({ storedTheme, expected }) => {
        mockLocalStorage.getItem.mockReturnValue(storedTheme);
        const result = service.getPreferredColorTheme();
        expect(result).toBe(expected);
      }
    );
  });

  describe('setColorTheme', () => {
    it('deve adicionar a classe "dark" ao documento se o tema for "dark"', () => {
      service.setColorTheme('dark');
      expect(mockDocument.documentElement.classList.add).toHaveBeenCalledWith(
        'dark'
      );
      expect(
        mockDocument.documentElement.classList.remove
      ).not.toHaveBeenCalled();
    });

    it('deve remover a classe "dark" do documento se o tema for "light"', () => {
      service.setColorTheme('light');
      expect(
        mockDocument.documentElement.classList.remove
      ).toHaveBeenCalledWith('dark');
      expect(mockDocument.documentElement.classList.add).not.toHaveBeenCalled();
    });

    it('deve atualizar o sinal isCurrentThemeDark corretamente', () => {
      service.setColorTheme('dark');
      expect(service.isCurrentThemeDark()).toBe(true);

      service.setColorTheme('light');
      expect(service.isCurrentThemeDark()).toBe(false);
    });
  });

  describe('toggleColorTheme', () => {
    it('deve alternar para "dark" se o tema atual for "light"', () => {
      mockLocalStorage.setItem.mockImplementation(() => {});
      service.isCurrentThemeDark.set(false);

      service.toggleColorTheme();

      expect(service.isCurrentThemeDark()).toBe(true);
      expect(mockDocument.documentElement.classList.add).toHaveBeenCalledWith(
        'dark'
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'DPA:THEME',
        JSON.stringify({ colorTheme: 'dark' })
      );
    });

    it('deve alternar para "light" se o tema atual for "dark"', () => {
      mockLocalStorage.setItem.mockImplementation(() => {});
      service.isCurrentThemeDark.set(true);

      service.toggleColorTheme();

      expect(service.isCurrentThemeDark()).toBe(false);
      expect(
        mockDocument.documentElement.classList.remove
      ).toHaveBeenCalledWith('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'DPA:THEME',
        JSON.stringify({ colorTheme: 'light' })
      );
    });
  });

  describe('_getStoredTheme', () => {
    it('deve retornar undefined se localStorage não estiver disponível', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        configurable: true,
      });

      const result = (service as any)._getStoredTheme();
      expect(result).toBeUndefined();
    });

    it('deve retornar undefined se o tema armazenado for um JSON inválido', () => {
      mockLocalStorage.getItem.mockReturnValue('{ invalid json }');
      jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = (service as any)._getStoredTheme();
      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith(
        'Invalid JSON in localStorage for theme.'
      );
    });

    it('deve retornar undefined se o tema armazenado não tiver "colorTheme"', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({}));

      const result = (service as any)._getStoredTheme();
      expect(result).toBeUndefined();
    });
  });

  describe('_setStoredColorTheme', () => {
    it('deve retornar imediatamente se localStorage não estiver disponível', () => {
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        configurable: true,
      });

      expect(() => {
        (service as any)._setStoredColorTheme('dark');
      }).not.toThrow();
    });

    it('deve armazenar o tema no localStorage se localStorage estiver disponível', () => {
      mockLocalStorage.setItem.mockImplementation(() => {});

      (service as any)._setStoredColorTheme('dark');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'DPA:THEME',
        JSON.stringify({ colorTheme: 'dark' })
      );
    });
  });
});
