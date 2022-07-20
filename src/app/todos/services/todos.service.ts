import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../../models/User';
import { AuthService } from 'src/app/auth/services/auth.service';
import { map, mergeMap } from 'rxjs';
import { Todo } from 'src/app/models/Todo';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private userCollection = this.store.collection<User>('users')
  private currentUser = this.authService.currentUser

  constructor(
    private store: AngularFirestore,
    private authService: AuthService
  ) { }

  getTodos() {
    return this.currentUser.pipe(
      mergeMap(user => {
        return this.userCollection.doc(user?.uid).get()
      }),
      map(userDoc => {
        return userDoc.data()?.todos || []
      })
    )
  }

  createTodo(todo: Todo) {
    return this.currentUser
      .pipe(
        mergeMap(user => {
          return this.userCollection.doc(user?.uid).get()
        }),
        mergeMap(userDoc => {
          //a funcao data retorna um objeto com os dados do documentos do firebase
          const user = userDoc.data() as User

          todo.id = this.store.createId()

          user.todos.push(todo)

          return userDoc.ref.update(user)

        })
      )
  }

  deleteTodo(todo: Todo) {
    return this.currentUser
      .pipe(
        mergeMap(user => {
          return this.userCollection.doc(user?.uid).get()
        }),
        mergeMap(userDoc => {
          //a funcao data retorna um objeto com os dados do documentos do firebase
          const user = userDoc.data() as User

          user.todos = user.todos.filter(t => {
            return t.id != todo.id
          })

          return userDoc.ref.update(user)

        })
      )
  }

  updateTodo(todo: Todo) {
    return this.currentUser
      .pipe(
        mergeMap(user => {
          return this.userCollection.doc(user?.uid).get()
        }),
        mergeMap(userDoc => {
          //a funcao data retorna um objeto com os dados do documentos do firebase
          const user = userDoc.data() as User

          user.todos = user.todos.map(t => {
            if (t.id == todo.id) {
              return todo
            } else {
              return t
            }
          })

          return userDoc.ref.update(user)

        })
      )
  }
}
