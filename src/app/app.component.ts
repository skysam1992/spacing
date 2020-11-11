import { Component } from '@angular/core';
import { SpacesProperty } from './spacing-plugin/spacing-plugin.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  adjustData: SpacesProperty = {
    topPadding: 10,
    topMargin: 10,
    bottomPadding: 10,
    bottomMargin: 10,
    leftPadding: 10,
    leftMargin: 10,
    rightPadding: 10,
    rightMargin: 10
  }
}
