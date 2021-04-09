import { Project } from 'src/app/models/project.model';
import { ViewProjectService } from './../../service/view-project.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Status } from 'src/app/models/status.model';
import { User } from 'src/app/models/user.model';
import { Role } from 'src/app/models/role.model';



@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  constructor(private viewProjectService:ViewProjectService, private router:ActivatedRoute) { }

  //From heroes:
  powers = ['Really Smart', 'Super Flexible',
  'Super Hot', 'Weather Changer'];

  statuses = ['ACTIVE', 'NEEDS_ATTENTION', 'ARCHIVED'];

  model = new Project(1, "name", new Status(1, "name", "desc"), "sample desc", new User(1, "username", new Role(1, "string")), []);

  submitted = false;

  onSubmit() { this.submitted = true; }





  public desiredId:number=1 //this.router.snapshot.params['id'];
  public projects?:Project[]=[]
  public project?:Project;



  ngOnInit(): void {

    //get all projects
    this.viewProjectService.GetAllProjects().subscribe((data)=>
      {this.projects=data;

      //select project based on id
      for (let i=0; i<this.projects.length; i++){
        if (this.projects[i].id==this.desiredId){
          this.project=this.projects[i];
        }
      }


      console.log(`Projects: ${this.projects}`);
      console.log(`Selected Project: ${this.project}`);

      })






    
  }

}
