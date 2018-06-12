/*import { Component, OnInit, Input } from '@angular/core';
import { SongService } from '../song-service.service';
@Component({
  selector: 'app-newsong',
  templateUrl: './newsong.component.html',
  styleUrls: ['./newsong.component.css']
})
export class NewsongComponent implements OnInit {
  song: any;
  constructor(songS: SongService) { 
    songS.getRandomSong()
    .subscribe(
      result => this.song = result,
      () => {},
      () => console.log('REST call:' + this.song)
    );
  }
  ngOnInit() {
  }
}*/

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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators } from '@angular/forms';

@Component({
  //moduleId: module.id,
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

}