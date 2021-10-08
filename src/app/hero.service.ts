import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class HeroService {

  private heroesUrl = 'http://localhost:5000';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesUrl+'/Heroes').pipe(
        catchError(this.handleError<Hero[]>('getHeroes', [])),
        tap(_ => this.log('fetched heroes'))
      );
  }


  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/Heroes/${id}`;
    return this.http.get<Hero>(url).pipe(
      catchError(this.handleError<Hero>(`getHero id=${id}`)),
      tap(_ => this.log(`fetched hero id=${id}`))
    );
  }


  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/Heroes/${term}`).pipe(
      catchError(this.handleError<Hero[]>('searchHeroes', [])),
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`))
    );
  }


  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl+'/Heroes', hero).pipe(
      catchError(this.handleError<Hero>('addHero')),
      tap((newHero: Hero) => this.log(`added hero id=${newHero.heroId}`))
    );
  }


  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url).pipe(
      catchError(this.handleError<Hero>('deleteHero')),
      tap(_ => this.log(`deleted hero id=${id}`))
    );
  }


  updateHero(hero: Hero): Observable<any> {
    return this.http.put<Hero>(this.heroesUrl+'/Heroes', hero).pipe(
      catchError(this.handleError<any>('updateHero')),
      tap(changedHero => this.log(`updated hero id=${changedHero.heroId}`))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);

    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
