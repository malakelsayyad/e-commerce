import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpass',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgetpass.component.html',
  styleUrl: './forgetpass.component.scss'
})
export class ForgetpassComponent {

  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  isLoading: boolean = false;
  errorMsg: string = ''
  step: number = 1;

  verifyEmail: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  })


  verifyCode: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)])
  })


  resetPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),

  })

  verifyEmailSubmit(): void { 

   let emailValue = this.verifyEmail.get('email')?.value
   this.resetPassword.get('email')?.patchValue(emailValue);

    if (this.verifyEmail.valid) {
      this.isLoading = true;
      this._AuthService.setEmailVerify(this.verifyEmail.value).subscribe({
        next: (res) => {

          console.log(res)
          if (res.statusMsg == 'success') {
            this.step = 2
            this.isLoading = false;
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);

        }
      })
    }

  }
  verifyCodeSubmit(): void {
    if (this.verifyCode.valid) {
      this.isLoading = true;
      this._AuthService.setCodeVerify(this.verifyCode.value).subscribe({
        next: (res) => {

          console.log(res)
          if (res.status == 'Success') {
            this.step = 3
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);

        }
      })
    }

  }
  changePasswordSubmit(): void {
    if (this.resetPassword) {
      this.isLoading = true;

      this._AuthService.setResetPass(this.resetPassword.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          console.log(res)
          localStorage.setItem('userToken', res.token);
          this._AuthService.saveUserData();
          this._Router.navigate(['/home']);
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        }
      })

    }
  }
}