import { Component, OnInit } from '@angular/core';
import { Iteration } from 'src/app/models/iteration.model';
import { IterationService } from 'src/app/service/iteration.service';
import { batchTemplate } from '../../models/batch.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  /*
      component not implemented anywhere, place <app-timeline></app-timeline> at end of view-projects.component.html

      **** REMEMBER TO DELETE WHEN DONE TESTING BEFORE YOU PUSH TO "blue-team" BRANCH ****
  */

  // timelineLowerBound: Date = new Date(new Date().setDate(new Date().getDate() - 14)); // current day - 14 days
  readonly timelineLowerBound: Date = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // current day - 14 days in milliseconds, static
  timelineUpperBound?: Date;
  batchArray?: Array<Iteration>;



  constructor(public iter: IterationService) { }

  ngOnInit(): void {
    console.log(this.timelineLowerBound);
    console.log(this.timelineUpperBound);
    this.initializeBatchArray();
  }

  // .pipe(map(batch => batch.sort((a, b) => new Date(a.endDate).getTime() - new batch(b.endDate).getTime())))
  // This is what sorting our dates we get from the mock data service
  initializeBatchArray(): Array<Iteration> | undefined {
    this.iter.getIterationMock().pipe(
      map(batch => batch.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()))
    )
      .subscribe(batch => {
        this.batchArray = batch as Array<Iteration>; 
        console.log(this.batchArray);
      });
    console.log(this.batchArray)
    return
  }

  // calculateUpperBound(): Date;

  // showBatchDetails();

  // calculateP3StartDate(): Date;
}
