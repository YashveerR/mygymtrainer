import { Component, OnInit , ViewChild, Inject, LOCALE_ID} from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import {CrudService} from '../../shared/services/crud.service'
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  
  itemz:any;

  public trainerList:any = [];

  collapseCard:any=true;

  isItemAvailable = false; 

  temp;
  selectedDay:number[] = new Array(0);
  selectedMonth:number[] = new Array(0);
  calculatedHrs:number[] = new Array(0);
  calculatedMins:number[] = new Array(0);

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  minDate = new Date().toISOString();
 
  eventSource = [];
  viewTitle;
 
  serverDay:any = [];
  serverMonth:any = [];
  serverHour:any = [];
  serverMinute:any = [];

  startTimes:any = [];
  endTimes: any = [];

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(private alertCtrl: AlertController, 
    @Inject(LOCALE_ID) private locale: string,
    private crud:CrudService
  ) { }

  ngOnInit() {
    this.resetEvent();
    this.getTrainers();
  }
  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }

  addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }
 
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 
    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.postEvent(eventCopy);
    this.resetEvent();
  }

  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }
   
  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }
   
  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode;
  }
   
  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }
   
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
   
  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
   
    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }
   
  // Time slot was clicked
  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }

    getItems(ev: any) {
      // Reset items back to all of the items
           
      // set val to the value of the searchbar
      const val = ev.target.value;
     
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
          this.isItemAvailable = true;
          this.trainerList = this.trainerList.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
      }
      
    }

    supplierSelected(selected: string)
    {
      this.itemz = selected;
      this.event.title = selected;
      this.isItemAvailable = false;
      this.getTrainerSchedule();
    }

    doRefresh(events)
    {
      
    }

    async getTrainers()
    {
      var list=[]
      this.crud.readAllTrainers("trainer").subscribe(function(data){
        data.forEach(function(doc){
            console.log(doc.id, doc.data[""]);
            list.push(doc.id);
        });
        
      });
      this.trainerList = list;
      console.log(this.trainerList)
    }

    postEvent(event)
    {
      this.crud.createAppointment(this.itemz,event);
    }

    async getTrainerSchedule()
    {
      var sDate = [];
      var sMonth = [];
      var sHour = [];
      var sMinute = [];
      var sHourEnd = [];
      var sMinuteEnd = [];

      this.crud.readTrainerSchedule(this.itemz).subscribe(function(data){
        data.forEach(function(doc){
          console.log(doc.id, doc.data(), doc.data()["title"])
          const timstamp = doc.data().startTime && doc.data().startTime.toDate();
          console.log(timstamp);
          const endTimeStamp = doc.data().endTime && doc.data().endTime.toDate();

          sDate.push((doc.data().startTime && doc.data().startTime.toDate().getDate()));
          sMonth.push((doc.data().startTime && doc.data().startTime.toDate().getMonth()) + 1);
          sHour.push((doc.data().startTime && doc.data().startTime.toDate().getHours()));
          sMinute.push((doc.data().startTime && doc.data().startTime.toDate().getMinutes()));
          sHourEnd.push((doc.data().startTime && doc.data().endTime.toDate().getHours()));
          sMinuteEnd.push((doc.data().startTime && doc.data().endTime.toDate().getMinutes()));
        });
      });
      console.log(sDate, sMonth, sHour, sMinute);
    }

    markDisabled = (date: Date) => {
      var current = new Date();
      return date < current;
    };

    calculateHours(serverDate, serverMonth, startTimeHr, startTimeMin, endTimeHr, endTimeMin)
    {
      serverMonth.forEach((element, index) => {
        if (element == this.selectedMonth) {
          if (serverDate[index] == this.selectedDay) {
            //perform the logic to remove times from this day
            this.calculatedMins[0] = 60 - (endTimeMin - startTimeMin);
            this.calculatedHrs[0] = endTimeHr - startTimeHr;
          }
        }
        
      });
    }
    
    changeClick(event)
    {
      var we;
      console.log("change. ........",event.detail)

      we = new Date(this.temp);
      console.log((we));
      this.selectedDay.push(we.getDate());
      this.selectedMonth.push(we.getMonth() + 1);
      console.log(this.selectedMonth);
    }
}
