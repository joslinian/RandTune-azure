import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  getUser(userEmail: string) {
	  return this.http.get('/users/profile/' + userEmail)
	  .map(response => response.json());
  }

  getUserProfile() {
	  return this.http.get('/profile')
	  .map(response => response.json());
  }
  
  getUserById(userId: string) {
	  return this.http.get('/users/' + userId)
	  .map(response => response.json());
  }
  
  getReviews(musicianId: string) {
	  return this.http.get('/users/profile/reviews/' + musicianId)
	  .map(response => response.json());
  }
  
  getSongById(songId: string) {
	  return this.http.get('/songs/meta/' + songId)
	  .map(response => response.json());
  }
  
  getSongsByUserId(userId: string) {
	  return this.http.get('/users/' + userId + '/songs')
	  .map(response => response.json());
  }
  
  submitReview(userId: string, songId: string, content: string, rating: string) {
	let i = userId + '/' + songId + '/' + content + '/' + rating;
	return this.http.post('/upload/review/', i);
  }
}