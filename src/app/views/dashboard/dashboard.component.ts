import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { inject } from '@angular/core';



@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() {
  }
  public visible = false;
  firestore: Firestore = inject(Firestore);
  users:any;

  ngOnInit() {
    const itemCollection = collection(this.firestore, 'patients');
    collectionData(itemCollection).subscribe((res)=>{
      console.log('ee',res)
    })
  }
  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
}
