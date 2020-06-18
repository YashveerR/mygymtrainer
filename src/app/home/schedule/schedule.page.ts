import { Component, OnInit , ViewChild, Inject, LOCALE_ID} from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import {CrudService} from '../../shared/services/crud.service'

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  
  items = ["Ram","gopi", "dravid"];
  itemz:any;

  public trainerList:any = [];

  collapseCard:any=true;

  isItemAvailable = false; 

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

  initializeItems(){
    this.items = ["Ram","gopi", "dravid"];
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
      this.crud.readTrainerSchedule(this.itemz).subscribe(function(data){
        data.forEach(function(doc){
          console.log(doc.id, doc.data()["startTime"])
        });
      });
    }

}
