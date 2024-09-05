import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';

export const routes: Routes = [
    {
        path: '',loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent), canActivate: [loggedGuard], children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            {
                path: 'login',
                loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'forget',
                loadComponent: () => import('./components/forgetpass/forgetpass.component').then(m => m.ForgetpassComponent)
            }
        ]
    },
    {
        path: '', loadComponent: () => import('./layouts/blank-layout/blank-layout.component').then(m => m.BlankLayoutComponent), canActivate: [authGuard], children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
            },
            {
                path: 'products',
                loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
            },
            {
                path: 'brands',
                loadComponent: () => import('./components/brands/brands.component').then(m => m.BrandsComponent)
            },
            {
                path: 'cart',
                loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent)
            },
            {
                path: 'categories',
                loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent)
            },
            {
                path: 'details/:id',
                loadComponent: () => import('./components/details/details.component').then(m => m.DetailsComponent)
            },
            {
                path: 'allorders',
                loadComponent: () => import('./components/allorders/allorders.component').then(m => m.AllordersComponent)
            },
            {
                path: 'orders/:id',
                loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent)
            },
            {
                path: 'wishlist',
                loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent)
            }
        ]
    },
    { path: '**', 
        loadComponent: () => import('./components/notfound/notfound.component').then(m => m.NotfoundComponent)
    }
];
