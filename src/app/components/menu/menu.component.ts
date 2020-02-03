import { Component, OnInit } from '@angular/core';
import {StringConstants} from '../../constants/string-constants';
import {StatisticService} from '../../services/statistic.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  stringConstants = StringConstants;
  loggedIn = sessionStorage.getItem('email');

  constructor(private statisticsService: StatisticService) { }

  ngOnInit() {}

  callBackend() {
    this.statisticsService.getUserStatistic(null).subscribe(
      data => {
        console.log(data);
      }
    );
  }
}
