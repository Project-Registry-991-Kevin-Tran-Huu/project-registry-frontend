import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { REGISTRY_URL } from '../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Project } from '../models/project.model';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class ViewProjectService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type' : 'application/json'})
  }

  constructor(private http:HttpClient) { }

  /* Return all the projects from DB**/
  public GetAllProjects():Observable<Project[]>{
    return this.http.get<Project[]>(`${REGISTRY_URL}project`, this.httpOptions)
    .pipe(
      catchError(this.handleError<Project[]>('GetProject',[]))
    )}


  /* intended to get all status type porjects in the DB**/
  public GetAllProjectStatus():Observable<Project[]>{
    return this.http.get<Project[]>(`${REGISTRY_URL}project`, this.httpOptions)
    .pipe(
      catchError(this.handleError<Project[]>('GetProject',[]))
    )}


    //Return all the available type of tags
    public GetAllProjectTags():Observable<Tag[]>{
      return this.http.get<Tag[]>(`${REGISTRY_URL}Tag`, this.httpOptions)
      .pipe(
        catchError(this.handleError<Tag[]>('GetTag',[]))
      )}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log it to the console if something goes wrong
      return of(result as T);
    }
  }
}

