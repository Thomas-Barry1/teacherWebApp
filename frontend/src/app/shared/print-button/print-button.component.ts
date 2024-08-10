// src/app/shared/print-button/print-button.component.ts
import { Component, Input } from '@angular/core';
import { PrintService } from '../../services/print.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-print-button',
  templateUrl: './print-button.component.html',
  styleUrls: ['./print-button.component.css']
})
export class PrintButtonComponent {
  @Input() contentToPrint: string = '';
  @Input() enablePdf: boolean = true;
  @Input() enableTextFile: boolean = false;
  @Input() enableClipboard: boolean = false;

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

  saveAsTextFile() {
    const blob = new Blob([this.contentToPrint], { type: 'text/plain' });
    saveAs(blob, 'generated_text.txt');
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.contentToPrint).then(() => {
      alert('Text copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}

