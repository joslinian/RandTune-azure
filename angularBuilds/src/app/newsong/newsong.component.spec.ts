import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsongComponent } from './newsong.component';

describe('NewsongComponent', () => {
  let component: NewsongComponent;
  let fixture: ComponentFixture<NewsongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
