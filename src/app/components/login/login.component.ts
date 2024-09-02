import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router)
  errorMsg: string = '';
  isLoading: boolean = false;

  cancelSub!: Subscription

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
  });



  loginSubmit(): void {

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.cancelSub = this._AuthService.setLoginForm(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.message == 'success') {
            // 1-save token
            localStorage.setItem('userToken', res.token);
            //  2-decode token
            this._AuthService.saveUserData()
            // 3-navigate 
            this._Router.navigate(['/home'])

          }
          console.log(res)
        },
        error: (err) => {
          this.errorMsg = err.error.message;
          console.log(err)
          this.isLoading = false;

        }
      })
    }
    else {
      this.loginForm.markAllAsTouched()
      this.loginForm.setErrors({ mismatch: true })
    }
  }

  ngOnDestroy(): void {
    this.cancelSub?.unsubscribe();
    console.log('subscription cancelled');


  }

}
