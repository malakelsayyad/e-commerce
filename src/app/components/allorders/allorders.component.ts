import { IAllorders } from './../../core/interfaces/iallorders';
import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { CurrencyPipe } from '@angular/common';
import { CutTextPipe } from '../../core/pipes/cut-text.pipe';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CurrencyPipe,CutTextPipe],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.scss'
})
export class AllordersComponent implements OnInit{

  private readonly _OrdersService = inject(OrdersService);
  
  allOrders: IAllorders[] |null =null;

  ngOnInit(): void {
  
   let userId =localStorage.getItem('cartOwner')

   this._OrdersService.getOrders(userId).subscribe({
    next:(res)=>{
      console.log(res)
      this.allOrders=res
    }
   })
  }
  
}
