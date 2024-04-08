import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../../../auth.service'
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,private router: Router) { }

  userName = new FormControl('');
  password = new FormControl('');


  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }
  ngOnInit(): void {
    if(this.isAuthenticated){
      this.router.navigate(['/dashboard'])
    }
    else{
      this.router.navigate(['/login'])
    }
  }
  login() {
    this.authService.login(this.userName.value as string, this.password.value as string);
  }
}
