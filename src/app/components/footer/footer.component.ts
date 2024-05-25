import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
    leftButtonsVisible: boolean = false;

  toggleLeftButtons() {
    this.leftButtonsVisible = !this.leftButtonsVisible;
  }
}
