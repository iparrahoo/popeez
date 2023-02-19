import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './pages/report/report.component';

import { SignInComponent } from './pages/sign-in/sign-in.component';

const routes: Routes =
[
  { path: '', redirectTo: '/report', pathMatch: 'full' },
  { path: 'report', component: ReportComponent },
  { path: 'sign-in', component: SignInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
