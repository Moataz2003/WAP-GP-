import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdxlImg2imgComponent } from './sdxl-img2img.component';

describe('SdxlImg2imgComponent', () => {
  let component: SdxlImg2imgComponent;
  let fixture: ComponentFixture<SdxlImg2imgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SdxlImg2imgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SdxlImg2imgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
