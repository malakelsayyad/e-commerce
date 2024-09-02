import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const _router = inject(Router)

  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('userToken') !== null) {
      return true;
    }
    else {
      _router.navigate(['/login'])
      return false;
    }
  }
  else {
    return false;
  }

};
