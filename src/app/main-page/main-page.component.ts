import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {System} from "../system/System";
import {Pattern} from "../model/daw/Pattern";
import {ProjectDto} from "../shared/api/ProjectDto";
import {ApiEndpoint} from "../shared/api/ApiEndpoint";
import {GridCellDto} from "../shared/api/GridCellDto";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  project: ProjectDto;
  gridCellDimensionIndex: number = 0;
  gridCellDimensions = [
    {width: 100, height: 50},
    {width: 200, height: 100}
  ];
  sequencerCellDimensionIndex: number = 0;
  sequencerGridCellDimensions = [
    {width: 100, height: 50},
    {width: 200, height: 100}
  ];



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject("ProjectsApi") private projectsApi: ApiEndpoint<ProjectDto>,
    private system: System) {

  }

  close(): void {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectsApi.get(params.projectId).subscribe(project => {
        this.project = project;
      }, error => this.system.error(error));
    });
  }

  save(): void {
    this.projectsApi.put(this.project)
      .subscribe(() => {

        console.log("project saved")
      }, error => {

        this.system.error(error)
      });
  }

  focusedCellChanged(cell: GridCellDto): void {

  }
}



