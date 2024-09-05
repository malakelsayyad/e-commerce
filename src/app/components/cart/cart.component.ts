import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ICart } from '../../core/interfaces/icart';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { CutTextPipe } from '../../core/pipes/cut-text.pipe';



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe,RouterLink,CutTextPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  isLoading: boolean = false;
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService)

  cartDetails: ICart = {} as ICart;
  numOfitems!:number
  cartOwner:string=''
  
  

  ngOnInit(): void {
    this._CartService.getProductCart().subscribe({

      next: (res) => {
        console.log(res);
        this.cartDetails = res.data
        this.numOfitems=res.numOfCartItems
        this.cartOwner=res.data.cartOwner
        console.log(this.cartOwner)
        localStorage.setItem('cartOwner',this.cartOwner)
      },
      error: (err) => {
        console.log(err);
      }

    })
  }

  removeItem(id: string): void {
    if (window.confirm('Are you sure you want to remove this item?'))
      this.isLoading = true;
    this._CartService.deleteSpecificCartItem(id).subscribe({
      next: (res) => {
        this._ToastrService.success('Removed')
        this.isLoading = false;
        console.log(res)
        this.cartDetails = res.data;
        this.numOfitems=res.numOfCartItems
         this._CartService.cartNumber.set(res.numOfCartItems)
        
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err)
      }
    });
  }

  updateQuantity(id:string ,count:number):void{
   if(count>0){
    this._CartService.updateProductQuantity(id,count).subscribe({
      next:(res)=>{
        this.cartDetails=res.data
        this._ToastrService.success('Updated Successfully')
        console.log(res)
      },
      error:(err)=>{
        console.log(err)
      },
    })
   }
  
  }
  
  
  clearCart():void{
    if (window.confirm('Are you sure you to clear cart?')){
      this.isLoading = true;
      this._CartService.removeAllProducts().subscribe({
        next: (res) => {
          this.numOfitems=0
          this.isLoading = false;
          console.log(res)
          this.cartDetails = {} as ICart;
          this._CartService.cartNumber.set(0)
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err)
        }
      }
      )};
  }
}
