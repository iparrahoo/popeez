import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  public today: Date = new Date();

  constructor() { }

  public ngOnInit(): void { }

}
