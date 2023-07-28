import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import * as alertifyjs from 'alertifyjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  formValue !: FormGroup
  fnameCap:any
  lnameCap:any
  constructor(private authService: AuthService,private route:Router,private formBuilder : FormBuilder) { }

  ngOnInit(){
    this.formValue = this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, 
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]]
    })
    alertifyjs.set('notifier','position', 'top-right');   
  }

  get email(){return this.formValue.get('email')}
  get password(){return this.formValue.get('password')}

  signup(data:any) {
    console.log(data.value);
    
    if (this.formValue.valid) {
    this.authService.signup(data.value).subscribe(
      (response) => {
        alertifyjs.set('notifier','position', 'bottom-top');
        alertifyjs.success('User registred successfully');
          this.route.navigate(['/']);
        // Handle successful signup
      });
    }
    else{
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

  capitalizeFirstLetter(string:any) {
    var value = string.toLowerCase();
    string = value.replace(/(^\w{1})|(\-+\w{1})|(\s+\w{1})/g, (letter: string) => letter.toUpperCase());
    this.fnameCap = string
  }
  lnameCapitalize(string:any) {
    var value = string.toLowerCase();
    string = value.replace(/(^\w{1})|(\-+\w{1})|(\s+\w{1})/g, (letter: string) => letter.toUpperCase());
    this.lnameCap = string
  }
}
