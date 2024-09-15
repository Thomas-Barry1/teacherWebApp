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