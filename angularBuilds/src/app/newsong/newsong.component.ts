import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { SongService } from './song-service.service';
import ISongModelAngular from '../share/ISongModelAngular';
import { Song } from '../share/Song';
import IUserModelAngular from '../share/IUserModelAngular';
import { User } from '../share/User';
import { Plyr } from 'plyr';

@Component({
  selector: 'app-newsong',
  templateUrl: './newsong.component.html',
  styleUrls: ['./newsong.component.css']
})

export class NewsongComponent implements OnInit {
  title: string;
  album: string;
  musician: string;
  musicianName: string;
  musicianBio: string;
  musicianFB: string;
  musicianTwitter: string;
  mp3Id: string;
  songId: string;
  reviewrating = 0;
  selected = 0;
  hovered = 0;
  readonly = false;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private song$: SongService
  ) { 
    song$.getRandomSong()
    .subscribe(
		result => {
			this.title = result.title;
			this.album = result.album;
			this.musician = result.musician;
			this.mp3Id = '/songs/raw/' + result.mp3_id;
			this.songId = result._id;
			var audioPlayer = <HTMLAudioElement>document.getElementById('player');
			audioPlayer.load();
		},
		() => {},
		() => {
			song$.getMusician(this.musician)
			.subscribe(
			  result => {
				this.musicianName = result.username;
				this.musicianBio = result.bio;
				this.musicianFB = result.facebook;
				this.musicianTwitter = result.twitter;
			  },
			() => {},
			() => {}
			);}
		);
	}

  ngOnInit() {}
  
  submitReview(form, rate){
	this.song$.submitReview('5b0de177a0e9e35b0a1665f3', this.songId, String(form.value), String(this.selected))
	.subscribe(
	result => {console.log('hello!');},
	() => {console.log('a');},
	() => {console.log('b');}
	);
    alert("The form was submitted");
    form.reset();
  }
}