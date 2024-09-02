import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orderForm = new FormGroup({
    details: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    city: new FormControl(null, [Validators.required])

  })

  private readonly _ToastrService = inject(ToastrService)

  isLoading: boolean = false;
  cartId: string | null = "";
  cart: string | null = "";

  private readonly _ActivatedRoute = inject(ActivatedRoute)
  private readonly _OrdersService = inject(OrdersService)

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        this.cartId = p.get('id');
        
        this._OrdersService.getOrders(this.cartId)
      }
    })
  }
  
 



  orderNow(): void {
    this.isLoading=true
    console.log(this.orderForm.value)
     console.log(this.cartId)
    this._OrdersService.checkOut(this.cartId,this.orderForm.value).subscribe({
      next:(res)=>{
        this.isLoading=false
        console.log(res);
        if(res.status === 'success'){
          console.log(res.session.url)
          window.open(res.session.url,'_self')
        }
        
      },
      error:(err)=>{
        console.log(err);
        
      },
    })
     
     
  }
  
}
