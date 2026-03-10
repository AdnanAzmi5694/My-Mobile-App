import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component'; 
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailsComponent } from './details/details.component';
import { JobberAlterationComponent } from './jobber-alteration/jobber-alteration.component';
//import { SalesDetailComponent } from './sales-detail/sales-detail.component';
export const routes: Routes = [
  {
    path: '', redirectTo: 'signin', pathMatch: 'full' // ✅ redirect root to /signin
  },
  {
    path: 'signin', component: SigninComponent        // ✅ actual signin route
  },
  // {
  //   path: '**', redirectTo: 'signin'                  // ✅ optional wildcard for unknown routes
  // },
  // {
  //   path: 'signup', redirectTo:'signup'

  // },
  {
    path: 'signup', component : SignUpComponent

  },
  { path: 'dashboard', component: DashboardComponent }, // ✅ Must be here
  { path: 'details', component: DetailsComponent },
  { path: 'jobber-alteration', component: JobberAlterationComponent },
// { path: 'SalesDetail' , component : SalesDetailComponent},
];
