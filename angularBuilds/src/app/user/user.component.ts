import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from './user-service.service';
import ISongModelAngular from '../share/ISongModelAngular';
import { Song } from '../share/Song';
import IUserModelAngular from '../share/IUserModelAngular';
import { User } from '../share/User';
import IReviewModelAngular from '../share/IReviewModelAngular';
import { Review } from '../share/Review';
import { ReviewsGivenComponent } from './reviews-given/reviews-given.component';
import { UserSongsComponent } from './user-songs/user-songs.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  userFName: string;
  userLName: string;
  username: string;
  userBio: string;
  userFB: string;
  userTwitter: string;
  userBalance: number;
  reviews: IReviewModelAngular[];
  songs: ISongModelAngular[];
  
  constructor(
		private route: ActivatedRoute,
    private location: Location,
    private user$: UserService
  ) {
	  user$.getUser('mafiag@gmail.com')
	  .subscribe(
		  result => {
			this.userFName = result.first_name;
			this.userLName = result.last_name;
			this.username = result.username;
			this.userBio = result.bio;
			this.userFB = result.facebook;
			this.userTwitter = result.twitter;
			this.userBalance = result.balance;
		  },
		    () => {},
			() => {
				user$.getReviews('5b0de177a0e9e35b0a1665f3')
				.subscribe(
				result => this.reviews = result,
				() => {},
				() => {
					user$.getSongsByUserId('5b0de177a0e9e35b0a1665f2')
					.subscribe(
					result => {this.songs = result;console.log(this.songs);},
					() => {},
					() => {}
					);
				}
				);
			}
	    );
  }

  ngOnInit() {}

}