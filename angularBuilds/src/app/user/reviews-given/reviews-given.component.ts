import { Input, Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import IReviewModelAngular from '../../share/IReviewModelAngular';
import { UserService } from '../user-service.service';
import { Review } from '../../share/Review';

@Component({
  selector: 'reviews-given',
  templateUrl: './reviews-given.component.html',
  styleUrls: ['./reviews-given.component.css']
})
export class ReviewsGivenComponent implements OnInit {
@Input() review: IReviewModelAngular;
@Input() index: number;
musicianId: string;
title: string;
musician: string;

constructor(
	private route: ActivatedRoute,
    private location: Location,
    private user$: UserService
  ) {}

  ngOnInit() {
	this.user$.getSongById(this.review.song_id)
	.subscribe(
		result => {
			this.title = result[0].title;
			this.musicianId = result[0].musician;
		},
		() => {},
		() => {
			this.user$.getUserById(this.musicianId)
			.subscribe(
				result => {
					this.musician = result.username;
				},
				() => {},
				() => {}
			);
		}
	);
  }
}