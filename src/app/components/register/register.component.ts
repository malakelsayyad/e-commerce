import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router)
  errorMsg: string = '';
  isLoading: boolean = false;
  cancelSub!: Subscription

  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
    rePassword: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)])
  }, this.confirmPassword);

  confirmPassword(abstractControl: AbstractControl) {
    if (abstractControl.get('password')?.value === abstractControl.get('rePassword')?.value) {
      return null;
    }
    else {
      return { mismatch: true }
    }
  }

  registerSubmit(): void {

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.cancelSub = this._AuthService.setRegisterForm(this.registerForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.message == 'success') {
            this._Router.navigate(['/login'])

          }
          console.log(res)
        },
        error: (err: HttpErrorResponse) => {
          this.errorMsg = err.error.message;
          console.log(err)
          this.isLoading = false;

        }
      })
    }
    else {
      this.registerForm.markAllAsTouched()
      this.registerForm.setErrors({ mismatch: true })
    }
  }
  ngOnDestroy(): void {
    this.cancelSub?.unsubscribe();
    console.log('subscription cancelled');


  }
}
