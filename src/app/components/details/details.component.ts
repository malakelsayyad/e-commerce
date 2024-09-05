import { WishlistService } from './../../core/services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import internal from 'stream';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CarouselModule,CurrencyPipe,NgClass],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {

  detailsProduct: IProduct = {} as IProduct;
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService)
  isLoading:boolean = false

  isInWishlist: Set<string> = new Set();

 
  customOptionsDetails: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: false,
    autoplayTimeout: 3000,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],


    items: 1
    ,
    nav: true
  }


  cancelSub!: Subscription

  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _ProductsService = inject(ProductsService)
  private _WishlistService = inject(WishlistService);

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        let productId = p.get('id');
        this._ProductsService.getSpecificProducts(productId).subscribe({
          next: (res) => {
            console.log(res.data);
            
            this.detailsProduct = res.data;

          },
          error: (err) => {
            console.log(err);

          }

        })
      }
    })
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

  ngOnDestroy(): void {
    this.cancelSub?.unsubscribe()
    console.log('Subscription cancelled');
    
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
  addToCart(id: string): any {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message);
        this._CartService.cartNumber.set(res.numOfCartItems);
        console.log(this._CartService.cartNumber);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
