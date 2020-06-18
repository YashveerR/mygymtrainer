import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MydetailsPage } from './mydetails.page';

describe('MydetailsPage', () => {
  let component: MydetailsPage;
  let fixture: ComponentFixture<MydetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MydetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MydetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
