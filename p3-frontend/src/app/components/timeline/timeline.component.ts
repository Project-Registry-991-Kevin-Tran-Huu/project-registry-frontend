import { IterationService } from 'src/app/service/iteration.service';
import { map } from 'rxjs/operators';
import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import GSTC, { Config, GSTCResult } from 'gantt-schedule-timeline-calendar';
import { Plugin as TimelinePointer } from 'gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js';
import { Plugin as Selection } from 'gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js';
import { DatePipe } from '@angular/common';
import { batchTemplate } from 'src/app/models/batch.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: [
  './timeline.component.css',
  '../../../../node_modules/gantt-schedule-timeline-calendar/dist/style.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TimelineComponent implements OnInit {
  @ViewChild('gstcElement', { static: true }) gstcElement!: ElementRef;
  gstc!: GSTCResult;

  generateConfig(batch: Array<batchTemplate>): Config {
    const iterations = batch.length;
    // GENERATE SOME ROWS
    //test
    const rows = {};
    for (let i = 0; i < iterations; i++) {

      const id = GSTC.api.GSTCID(i.toString());
      // @ts-ignore
      rows[id] = {
        id,
        label: this.datePipe.transform(batch[i].startDate, "mediumDate")
        + " - " + this.datePipe.transform(batch[i].endDate, "mediumDate"),
               
        parentId: undefined,
        expanded: true,
      };
    }

    // GENERATE SOME ROW -> ITEMS

    let start = GSTC.api.date().startOf('day').subtract(2, 'day');
    const items = {};
    for (let i = 0; i < iterations; i++) {
      const id = GSTC.api.GSTCID(i.toString());
      start = start.add(0, 'day');
      //@ts-ignore
      items[id] = {
        id,
        label: batch[i].batchId + " : " + batch[i].skill + " @ " + batch[i].location,
        time: {
          start: GSTC.api.date(batch[i].endDate).startOf('day').subtract(21, 'day'),
          end: GSTC.api.date(batch[i].endDate).endOf('day'),
        },
        rowId: id,
      };
    }

    // LEFT SIDE LIST COLUMNS

    const columns = {
      percent: 100,
      resizer: {
        inRealTime: true,
      },
      data: {
        [GSTC.api.GSTCID('label')]: {
          id: GSTC.api.GSTCID('label'),
          data: 'label',
          expander: true,
          isHtml: true,
          width: 230,
          minWidth: 100,
          header: {
            content: 'Batch',
          },
        },
      },
    };

    return {
      licenseKey:
        '====BEGIN LICENSE KEY====\nfVZYaLOuQUCwIHSxRwRdtSjNw3AW38hz28xN3U3XhJgRgJK1y+TyM6VodjaSsvuMMfP4YOiqEBuhL0SuM5PTLRdYI459kSM7N1X93M5QLxghxzER975gud3URquky8MiStbIvFAcF1/vjmY0qt6rGKpc2fGNl+3hWRT0+lAKHdMmtY4XpXf6WvycmssiiXlW0vGWk3AWDiUDAHxE1OrmI1a2BrxX6zOALRQqeNcxWjf9Jj9RZkxPTMqPPMRdqTU7Qhzq3PWzmIWCgpOz5ggITsCi2hQQCjz+FzeKkUWBG0Kh6fcaP/tunhpWxT+UtRYAvtunH3YXKMVpn6tf4Bf3rQ==||U2FsdGVkX1+1WAv9e4U7OPZLTQtjJ+8HtC9NHPo144Ap9u1bpPMeUnp4CIq4GXERbjGG276Se7f9qPduT3S6zIWxMI1NRXsb16ZHOtibmKY=\nTD66OA9qd67s12GL91M9IlFqtjcAgS/xaHIBia6bjI9JOEWwrf8xdOLbUo07n4apCxj8jf+AroOJmOjwDa2p5NJDer4TRgO4SDam8TV7rIWdV1KbAmKKA8OjfulSDH9a5G1MD55DTeAdx5n48lnz220y1rKs9th5ECFOJoiLjlh12LxvuvpLwN7g9hOsuaKgbIVkbpa1UEdwdEpgZOd4zCpn3g4gKOJm6KIrZUWPpI0fh0dZG+nbqX/FBtLFeQF42zaXeBw0lvy2xiq1QGCRKt/U1bhIu1Mi33ZIFIO+qZLQ4x6ECFEb/8AjRP27GqmfwIIfTYjuGJL9cad58+L61A==\n====END LICENSE KEY====',
      list: {
        rows,
        columns,
        toggle: {
          display: false
        }
      },
      chart: {
        items,
        time: {
          from: GSTC.api.date().startOf('day').subtract(7, 'day').valueOf(),
          leftGlobal: GSTC.api.date().valueOf(), // default value, don't know what it does but config requires it
          to: GSTC.api.date(this.timelineUpperBound).valueOf(),
        },
      },
      plugins: [TimelinePointer(), Selection()],
    };
  }

  ngOnInit(): void {
    this.iter.getBatchServiceMock().pipe(
      map(batch => batch.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()))
    )
      .subscribe(batch => {
        this.batchArray = batch.filter(batch => new Date(batch.endDate).getTime() - this.timelineLowerBound.getTime() > 0);
        this.calculateUpperBound(this.batchArray);
        console.log(this.batchArray);
      
        this.gstc = GSTC({
          element: this.gstcElement.nativeElement,
          state: GSTC.api.stateFromConfig(this.generateConfig(this.batchArray)),
        });
      // this.initializeBatchArray(); // retrieve batch data
    });
    this.timelineLowerBound = new Date();
    this.timelineLowerBound.setDate(this.timelineUpperBound.getDate() - 7);
  }
  
  /*
      component not implemented anywhere, place <app-timeline></app-timeline> at end of view-projects.component.html

      **** REMEMBER TO DELETE WHEN DONE TESTING BEFORE YOU PUSH TO "blue-team" BRANCH ****
  */
  
  currentDate = new Date();
  timelineUpperBound: Date = this.currentDate;
  timelineLowerBound: Date = this.currentDate;

  batchArray?: Array<batchTemplate>;

  constructor(public iter: IterationService, private datePipe: DatePipe) { 
    let btn = document.getElementById("showDetails");
    btn?.addEventListener("click", (e:Event) => this.showBatchDetails());
  }

  // .pipe(map(batch => batch.sort((a, b) => new Date(a.endDate).getTime() - new batch(b.endDate).getTime())))
  // This is what sorting our dates we get from the mock data service
  /*   initializeBatchArray() : void{
      this.iter.getBatchServiceMock().pipe(
        map(batch => batch.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()))
      )
        .subscribe(batch => {
          this.batchArray = batch.filter(batch => new Date(batch.endDate).getTime() - this.timelineLowerBound.getTime() > 0);
          this.calculateUpperBound(this.batchArray);
          console.log(this.batchArray);
        });
    } */

  calculateUpperBound(batchArray: Array<batchTemplate>) {
    this.timelineUpperBound = new Date(batchArray[batchArray.length - 1].endDate);
    this.timelineUpperBound.setDate(this.timelineUpperBound.getDate() + 1);
    console.log(this.timelineUpperBound);
  }

  showBatchDetails() : void{
    console.log('showing details!');
  };

  calculateP3StartDate(batch: batchTemplate): Date {
    let endDate = new Date(batch.endDate);
    endDate.setDate(endDate.getDate() - 21); // set date to 21 days prior to end date
    return endDate; // return new date as p3 start date
  }
}
