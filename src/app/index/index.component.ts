import { Component, OnInit } from '@angular/core';

import { Activity } from 'src/app/activity/activity.model';
import { ActivityServiceService } from 'src/app/servicessss/activity-service.service';

import { TareaServiceService } from '../services/tarea-service.service';
import { Tarea } from '../models/tarea.model';

import { MatDialog } from '@angular/material/dialog';
import { FormEditDialogComponent } from '../form-edit-dialog/form-edit-dialog.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  tareas: Tarea[];
  order: number;
  filter: number;

  constructor(private ts: TareaServiceService, public md: MatDialog) {
    this.tareas = [];
    this.order = 3;
    this.filter = 0;
  }

  ngOnInit() {
    this.getAll();
  }

  getAll(){
    this.ts.getAll().subscribe((res) => {
      this.tareas = res.map((tarea) => {
        return {
          ...tarea.payload.doc.data() as {},
          id: tarea.payload.doc.id
        } as Tarea;
      });
    });
  }

  activityOrder(compare: number){
    if(compare === 0){
      this.order = 0;
      this.tareas.sort((a,b) =>
        a.title.localeCompare(b.title)
      );
    }else if(compare === 1){
      this.order = 1;
      this.tareas.sort((a,b) =>
        (a.date > b.date) ? 1 : -1
      );
    } else {
      this.order = 2;
      this.tareas.sort((a,b) =>
        -(a.priority - b.priority)
      );
    }
  }

  activityFilter(filtro: number){
    this.filter = filtro;
  }

  deleteActivity(id: string){
    this.ts.borrarTarea('todoList',id);
  }

  complete(task: Tarea){
    this.ts.completarTarea(task);
  }

  process(activity: Tarea){
    if(activity.status === 0){
      this.ts.inProcess(activity.id,true);
    } else {
      this.ts.inProcess(activity.id,false);
    }
  }

  openEditDialog(tarea: any){
    const tareaUp = {
      title: tarea.title,
      description: tarea.description,
      priority: tarea.priority,
      status: tarea.status,
      id: tarea.id,
      date: tarea.date
    }
    const dialogRef = this.md.open(FormEditDialogComponent, {
      data: tareaUp,
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(res => {
      if(!res){
        console.log(res);
      } else {
        this.ts.updateTarea(res);
      }
    });
  }

}
