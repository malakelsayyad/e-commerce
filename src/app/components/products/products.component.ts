import { Component, inject } from '@angular/core';
import { IProduct } from '../../core/interfaces/iproduct';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CutTextPipe } from '../../core/pipes/cut-text.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true ,
  imports: [RouterLink,CurrencyPipe,CutTextPipe ,SearchPipe,FormsModule,NgClass],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

 text:string=''
 isLoading:boolean = false
 msg:string=''

  productList: IProduct[] = [];
  private readonly _ProductsService = inject(ProductsService)
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _WishlistService = inject(WishlistService)

  cancelSub!: Subscription
  
  isInWishlist: Set<string> = new Set();

  ngOnInit(): void {
    this.cancelSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        console.log(res.data);
        console.log(res);
        this.productList = res.data;
        
        
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

  ngOnDestroy(): void {
    this.cancelSub?.unsubscribe();
    console.log('subscription cancelled');


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
}
