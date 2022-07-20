import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { from, tap } from 'rxjs';
import { Todo } from 'src/app/models/Todo';
import { User } from 'src/app/models/User';
import { GoogleAuthProvider } from 'firebase/auth'
import { UntypedFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // criar uma propriedade com a referencia da colecao de usuarios do firebase
  private usersCollection = this.store.collection<User>('users')

  constructor(
    private authentication: AngularFireAuth, // serve para manipular a parte de autenticacao do firebase
    private store: AngularFirestore, // serve para manipular o banco de dados do firebase
    private router: Router
  ) { }

  get currentUser() {
    // authState retorna o usuario que esta logado atualmente na aplicacao, se ele existe
    // se nao houver nenhum usuario logado, ele retornara nulo
    return this.authentication.authState
  }

  private saveUserData() {
    return tap(async (credentials: firebase.default.auth.UserCredential) => {
      // recuperar o uid do usuario
      const uid = credentials.user?.uid as string

      // recuperar o email do usuario
      const email = credentials.user?.email as string

      // SELECT * FROM users WHERE username = 'diogo';
      const todos: Todo[] = []

      const user = await this.usersCollection.ref.where('email', '==', email).get().then(users => {
        return users.docs[0]
      })

      if (user == undefined) {

        // criacao de um novo documento na colecao de usuarioa
        // a funcao doc te retorna a referencia para um documento na colecao a partir do seu UID

        // a funcao set atribui valores ao documento que vc esta se referenciando
        this.usersCollection.doc(uid).set({
          uid: uid,
          email: email,
          todos: todos
        })

        credentials.user?.sendEmailVerification()
      }
    })
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    // O from transformara a Promise que o metodo createUserWithEmailAndPassword retorna em um Observable
    // O metodo createUserWithEmailAndPassword cadastra um novo usuario no firebase pelo e-mail e senha
    return from(this.authentication.createUserWithEmailAndPassword(email, password))
      .pipe(this.saveUserData())
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return from(this.authentication.signInWithEmailAndPassword(email, password))
  }

  signInWithGoogle() {
    const googleProvider = new GoogleAuthProvider()

    return from(this.authentication.signInWithPopup(googleProvider))
      .pipe(this.saveUserData())
  }

  signOut() {
    return from(this.authentication.signOut()).pipe(
      tap(() => {
        this.router.navigateByUrl('/auth/login')
      })
    )
  }
}
