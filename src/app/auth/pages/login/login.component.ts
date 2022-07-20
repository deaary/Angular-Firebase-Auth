import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]]
  })

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  login() {
    const { email, password } = this.loginForm.value
    this.authService.signInWithEmailAndPassword(email, password).subscribe(
      () => {
        this.router.navigateByUrl('/todos')
      }
    )
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().subscribe(
      () => {
        this.router.navigateByUrl('/todos')
      }
    )
  }
}