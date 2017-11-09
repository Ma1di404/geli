import {Component, Input, OnInit} from '@angular/core';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SortUtil} from '../../../shared/utils/SortUtil';
import {User} from '../../../models/User';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
})
export class TeachersComponent implements OnInit {

  @Input() courseId;
  course: ICourse;
  foundTeachers: IUser[] = [];

  constructor(private courseService: CourseService,
              private userService: UserDataService,
              private showProgress: ShowProgressService) {
  }

  ngOnInit() {
    this.initCourseTeachersOnInit();
  }

  /**
   * Get this course from api and filter all teachers from users.
   */
  initCourseTeachersOnInit = () => {
    this.courseService.readSingleItem(this.courseId).then(
      (val: any) => {
        this.course = val;
        this.course.teachers.forEach(member =>
          this.foundTeachers = this.foundTeachers.filter(user => user._id !== member._id));
        this.course.teachers = this.course.teachers.map(data => new User(data));

        SortUtil.sortUsers(this.foundTeachers);
        SortUtil.sortUsers(this.course.teachers);
      });
  };

  /**
   * Save all teachers in this course in database.
   */
  updateCourseTeachers(): void {
    this.showProgress.toggleLoadingGlobal(true);

    this.courseService.updateItem({
      '_id': this.course._id,
      'teachers': this.course.teachers.map((user) => user._id)
    })
    .then(() => {
      this.showProgress.toggleLoadingGlobal(false);
    });
  }

  /**
   * @param id Id of an user.
   */
  removeUser(id: string): void {
    this.foundTeachers = this.foundTeachers.concat(this.course.teachers.filter(obj => id === obj._id));
    this.course.teachers = this.course.teachers.filter(obj => id !== obj._id);
    this.updateCourseTeachers();
  }
}
