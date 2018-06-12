import { Input, Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import ISongModelAngular from '../../share/ISongModelAngular';
import { UserService } from '../user-service.service';
import { Review } from '../../share/Review';

@Component({
  selector: 'user-songs',
  templateUrl: './user-songs.component.html',
  styleUrls: ['./user-songs.component.css']
})
export class UserSongsComponent implements OnInit {
@Input() song: ISongModelAngular;
@Input() index: number;
  constructor(
  	private route: ActivatedRoute,
    private location: Location,
    private user$: UserService
  ) {}

  ngOnInit() {
  }

}
