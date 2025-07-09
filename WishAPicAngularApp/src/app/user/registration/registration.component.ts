import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
onSubmit() {
  this.isSubmitted = true;
  if (this.form.valid) {
    console.log(this.form.value);
    this.service.createUser(this.form.value)
    .subscribe({
      next:(res:any) =>{
        if(res.succeeded){
          this.form.reset();
          this.isSubmitted = false;
        }
      },
      error:err =>  {
        if(err.error.errors)
          err.error.errors.forEach((x:any) => {
            switch(x.code){
              case "DuplicateUserName":
                console.log('User Name is already taken.');
                break;
    
              case "DuplicateEmail":
                console.log('Email is already taken.');
                break;
    
                default:
                  console.log('Contact the developer')
                  console.log(x)
                  break;
            }
          })

        else
          console.log('error:',err);
      }  
    });
  }
}

  constructor(
    public formBuilder: FormBuilder,
    private service:AuthService){}
  isSubmitted:boolean = false;

  passwordMatchValidator: ValidatorFn = (control:AbstractControl):null =>{
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')

    if(password && confirmPassword && password.value != confirmPassword.value)
      confirmPassword?.setErrors({passwordMismatch:true})
    else
      confirmPassword?.setErrors(null)

      return null;
  }

  form = this.formBuilder.group({
    fullName: ['',Validators.required],
    email: ['',[Validators.required,Validators.email]],
    password: ['',[
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)]],
    confirmPassword: [''],
  },{validators:this.passwordMatchValidator})

  hasDisplayableError(controlName: string):Boolean{

    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
    (this.isSubmitted || Boolean(control?.touched))
  }


}
