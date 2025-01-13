import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ColorListComponent } from '../../components/color-list/color-list.component';
import { MainListComponent } from '../../components/main-list/main-list.component';
import { CategoryService } from '../../services/category.service';

const COMPONENTS = [MainListComponent, ColorListComponent];
const PIPES = [AsyncPipe];

@Component({
  selector: 'app-category',
  imports: [...COMPONENTS, ...PIPES],
  template: ` <div class="flex flex-col justify-between w-full h-full">
    @if (categories$ | async) {
      <app-main-list />
      <app-color-list />
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
  private readonly categoryService = inject(CategoryService);

  public categories$ = this.categoryService.getCategories();
}
