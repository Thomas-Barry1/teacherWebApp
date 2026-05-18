import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface Message {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent implements AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  isOpen = false;
  newMessage = '';
  messages: Message[] = [
    { text: 'Hello! I\'m your TeachGenie assistant. What would you like to learn today?', isUser: false }
  ];
  isLoading = false;

  constructor(private apiService: ApiService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ text: this.newMessage, isUser: true });
      this.isLoading = true;
      
      this.apiService.sendChatMessage(this.newMessage).subscribe({
        next: (response) => {
          this.messages.push({ 
            text: response.message || 'I understand you said: ' + this.newMessage, 
            isUser: false 
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.messages.push({ 
            text: 'Sorry, I encountered an error. Please try again.', 
            isUser: false 
          });
          this.isLoading = false;
        }
      });
      
      this.newMessage = '';
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = 
        this.messageContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
