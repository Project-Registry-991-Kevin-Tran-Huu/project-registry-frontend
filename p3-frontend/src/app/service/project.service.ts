import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { REGISTRY_URL } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Status } from '../models/status.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public currentProject: Project = new Project(0,'', new Status(1,"IN_ITERATION",""),"", new User(1, "william", new Role(1,"admin")), [new Tag(1, "Revature", "Made by Revature")]);

  public setCurrentProject(project:Project) {
    this.currentProject = project;
  }

  public getCurrentProject():Project {
    return this.currentProject;
  }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http:HttpClient) { }


  public registerProject(newProject:Project):Observable<Project> {
    return this.http.post<Project>(`${REGISTRY_URL}project`,newProject, this.httpOptions)
      .pipe(
        tap(_ => console.log('posting project..')),
        catchError(this.handleError<any>('createProject'))
        );
  }

  public updateProject(project:Project):Observable<Project> {
    return this.http.put<Project>(`${REGISTRY_URL}project/id/${project.id}`,project, this.httpOptions)
      .pipe(
        tap(_ => console.log('updating project..')),
        catchError(this.handleError<any>('updateProject'))
        );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to a remote logging infrastructure
      // this.logger.error("WE ENCOUNTERED AN ERROR IN " + operation);
      console.error(error) // we'll just log it to the console

      // TODO: better job transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // we want to ensure that the app keeps running by returning an empty result
      return of(result as T);
    }
  }
}
