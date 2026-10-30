import { TestBed } from '@angular/core/testing';
import {
  DialogManageTaskTemplatesComponent,
  DialogManageTaskTemplatesData,
} from './dialog-manage-task-templates.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskTemplateService } from '../task-template.service';
import { SnackService } from '../../../../core/snack/snack.service';
import { TaskTemplate } from '../task-template.model';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';

describe('DialogManageTaskTemplatesComponent', () => {
  let component: DialogManageTaskTemplatesComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DialogManageTaskTemplatesComponent>>;
  let templateServiceSpy: jasmine.SpyObj<TaskTemplateService>;
  let snackServiceSpy: jasmine.SpyObj<SnackService>;

  const mockTemplate: TaskTemplate = {
    id: 'tpl_1',
    title: 'QA Checklist',
    description: 'Release regression testing',
    createdAt: Date.now(),
    rootTask: {
      title: 'QA Smoke Test',
      subTasks: [
        {
          title: 'Check login',
        },
      ],
    },
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    templateServiceSpy = jasmine.createSpyObj('TaskTemplateService', [
      'instantiateTemplate',
      'deleteTemplate',
    ]);
    (templateServiceSpy as unknown as { templates: unknown }).templates = signal([
      mockTemplate,
    ]);
    snackServiceSpy = jasmine.createSpyObj('SnackService', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        DialogManageTaskTemplatesComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { targetParentId: 'parent_1' } as DialogManageTaskTemplatesData,
        },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: TaskTemplateService, useValue: templateServiceSpy },
        { provide: SnackService, useValue: snackServiceSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(DialogManageTaskTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should list saved templates', () => {
    expect(component.filteredTemplates().length).toBe(1);
    expect(component.filteredTemplates()[0].title).toBe('QA Checklist');
  });

  it('should filter templates by search query', () => {
    component.searchTxt.set('Unknown');
    expect(component.filteredTemplates().length).toBe(0);

    component.searchTxt.set('smoke');
    expect(component.filteredTemplates().length).toBe(1);
  });

  it('should instantiate template and close dialog', () => {
    component.insertTemplate(mockTemplate);

    expect(templateServiceSpy.instantiateTemplate).toHaveBeenCalledWith(
      mockTemplate,
      'parent_1',
      undefined,
    );
    expect(snackServiceSpy.open).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should delete template on button click', () => {
    const mouseEvent = new MouseEvent('click');
    spyOn(mouseEvent, 'stopPropagation');

    component.deleteTemplate(mouseEvent, mockTemplate);

    expect(mouseEvent.stopPropagation).toHaveBeenCalled();
    expect(templateServiceSpy.deleteTemplate).toHaveBeenCalledWith('tpl_1');
    expect(snackServiceSpy.open).toHaveBeenCalled();
  });
});
