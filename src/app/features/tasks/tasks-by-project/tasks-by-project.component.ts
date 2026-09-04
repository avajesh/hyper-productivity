import { ChangeDetectionStrategy, Component, inject, input, Input } from '@angular/core';
import { T } from 'src/app/t.const';
import { Task } from '../task.model';
import { unique } from '../../../util/unique';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { DateService } from '../../../core/date/date.service';
import { Store } from '@ngrx/store';
import { selectAllProjects } from '../../project/store/project.selectors';
import { Project } from '../../project/project.model';
import { getDbDateStr } from '../../../util/get-db-date-str';
import { AsyncPipe } from '@angular/common';
import { MsToStringPipe } from '../../../ui/duration/ms-to-string.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { LazyChartComponent } from '../../metric/lazy-chart/lazy-chart.component';
import { ChartData } from 'chart.js';
import { standardListAnimation } from '../../../ui/animations/standard-list.ani';

export interface ProjectWithTimeSpent {
  id: string;
  project?: Project;
  title: string;
  color?: string;
  timeSpentToday: number;
}

@Component({
  selector: 'tasks-by-project',
  templateUrl: './tasks-by-project.component.html',
  styleUrls: ['./tasks-by-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [standardListAnimation],
  imports: [AsyncPipe, MsToStringPipe, TranslatePipe, LazyChartComponent],
})
export class TasksByProjectComponent {
  private readonly _store = inject(Store);
  private readonly _dateService = inject(DateService);

  T: typeof T = T;
  readonly dayStr = input<string>(this._dateService.todayStr());
  readonly isForToday = input<boolean>(true);
  readonly isShowYesterday = input<boolean>(false);
  flatTasks: Task[] = [];
  todaysTasksProjectIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  projectsWithTimeSpent$: Observable<ProjectWithTimeSpent[]> = this.todaysTasksProjectIds$.pipe(
    withLatestFrom(this._store.select(selectAllProjects)),
    map(([projectIds, allProjects]) => {
      // Find time spent per project ID
      const mappedProjects: ProjectWithTimeSpent[] = projectIds
        .map((projectId) => {
          const project = allProjects.find((p) => p.id === projectId);
          return this._mapToProjectWithTasks(projectId, project);
        })
        .filter((p) => p.timeSpentToday > 0);
      return mappedProjects.sort((a, b) => b.timeSpentToday - a.timeSpentToday);
    }),
  );

  pieChartData$: Observable<ChartData<'pie'> | null> = this.projectsWithTimeSpent$.pipe(
    map((projectsWithTimeSpent) => {
      if (!projectsWithTimeSpent || projectsWithTimeSpent.length === 0) {
        return null;
      }
      
      return {
        labels: projectsWithTimeSpent.map((p) => p.title),
        datasets: [
          {
            data: projectsWithTimeSpent.map((p) => Math.round(p.timeSpentToday / 60000)),
            backgroundColor: projectsWithTimeSpent.map((p) => p.color || '#e0e0e0'),
          },
        ],
      };
    }),
  );

  @Input('flatTasks') set flatTasksIn(tasks: Task[]) {
    this.flatTasks = tasks;
    const projectIds: string[] = unique(
      tasks.map((t) => t.projectId || 'NO_PROJECT'),
    );
    this.todaysTasksProjectIds$.next(projectIds);
  }

  trackById(i: number, item: ProjectWithTimeSpent): string {
    return item.id;
  }

  private _mapToProjectWithTasks(projectId: string, project?: Project): ProjectWithTimeSpent {
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayDayStr = getDbDateStr(yesterdayDate);

    const timeSpentToday = this.flatTasks
      .filter((task) => (task.projectId || 'NO_PROJECT') === projectId)
      .reduce((acc, task) => {
        let v: number = task.timeSpentOnDay?.[this.dayStr()] || 0;
        if (this.isShowYesterday() && this.isForToday()) {
          v = v + (task.timeSpentOnDay?.[yesterdayDayStr] || 0);
        }
        return acc + v;
      }, 0);

    return {
      id: projectId,
      project,
      title: project?.title || 'No Project',
      color: project?.theme?.primary,
      timeSpentToday,
    };
  }
}

