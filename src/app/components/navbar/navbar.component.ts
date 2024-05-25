import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMobile: boolean | undefined;
  navbarOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.checkIfMobile();
  }

  checkIfMobile(): void {
    const screenWidth = window.innerWidth;
    this.isMobile = screenWidth <= 768; // Adjust the breakpoint as needed
  }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }
}
