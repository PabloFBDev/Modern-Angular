import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatToolbarModule } from '@angular/material/toolbar';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { HeaderComponent } from './header.component';

describe(HeaderComponent.name, () => {
  let component: HeaderComponent;
  let nativeElement: HTMLElement;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, ThemeToggleComponent, MatToolbarModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toolbar', () => {
    const toolbar = fixture.nativeElement.querySelector(
      '[data-testid=matToolbar]'
    );
    expect(toolbar).toBeTruthy();
  });

  it('the title property should be the correct value', () => {
    expect(component.title())
      .withContext('title should be qual to "Gerenciador"')
      .toEqual('Gerenciador');

    const nativeElementText = nativeElement.querySelector(
      '[data-testid=title]'
    )?.textContent;

    expect(nativeElementText).toEqual('Gerenciador');
  });

  it('should display "Gerenciador" text', () => {
    const text = fixture.nativeElement.querySelector('[data-testid=title]');
    expect(text.textContent.trim()).toContain('Gerenciador');
  });

  it('should include the ThemeToggleComponent', () => {
    const themeToggle = fixture.nativeElement.querySelector(
      '[data-testid=themeToggle]'
    );
    expect(themeToggle).toBeTruthy();
  });
});
