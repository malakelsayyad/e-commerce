import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { BrandsComponent } from './components/brands/brands.component';
import { CartComponent } from './components/cart/cart.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';
import { DetailsComponent } from './components/details/details.component';
import { ForgetpassComponent } from './components/forgetpass/forgetpass.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { AllordersComponent } from './components/allorders/allorders.component';
import { OrdersComponent } from './components/orders/orders.component';


export const routes: Routes = [
    
    {
        path: '', component: AuthLayoutComponent, canActivate:[loggedGuard] ,children: [

            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'forget', component: ForgetpassComponent }

        ]},   
    {
        path: '', component: BlankLayoutComponent,canActivate:[authGuard] ,children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'brands', component: BrandsComponent },
            { path: 'cart', component: CartComponent },
            { path: 'categories', component: CategoriesComponent },
            { path: 'details/:id', component:DetailsComponent },
            { path: 'allorders', component:AllordersComponent },
            { path: 'orders/:id', component:OrdersComponent},
            { path: 'wishlist', component:WishlistComponent },
       
        ]},

        
    { path: '**', component: NotfoundComponent }
];
