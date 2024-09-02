import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { ProductsService } from './../../core/services/products.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ICategory } from '../../core/interfaces/icategory';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CutTextPipe } from "../../core/pipes/cut-text.pipe";

import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  standalone: true ,
  imports: [CarouselModule , RouterLink, CurrencyPipe, CutTextPipe,NgClass],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  private readonly _ProductService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);

  cancelSub!: Subscription;
  productList: IProduct[] = [];
  categoryList: ICategory[]|null =[];
  SearchName: string = " ";
  isInWishlist: Set<string> = new Set();

  customOptionsCat: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    rtl: true,
    dots: false,
    navSpeed: 600,
    autoplay: true,
    autoplayTimeout: 2000,
    navText: ['', ''],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 4 }
    },
    nav: true
  };

  customOptionsMain: OwlOptions = {
    loop: true,
    rtl: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    autoplay: true,
    autoplayTimeout: 2000,
    navText: ['', ''],
    items: 1,
    nav: true
  };

  ngOnInit(): void {
    this.cancelSub = this._ProductService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.data;
        console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });

    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res.data;
        console.log(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.loadWishlistState();
  }

  loadWishlistState() {
    this._WishlistService.getWishList().subscribe({
      next: (res) => {
        this.isInWishlist = new Set(res.data.map((item: any) => item._id));
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addToCart(id: string): any {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message);
        this._CartService.cartNumber.next(res.numOfCartItems);
        console.log(this._CartService.cartNumber);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  addToWishlist(id: string) {
    if (this.isInWishlist.has(id)) {
      this._WishlistService.deleteSpecificWishlistItem(id).subscribe({
        next: (res) => {
          this.isInWishlist.delete(id);
          this._ToastrService.success('Removed from wishlist');
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this._WishlistService.addProductToWishlist(id).subscribe({
        next: (res) => {
          this.isInWishlist.add(id);
          this._ToastrService.success('Added to wishlist');
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.cancelSub?.unsubscribe();
    console.log('subscription cancelled');


  }
}


