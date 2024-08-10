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
    const dirtyHtml = await this.ensureString(marked.parse(markdown));
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);
    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  async convertHtml(markdown: string): Promise<string> {
    const dirtyHtml = await this.ensureString(marked.parse(markdown));
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);
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