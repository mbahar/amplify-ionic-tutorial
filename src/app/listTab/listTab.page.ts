// ----- CODE USED IN PART 2 OF THE TUTORIAL -------
// import { Component, OnInit, Input } from '@angular/core';
// import { ModalController, Events } from '@ionic/angular';
// import { ToDoItem, ToDoList } from '../classes/item.class';
// import { forEach } from '@angular/router/src/utils/collection';
// import { ListItemModal } from './listTab.item.modal';

// @Component({
//   selector: 'app-list-page',
//   templateUrl: 'listTab.page.html',
//   styleUrls: ['listTab.page.scss']
// })
// export class ListTab implements OnInit {

//   modal: any;
//   data: any;
//   user: any;
//   itemList: ToDoList;
//   signedIn: boolean;

//   constructor(
//     public modalController: ModalController,
//     events: Events
//   ) {
//     // Listen for changes to the AuthState in order to change item list appropriately
//     events.subscribe('data:AuthState', async (data) => {
//       if (data.loggedIn){
//         this.getItems();
//       } else {
//         this.itemList.items = [];
//       }
//     });
//   }

//   async modify(item, i) {
//     let props = {
//       itemList: this.itemList,
//       /*
//         We pass in an item parameter only when the user clicks on an existing item
//         and therefore populate an editItem value so that our modal knows this is an edit operation.
//       */
//       editItem: item || undefined
//     };

//     // Create the modal
//     let modal = await this.modalController.create({
//       component: ListItemModal,
//       componentProps: props
//     });

//     modal.onDidDismiss()
//     .then((result) => {
//       if (result.data.newItem){
//         this.create(result.data.newItem);
//       } else if (result.data.editItem){
//         this.edit(result.data.editItem);
//       }
//     });
//     return modal.present();
//   }

//   async ngOnInit(){
//     this.getItems();
//   }

//   delete(item,i){
//     this.itemList.items.splice(i, 1);
//   }

//   complete(item,i){
//     this.itemList.items[i].status = 'complete';
//   }

//   save(list){
//     this.itemList = list;
//   }

//   create(item){
//     this.itemList.items.push(item);
//   }

//   edit(item){
//     // Not implemented yet
//   }

//   getItems(){
//     this.itemList = {
//       userId: 1,
//       items: [
//         new ToDoItem({
//           id: '1',
//           title: 'Test item 1',
//           description: 'my test item',
//           status: 'complete'
//         }),
//         new ToDoItem({
//           id: '2',
//           title: 'Test item 2',
//           description: 'my other test item',
//           status: 'pending'
//         })
//       ]
//     };
//   }

// }


import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Events } from '@ionic/angular';
import { ListItemModal } from './listTab.item.modal';
import { ToDoItem, ToDoList } from '../classes/item.class';
import Amplify, { API, graphqlOperation } from "aws-amplify";
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { forEach } from '@angular/router/src/utils/collection';

class GraphQLResult {
    data?: any;
    errors?: [any];
    extensions?: { [key: string]: any };
  }

@Component({
  selector: 'app-list-page',
  templateUrl: 'listTab.page.html'
})
export class ListTab implements OnInit {

  modal: any;
  data: any;
  user: any;
  itemList: ToDoList;
  signedIn: boolean;

  constructor(
    public modalController: ModalController,
    events: Events
  ) {
    // Listen for changes to the AuthState in order to change item list appropriately
    events.subscribe('data:AuthState', async (data) => {
      if (data.loggedIn){
        this.getItems();
      } else {
        this.itemList.items = [];
      }
    });
  }

  async ngOnInit(){
    this.getItems();
  }

  async modify(item, i) {
    let props = {
      itemList: this.itemList,
      /*
        We pass in an item parameter only when the user clicks on an existing item
        and therefore populate an editItem value so that our modal knows this is an edit operation.
      */
      editItem: item || undefined
    };

    // Create the modal
    let modal = await this.modalController.create({
      component: ListItemModal,
      componentProps: props
    });

    modal.onDidDismiss()
    .then((result) => {
      if (result.data.newItem){
        this.create(result.data.newItem);
      } else if (result.data.editItem){
        this.edit(result.data.editItem);
      }
    });
    return modal.present();
  }

  async delete(item){
    await API.graphql(graphqlOperation(mutations.deleteTodo, { input: { 'id': item.id } } ));
    this.getItems();
  }

  async complete(item){
    await API.graphql(graphqlOperation(mutations.updateTodo, { input: item }));
    this.getItems();
  }

  async create(item){
    await API.graphql(graphqlOperation(mutations.createTodo, {input: item }));
    this.getItems();
  }

  async edit(item){
    API.graphql(graphqlOperation(mutations.updateTodo, { input: item }));
    await this.getItems();
  }

  async getItems(){
    const allItems = await API.graphql(graphqlOperation(queries.listTodos)) as GraphQLResult;
    const result: any = allItems.data.listTodos.items;
    let items = Array();
    result.forEach (function(value){
      items.push (new ToDoItem(value));
    });

    this.itemList = {
      userId: 1,
      items: items
    };
  }

}
