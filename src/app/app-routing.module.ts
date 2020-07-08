import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./shared/guard/auth.guard";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgotpass',
    loadChildren: () => import('./pages/forgotpass/forgotpass.module').then( m => m.ForgotpassPageModule)
  },
  {
    path: 'home/schedule',
    loadChildren: () => import('./home/schedule/schedule.module').then( m => m.SchedulePageModule) , canActivate: [AuthGuard]
  },
  {
    path: 'home/mydetails',
    loadChildren: () => import('./home/mydetails/mydetails.module').then( m => m.MydetailsPageModule) , canActivate: [AuthGuard]
  },
  {
    path: 'home/logout',
    loadChildren: () => import('./home/logout/logout.module').then( m => m.LogoutPageModule) 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
