import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MydetailsPage } from './mydetails.page';

const routes: Routes = [
  {
    path: '',
    component: MydetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MydetailsPageRoutingModule {}
