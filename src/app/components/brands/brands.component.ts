import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { IBrands } from '../../core/interfaces/ibrands';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit , OnDestroy{
   private readonly _BrandsService = inject(BrandsService);
    
   cancelSub!:Subscription
    brandsDetails:IBrands[] =[];

    flag:boolean=true;
    modalImg:string=''
    modalName:string=''

   ngOnInit(): void {
       this._BrandsService.getBrands().subscribe({
        next:(res)=>{
          console.log(res.data)
          this.brandsDetails = res.data
        },
        error:(err)=>{
          console.log(err)
        }

       })
   }
   
   closeBtn(){
            this.flag=true
   }


   ngOnDestroy(): void {
    this.cancelSub?.unsubscribe();
    console.log('subscription cancelled');
   }
  
}
