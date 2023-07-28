import { CanActivate, Router, } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn:'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private service: AuthService) {
  }

  canActivate(){
    if (this.service.IsLoggedIn()) {
      return true;
    }
    else {
      alert("please login");
      this.router.navigate(['/']);
      return false;
    }
  }
}