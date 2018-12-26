import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListTab } from './listTab.page';
import { ListItemModal } from './listTab.item.modal';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ListTab }])
  ],
  declarations: [ListTab, ListItemModal],
  entryComponents: [ ListTab, ListItemModal]
})

export class ListTabModule {}
