import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, HostListener } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit {
  htmlContent: string = `
    <button class="button">
      <div class="bg-container">
        <div class="bg-circle"></div>
      </div>
      <div class="front">
        <span>button</span>
      </div>
    </button>
  `;

  cssContent: string = `
    *,
    *::before,
    *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 100dvw;
      height: 100dvh;
      background: #121212;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    button {
      appearance: none;
      background: transparent;
      border: none;
      cursor: pointer;
      isolation: isolate;
    }

    .button {
      isolation: isolate;
      font-size: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid hsl(0, 0%, 10%);
      border-radius: 9999rem;
      background: transparent;
      position: relative;
      cursor: pointer;
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    .button  .bg-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      border-radius: inherit;
      position: absolute;
      inset: 0;
      overflow: hidden;
      z-index: -1;
    }

    .button  .bg-container  .bg-circle {
      width: 150%;
      aspect-ratio: 1;
      background: white;
      border-radius: 50%;
      position: absolute;
      transform: translate(60%, 60%);
      filter: blur(60px);
      transition: 500ms ease;
    }

    .button .front {
      color: hsl(0deg, 0%, 60%);
      padding-block: 12px;
      padding-inline: 24px 120px;
      border-radius: inherit;
      transition: 200ms ease;
    }

    .button:is(:hover, :focus)  .bg-circle {
      transition: transform 1s ease;
      transform: translate(0, 0);
    }

    .button:is(:hover, :focus)  .front {
      color: hsl(0deg, 0%, 10%);
    }

    .button:focus-visible {
      outline-color: white;
    }
  `;

  jsContent: string = '';

  isTabsMode: boolean = window.innerWidth < 760;
  selectedTab: string = 'html';
  expandedPanel: string = ''; 

  @ViewChild('iframe', { static: true }) iframe!: ElementRef;

  constructor(private renderer: Renderer2) {}

  @HostListener('window:resize')
  onWindowResize() {
    this.isTabsMode = window.innerWidth < 760;
  }

  ngAfterViewInit() {
    this.updateOutput();

    if (!this.isTabsMode) {
      const resizer1 = this.renderer.selectRootElement('#resizer1');
      const resizer2 = this.renderer.selectRootElement('#resizer2');

      this.initResizable(resizer1, '#htmlPanel', '#cssPanel');
      this.initResizable(resizer2, '#cssPanel', '#jsPanel');
    }
  }

  updateOutput() {
    const document = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow.document;
    document.open();
    document.write(this.getFullContent());
    document.close();
  }

  getFullContent() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>${this.cssContent}</style>
      </head>
      <body>
        ${this.htmlContent}
        <script>${this.jsContent}</script>
      </body>
      </html>
    `;
  }

  initResizable(resizer: HTMLElement, previousSelector: string, nextSelector: string) {
    let x = 0;
    let prevWidth = 0;
    let nextWidth = 0;

    const previous = this.renderer.selectRootElement(previousSelector);
    const next = this.renderer.selectRootElement(nextSelector);

    const mouseDownHandler = (e: MouseEvent) => {
      x = e.clientX;
      prevWidth = previous.getBoundingClientRect().width;
      nextWidth = next.getBoundingClientRect().width;

      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const dx = e.clientX - x;

      const newPrevWidth = prevWidth + dx;
      const newNextWidth = nextWidth - dx;

      if (newPrevWidth > 50 && newNextWidth > 50) {
        this.renderer.setStyle(previous, 'width', `${newPrevWidth}px`);
        this.renderer.setStyle(next, 'width', `${newNextWidth}px`);
      }
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    resizer.addEventListener('mousedown', mouseDownHandler);
  }

  // toggleExpand(panel: string) {
  //   if (this.expandedPanel === panel) {
  //     this.expandedPanel = '';
  //   } else {
  //     this.expandedPanel = panel;
  //   }
  // }
  
  toggleExpand(panel: string) {
    const container = document.querySelector('.main-container');
    const panels = document.querySelectorAll('.edit-panel');
  
    if (container) {
      if (this.expandedPanel === panel) {
        container.classList.remove('hide-other-columns');
        container.classList.remove('vertical-headers');
        panels.forEach(panel => panel.classList.remove('full-width'));
      } else {
        container.classList.add('hide-other-columns');
        container.classList.add('vertical-headers');
        panels.forEach(panel => panel.classList.remove('full-width'));
        const targetPanel = document.querySelector(`.${panel}`);
        if (targetPanel) {
          targetPanel.classList.add('full-width');
        }
      }
  
      this.expandedPanel = this.expandedPanel === panel ? '' : panel;
    }
  }
  













  

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
