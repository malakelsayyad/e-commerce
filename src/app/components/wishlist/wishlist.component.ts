import { Component, inject, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CurrencyPipe } from '@angular/common';

import { IWishlist } from '../../core/interfaces/iwishlist';
import { CutTextPipe } from '../../core/pipes/cut-text.pipe';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CurrencyPipe,CutTextPipe],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  isLoading: boolean = false;
  private readonly _CartService = inject(CartService)
  private readonly _WishlistService = inject(WishlistService)
  private readonly _ToastrService = inject(ToastrService)

 listDetails: IWishlist[] | null = null;
  
  

  ngOnInit(): void {
    this._WishlistService.getWishList().subscribe({

      next: (res) => {
        console.log(res.data);
       this.listDetails=res.data
       
      },
      error: (err) => {
        console.log(err);
      }

    })
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
  removeItem(id: string): void {
    if (window.confirm('Are you sure you want to remove this item?')) {
      this.isLoading = true;
      this._WishlistService.deleteSpecificWishlistItem(id).subscribe({
        next: (res) => {
          this._ToastrService.success('Removed');
          this.isLoading = false;
          
          // Manually remove the item from the listDetails array
          this.listDetails = this.listDetails?.filter(item => item._id !== id) || null;
          
          console.log(res);
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        }
      });
    }
  }
}
