import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import * as alertifyjs from 'alertifyjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private route: Router, private formBuilder: FormBuilder) { }
  formValue !: FormGroup
  ngOnInit() {
    alertifyjs.set('notifier','position', 'top-right');   
    this.formValue = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
    localStorage.clear();
  }
  get email(){return this.formValue.get('email')}
  get password(){return this.formValue.get('password')}
  respData:any
  login(data: any) {
    if (this.formValue.valid) {
      this.authService.login(data.value).subscribe(
        (response) => {
          // Handle successful login
          this.respData = response          
          if(this.respData.success == true){
            alertifyjs.success(this.respData.message);
            localStorage.clear();
            localStorage.setItem("token", this.respData.data.jwtToken);
            localStorage.setItem("id", this.respData.data.id);
            localStorage.setItem("email", this.respData.data.email);
            this.route.navigate(['/product']);
          }
          else{
            alertifyjs.error(this.respData.message)
          }
        });
    }
    else {
      this.ValidateForm(this.formValue)
    }
  }
  private ValidateForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      }
      else if (control instanceof FormGroup) {
        this.ValidateForm(control)
      }
    })
  }
}
