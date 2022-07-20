import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessTodosGuard } from '../guards/access-todos.guard';
import { TodosComponent } from './pages/todos/todos.component';

const routes: Routes = [
  {
    path: '',
    component: TodosComponent,
    canActivate: [
      AccessTodosGuard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule { }
