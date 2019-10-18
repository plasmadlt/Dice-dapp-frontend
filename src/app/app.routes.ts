import { Routes } from '@angular/router';
import { CommonLayoutComponent } from './view/common-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dice',
        pathMatch: 'full'
      },
      {
        path: 'dice',
        loadChildren: './view/dice/dice.module#DiceModule'
      },
      {
        path: 'auth',
        loadChildren: './view/auth/auth.module#AuthModule'
      }
    ]
  }
];
