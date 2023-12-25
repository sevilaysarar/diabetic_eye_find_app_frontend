import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth,private toastr: ToastrService,private router: Router) { }

  get isAuthenticated(): boolean {
    return this.afAuth.currentUser !== null;
  }
  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.toastr.success('Login successful.');
        setTimeout(()=>{
          this.router.navigate(['/dashboard'])

        },1000)
      })
      .catch((error) => {
        this.toastr.error(error);
      });
  }
}