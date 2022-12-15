import { Component } from '@angular/core';
     
@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent { 
    public doList = [];
    public newTask;
    public checked;
    public addToList() {
        if (this.newTask == '') {
        }
        else {
            this.doList.push(this.newTask);
            this.newTask = '';
        }
    }
  
    public deleteTask(index) {
        this.doList.splice(index, 1);
    }

    public done(index) {
        console.log(this.doList);
    }
}