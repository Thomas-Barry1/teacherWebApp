import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as marked from 'marked'
import * as DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor(private sanitizer: DomSanitizer) { }

  async convert(markdown: string): Promise<SafeHtml> {
    // Replace newlines (\n) with <br>
    // markdown = markdown.replace(/\n/g, '<br>');
    const dirtyHtml = await this.ensureString(marked.parse(markdown));
    var cleanHtml = DOMPurify.sanitize(dirtyHtml);
    console.log("Marked: ", cleanHtml);
    // Replace <p> with <p style="white-space: pre-line;"> to keep formatting and spaces
    cleanHtml = cleanHtml.replaceAll("<p>", "<p style='white-space: pre-line;'>")
    console.log("Replaced string: ", cleanHtml);
    // Have the answer key on a new page
    cleanHtml = cleanHtml.replace("<p style='white-space: pre-line;'><strong>Answer Key", "<p style='white-space: pre-line; page-break-before: always;'><strong>Answer Key");
    cleanHtml = cleanHtml.replace("<h2>Answer Key", "<h2 style='page-break-before: always;'>Answer Key");
    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  async convertHtml(markdown: string): Promise<string> {
    // // Replace newlines (\n) with <br>
    // markdown = markdown.replace(/\n/g, '<br>');
    const dirtyHtml = await this.ensureString(marked.parse(markdown));
    var cleanHtml = DOMPurify.sanitize(dirtyHtml);
    console.log("Marked: ", cleanHtml);
    // Replace <p> with <p style="white-space: pre-line;"> to keep formatting and spaces
    cleanHtml = cleanHtml.replaceAll("<p>", "<p style='white-space: pre-line;'>")
    // Have the answer key on a new page
    cleanHtml = cleanHtml.replace("<p style='white-space: pre-line;'><strong>Answer Key", "<p style='white-space: pre-line; page-break-before: always;'><strong>Answer Key")
    cleanHtml = cleanHtml.replace("<h2>Answer Key", "<h2 style='page-break-before: always;'>Answer Key")
    console.log("Replaced string: ", cleanHtml);
    return cleanHtml;
  }

  private async ensureString(value: string | Promise<string>): Promise<string> {
    if (value instanceof Promise) {
      return await value;
    } else {
      return value;
    }
  }
}