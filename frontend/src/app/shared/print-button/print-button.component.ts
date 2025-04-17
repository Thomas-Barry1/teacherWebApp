// src/app/shared/print-button/print-button.component.ts
import { Component, ElementRef, Input } from '@angular/core';
import { PrintService } from '../../services/print.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-print-button',
  templateUrl: './print-button.component.html',
  styleUrls: ['./print-button.component.css']
})
export class PrintButtonComponent {
  @Input() contentToPrint: string = '';
  @Input() kahootContent: any[] = [];
  @Input() enablePdf: boolean = true;
  @Input() enableTextFile: boolean = false;
  @Input() enableClipboard: boolean = false;
  @Input() enableKahoot: boolean = false;
  @Input() buttonText: string = 'Save as PDF';
  // The id of element to copy
  @Input() textElement!: ElementRef | HTMLElement;

  constructor(private printService: PrintService) { }

  print() {
    this.printService.printContent(this.contentToPrint);
  }

  saveAsPdf() {
    this.printService.printContent(this.contentToPrint);
    // const height = window.screen.availHeight - 100;
    // const width = window.screen.availWidth - 150;

    // const printWindow = window.open('', '', `height=${height},width=${width}`);
    // if (printWindow != null) {
    //   printWindow.document.write('<html><head><title></title>');
    //   printWindow.document.write('</head><body>');
    //   printWindow.document.write(this.contentToPrint);
    //   printWindow.document.write('</body></html>');
    //   printWindow.document.close();

    //   printWindow.onload = () => {
    //     printWindow.print();
    //     printWindow.close();
    //   };
    // }
  }

  saveAsCsv() {
    this.printService.exportAsExcelFile(this.kahootContent, "kahoot");
  }

  saveAsTextFile() {
    const blob = new Blob([this.contentToPrint], { type: 'text/plain' });
    saveAs(blob, 'generated_text.txt');
  }

  copyToClipboard() {
    let elementToCopy: HTMLElement;

    // Ensure the textElement is an HTMLElement, whether it's an ElementRef or passed directly as an HTMLElement
    if (this.textElement instanceof ElementRef) {
      elementToCopy = this.textElement.nativeElement;
    } else if (this.textElement instanceof HTMLElement) {
      elementToCopy = this.textElement;
    } else {
      console.error('Invalid element provided for copying.');
      return;
    }

    const range = document.createRange();
    const selection = window.getSelection();

    try {
      // Select the text inside the provided div element
      range.selectNodeContents(elementToCopy);
      if(selection != null){
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // Execute the copy command
      document.execCommand('copy');
      alert('Text copied to clipboard!');
    } catch (err) {
      alert('Unable to copy text');
    }

    // Clear the selection
    if(selection != null){
      selection.removeAllRanges();
    }
  }
  // copyToClipboard() {
  //   navigator.clipboard.writeText(this.contentToPrint).then(() => {
  //     alert('Text copied to clipboard');
  //   }).catch(err => {
  //     console.error('Could not copy text: ', err);
  //   });
  // }
}

