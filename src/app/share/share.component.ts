import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  public link: any;

  constructor(private router: ActivatedRoute) {
    this.router.params.subscribe(params => {
        this.link = params.code;
    });
  }

  ngOnInit() {
  }

}
