import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';
import * as _ from 'lodash';

import { ExpenseItem } from '../../models/expense-item.interface';
import { DayPage } from "../day/day";

import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from "../../services/expenses";

@Component({
  selector: 'page-days',
  templateUrl: 'days.html',
})
export class DaysPage implements OnInit {
  dayPage = DayPage;
  private currentYear: string = moment().format('YYYY');
  private dbList = 'dydo/expenseItems/' + this.currentYear;
  public daysList;
  public expenseListOfDays: FirebaseListObservable<any[]>
  public expenseListSubscription: Subscription;
  public days = [];
  public dayWithExpenses = {};
  public allMonthlyMoneySpent: number;
  public showSpinner: boolean = true;
  public noData: boolean = true;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public database: AngularFireDatabase,
    public expensesService: ExpensesService
  ) {

  }

  ionViewDidLeave() {
    this.expensesService.safeUnsubscribe(this.expenseListSubscription);
  }

  ngOnInit() {
    this.daysList = this.navParams.data;
    this.expensesService.selectedMonth = this.daysList.$key;
    this.getMonthNumber(this.daysList.$key);
    this.dbList = 'dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth;
    this.expenseListOfDays = this.expensesService.getItemsList(this.dbList)
    this.expenseListSubscription = this.expenseListOfDays.subscribe(data => {
      this.showSpinner = false
      if (data == null) {
        this.noData = true;
        return;
      } else {
        if (data.length < 1) {
          this.noData = true;
          return;
        } else {
          this.getDays(data);
          this.noData = false;
        }
      }
    });
  }

  getMonthlySpentMoney() {
    this.allMonthlyMoneySpent = 0;
    for (let money in this.dayWithExpenses) {
      this.allMonthlyMoneySpent = this.allMonthlyMoneySpent + this.dayWithExpenses[money];
    }
  }

  getDays(data) {
    for (let day of data) {
      this.days.push(day.$key);
    }
    this.getDayMoney();
  }

  getDayMoney() {
    for (let day of this.days) {
      let databaseAddress = 'dydo/expenseItems/' + this.currentYear + '/' + this.expensesService.selectedMonth + '/' + day;
      let listOfDay = this.database.list(databaseAddress);
      listOfDay.subscribe(x => {
        this.dayWithExpenses[day] = this.getFullSpentMoney(x);
        this.getMonthlySpentMoney();
      });
    }
  }

  getFullSpentMoney(data) {
    let allMoney: number = 0;
    for (let expense of data) {
      allMoney += Number(expense.expenseValue);
    }
    return Number(allMoney);
  }

  getMonthNumber(month) {
    switch (month) {
      case ('styczeń'): { this.expensesService.selectedMonthNumber = 1; break; }
      case ('luty'): { this.expensesService.selectedMonthNumber = 2; break; }
      case ('marzec'): { this.expensesService.selectedMonthNumber = 3; break; }
      case ('kwiecień'): { this.expensesService.selectedMonthNumber = 4; break; }
      case ('maj'): { this.expensesService.selectedMonthNumber = 5; break; }
      case ('czerwiec'): { this.expensesService.selectedMonthNumber = 6; break; }
      case ('lipiec'): { this.expensesService.selectedMonthNumber = 7; break; }
      case ('sierpień'): { this.expensesService.selectedMonthNumber = 8; break; }
      case ('wrzesień'): { this.expensesService.selectedMonthNumber = 9; break; }
      case ('październik'): { this.expensesService.selectedMonthNumber = 10; break; }
      case ('listopad'): { this.expensesService.selectedMonthNumber = 11; break; }
      case ('grudzień'): { this.expensesService.selectedMonthNumber = 12; break; }
    }
  }

  monthNumber(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }

}
