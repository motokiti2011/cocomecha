import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'coco-mecha';

  constructor(
    private router:Router,
  ){};

  ngOnInit() {
    this.router.navigate(["/main_menu"])
  }

  onActivate(e:any) {
    console.log('appmenuEvent:'+e);
    console.log(e);
    // console.log(e.activeRouter);
    // console.log(e.activeRouter.component);
    console.log(String(e.activeRouter.component));
  

  }

}
