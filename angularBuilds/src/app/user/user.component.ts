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
	userId: string;
  
  constructor(
	private route: ActivatedRoute,
    private location: Location,
    private user$: UserService
  ) {
	  user$.getUserProfile()
	  .subscribe(
		  result => {
			this.userFName = result.first_name;
			this.userLName = result.last_name;
			this.username = result.username;
			this.userBio = result.bio;
			this.userFB = result.facebook;
			this.userTwitter = result.twitter;
			this.userBalance = result.balance;
			this.userId = result._id;
		  },
		    () => {},
			() => {
				user$.getReviews(this.userId)
				.subscribe(
				result => this.reviews = result,
				() => {},
				() => {
					user$.getSongsByUserId(this.userId)
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