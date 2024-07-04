import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as marked from '../../node_modules/marked'
import * as DOMPurify from 'dompurify';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  constructor(private sanitizer: DomSanitizer) { }

  async convert(markdown: string): Promise<SafeHtml> {
    const dirtyHtml = await this.ensureString(marked.parse(markdown));
    const cleanHtml = DOMPurify.sanitize(markdown);
    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }

  private async ensureString(value: string | Promise<string>): Promise<string> {
    if (value instanceof Promise) {
      return await value;
    } else {
      return value;
    }
  }
}

