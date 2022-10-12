import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.addEventListener("scroll",function(){
      let nav = this.document.querySelector("nav");
      nav?.classList.toggle("bajo",this.window.scrollY>0)
    })
  }

}
