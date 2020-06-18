import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MydetailsPageRoutingModule } from './mydetails-routing.module';

import { MydetailsPage } from './mydetails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MydetailsPageRoutingModule
  ],
  declarations: [MydetailsPage]
})
export class MydetailsPageModule {}
