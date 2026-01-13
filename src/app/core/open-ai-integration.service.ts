import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenAiIntegrationService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = 'YOUR_API_KEY'; 

  constructor(private http: HttpClient) {}

  generateAnswer(question: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    });

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Згенеруй відповідь на запитання:',
        },
        {
          role: 'user',
          content: question,
        },
      ],
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((response) => response.choices[0].message.content as string)
    );
  }
}
