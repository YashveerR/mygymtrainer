import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/auth.service"

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  checkBoxValue:boolean = false;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
  }

  checkboxClick(e){

    console.log(e.target.value)
    this.checkBoxValue ? this.checkBoxValue = false : this.checkBoxValue = true;
    console.log(this.checkBoxValue)
  }

}
