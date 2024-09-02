import { Component, inject, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICategory } from '../../core/interfaces/icategory';
import { ISubcategories } from '../../core/interfaces/isubcategories';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  cancelSub!: Subscription;

  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CategoriesService = inject(CategoriesService);

  categories: ICategory[] = [];
  subCat: ISubcategories[] | null = null;
  selectedCategoryName: string | null = null;

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: () => {
        this._CategoriesService.getAllCategories().subscribe({
          next: (res) => {
            console.log(res.data);
            this.categories = res.data;
          },
          error: (err) => {
            console.log(err);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.cancelSub?.unsubscribe();
    console.log('Subscription cancelled');
  }

  displaySubcat(catName: string, id: string): void {
    this.selectedCategoryName = catName ;
    this._CategoriesService.getAllSubCategories(id).subscribe({
      next: (res) => {
        if (res.results > 0) {
          console.log(res.data);
          this.subCat = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
