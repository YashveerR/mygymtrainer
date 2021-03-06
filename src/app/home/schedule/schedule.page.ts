import { Component, OnInit , ViewChild, Inject, LOCALE_ID, OnDestroy, HostListener } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import {CrudService} from '../../shared/services/crud.service'
import {MenuController} from "@ionic/angular"
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit , OnDestroy{
  
  obs$ :any = [];

  userLoggedIn: any = false;
  itemz:any;
  userdata: any;

  adminUser:any;
  loggedInUser:any;

  public trainerList:any = [];

  collapseCard:any=true;
  collapseInfoCard:any=true;

  dispScheduleCard:any = false;


  isItemAvailable = false; 

  temp;
  selectedDay:number;
  selectedMonth:number;


  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false,
    clientId:''
  };

 
  
  minDate = new Date().toISOString();
 
  eventSource = [];
  userItem = [];
  userTimeStart = [];
  userTimeEnd = [];
  userTrainer = [];

  viewTitle;
 
  serverMonth:any = [];
  serverDay:any = [];
  startTimes:any = [];
  endTimes: any = [];
  clientTask: any = [];
  clientName: any = [];

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private alertCtrl: AlertController, 
    @Inject(LOCALE_ID) private locale: string,
    private crud:CrudService,
    private auth:AuthService,
    public menuCtrl: MenuController
  ) { 

    this.obs$.push( auth.checkUserLoggedIn().then(value => {
      this.userLoggedIn = value;
      this.userdata = JSON.parse(localStorage.getItem('user'));
    }));    
  }

  ngOnInit() {
    //need a process here to resolve on a promise only once the user is fully logged in
    try {
      this.obs$.push (this.auth.checkUserLoggedIn().then(value =>{
        if (value !== undefined) {
          console.log("ngOnint")
          this.userdata = value;
          this.setUserMode();
          this.resetEvent();
          this.getTrainers();              
          this.getUserSchedule();
          this.dispScheduleCard = false;          
        }
        else{
          console.log("somethings up here on init")
        }
      }));
    }
    catch (Error)
    {
      console.log("promise", Error.message);
    }    
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy(){
    console.log("ngOndestroy")
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
   }

   ionViewDidEnter()
   {
    this.menuCtrl.enable(true);
   }
  async setUserMode()
  {
    await this.crud.readUserData(this.userdata).subscribe(data =>{
      this.adminUser = data.data().verifiedTrainer;
      if (this.adminUser == true)
      {
        this.itemz = data.data().displayName;
        console.log("admin user ",this.adminUser);
        this.getTrainerSchedule();
      }
      this.loggedInUser = data.data().displayName;
    });
  }
  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      clientId:''
    };

    this.itemz = '';
    this.dispScheduleCard = false;
    this.temp = new Date().toISOString();

  }

  addEvent() {
    let eventCopy = {
      title: this.event.title,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc,
      clientId: this.loggedInUser
    }
 
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
 
    this.eventSource.push(eventCopy);
    this.postEvent(eventCopy);
    this.resetEvent();
    this.getUserSchedule();
    this.serverDay = [];
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
      console.log("pringint the trainer chosen",this.itemz);
      this.getTrainerSchedule();
    }

    doRefresh(events)
    {
      this.getUserSchedule();
      this.getTrainerSchedule();
      
      this.serverDay = [];
      
      setTimeout(() => {     
        //this.calculate();     
        //this.data_here = true;      
        console.log('Async operation has ended');
        events.target.complete();
      }, 2000);
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
      this.crud.createUserAppointment(this.loggedInUser,event);
    }

    async getTrainerSchedule()
    {
      var sDate = [];
      var eDate = [];
      var startDay = [];
      var sMonth =[];
      var sItem = [];
      var sTrainee = [];

      this.crud.readTrainerSchedule(this.itemz).subscribe(function(data){
        data.forEach(function(doc){
          console.log(doc.id, doc.data(), doc.data()["title"])
          const timstamp = doc.data().startTime && doc.data().startTime.toDate().toLocaleString();
          console.log(timstamp, doc.data().startTime && doc.data().startTime.toDate().toLocaleTimeString());
          const endTimeStamp = doc.data().endTime && doc.data().endTime.toDate().toLocaleTimeString();
          const sDay = doc.data().endTime && doc.data().endTime.toDate().getDate();
          const tempMonth = doc.data().endTime && doc.data().endTime.toDate().getMonth();
          console.log((doc.data().startTime && doc.data().startTime.toDate().toLocaleString()));
          sDate.push(timstamp);
          eDate.push(endTimeStamp);
          startDay.push(sDay);
          sMonth.push(tempMonth);
          sItem.push(doc.data().desc);
          sTrainee.push(doc.data().clientId);
        });
      });
      this.serverDay = startDay;
      this.startTimes = sDate;
      this.serverMonth = sMonth;
      this.endTimes = eDate
      this.clientName = sTrainee;
      this.clientTask = sItem;

    }

    getUserSchedule()
    {
      var userEvents = []
      var userStrt = [];
      var userE = [];
      var userTr = [];
      console.log("trying to get list of itemsz");
      this.crud.readUserSchedule(this.userdata["uid"]).subscribe(function(data){
        data.forEach(function(doc){          
          userEvents.push(doc.data().desc);
          userStrt.push(doc.data().startTime && doc.data().startTime.toDate().toLocaleString());
          userE.push(doc.data().endTime &&  doc.data().endTime.toDate().toLocaleTimeString());
          userTr.push(doc.data().title);
        });
      });
      this.userItem = userEvents;
      this.userTimeStart = userStrt;
      this.userTimeEnd = userE;
      this.userTrainer = userTr;
    }
   
    changeClick(event)
    {
      var we;
      we = new Date(this.temp);
      this.selectedDay = (we.getDate());
      this.selectedMonth = (we.getMonth() + 1);      
      this.dispScheduleCard = true;

    }
}
