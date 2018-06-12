import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsGivenComponent } from './reviews-given.component';

describe('ReviewsGivenComponent', () => {
  let component: ReviewsGivenComponent;
  let fixture: ComponentFixture<ReviewsGivenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewsGivenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewsGivenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
