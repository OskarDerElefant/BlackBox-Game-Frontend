import { Component, OnInit } from '@angular/core';
import {StatisticService} from '../../services/statistic.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.scss']
})
export class StatisticComponent implements OnInit {

  constructor(private statisticService: StatisticService) { }

  ngOnInit() {
    this.statisticService.getUserStatistic(null).subscribe(
      data => {
        console.log(data);
      }
    );
  }

}
