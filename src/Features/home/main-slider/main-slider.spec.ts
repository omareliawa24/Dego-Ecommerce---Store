import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSlider } from './main-slider';

describe('MainSlider', () => {
  let component: MainSlider;
  let fixture: ComponentFixture<MainSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
