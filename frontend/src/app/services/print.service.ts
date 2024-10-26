import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  printContent(content: string, cssPath: string = 'assets/css/printPDF.css') {
    let height = window.screen.availHeight-100;
    let width = window.screen.availWidth-150;
    var printWindow = window.open('', '', `height=${height},width=${width}`);
    if (printWindow != null){
      printWindow.document.write('<html><head><title></title>');
      // Place css file in assets folder
      // printWindow.document.write('<link rel="stylesheet" href="assets/css/printPDF.css" />');
      printWindow.document.write('</head><body>');
      printWindow.document.write(content);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
  //   // Wait for the content to be fully loaded before printing
  //   printWindow.onload = () => {
  //     printWindow.print();
  //     printWindow.close(); // Optionally close the print window after printing
  //   };
  // }
    }
  }

  data = [
    { name: 'John', age: 30 },
    { name: 'Mary', age: 25 }
  ];

  printCsv(content: any[]){
    this.generateCsv(content);
  }

  generateCsv(data: any[], filename: string = 'kahoot.csv'): void {
    const csvData = this.convertToCsv(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    FileSaver.saveAs(blob, filename);
  }

  private convertToCsv(data: any[]): string {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return headers + '\n' + rows;
  }
}
