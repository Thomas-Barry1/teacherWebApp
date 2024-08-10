import { Injectable } from '@angular/core';

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
}
