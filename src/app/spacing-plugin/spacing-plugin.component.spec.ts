import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacingPluginComponent } from './spacing-plugin.component';

describe('SpacingPluginComponent', () => {
  let component: SpacingPluginComponent;
  let fixture: ComponentFixture<SpacingPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpacingPluginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpacingPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
