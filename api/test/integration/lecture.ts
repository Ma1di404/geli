import * as chai from 'chai';
import {TestHelper} from '../TestHelper';
import {User} from '../../src/models/User';
import {Course} from '../../src/models/Course';
import {FixtureUtils} from '../../fixtures/FixtureUtils';
import chaiHttp = require('chai-http');
import {Lecture} from '../../src/models/Lecture';

chai.use(chaiHttp);
const should = chai.should();
const BASE_URL = '/api/lecture';
const testHelper = new TestHelper(BASE_URL);

describe('Lecture', () => {
  beforeEach(async () => {
    await testHelper.resetForNextTest();
  });

  describe(`GET ${BASE_URL}` , () => {
    it('should forbid lecture access for an unauthorized user', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await FixtureUtils.getCourseFromLecture(lecture);
      const unauthorizedUser = await User.findOne({_id: {$nin: [course.courseAdmin, ...course.teachers]}});
      const res = await testHelper.commonUserGetRequest(unauthorizedUser, `/${lecture._id}`);
      res.status.should.be.equal(403);
    });
  });

  describe(`POST ${BASE_URL}` , () => {
    it('should forbid lecture additions for an unauthorized teacher', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await FixtureUtils.getCourseFromLecture(lecture);
      const unauthorizedTeacher = await User.findOne({
        _id: {$nin: [course.courseAdmin, ...course.teachers]},
        role: 'teacher'
      });
      const res = await testHelper.commonUserPostRequest(unauthorizedTeacher, `/`, {
        lecture,
        courseId: course._id
      });
      res.status.should.be.equal(403);
    });
  });

  describe(`PUT ${BASE_URL}` , () => {
    it('should forbid lecture modifications for an unauthorized teacher', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await FixtureUtils.getCourseFromLecture(lecture);
      const unauthorizedTeacher = await User.findOne({
        _id: {$nin: [course.courseAdmin, ...course.teachers]},
        role: 'teacher'
      });
      const res = await testHelper.commonUserPutRequest(unauthorizedTeacher, `/${lecture._id}`, lecture);
      res.status.should.be.equal(403);
    });
  });

  describe(`DELETE ${BASE_URL}` , () => {
    it('should delete a lecture by course admin', async () => {
      const course = await FixtureUtils.getRandomCourseWithAllUnitTypes();
      const lectureId = await course.lectures[0];
      const courseAdmin = await User.findOne({_id: course.courseAdmin});

      const res = await testHelper.commonUserDeleteRequest(courseAdmin, `/${lectureId}`);

      res.status.should.be.equal(200);
      const courseWithDeletedLecture = await Course.findById(course._id);
      courseWithDeletedLecture.lectures[0].should.not.be.equal(lectureId);
      const deletedLecture = await Lecture.findById(lectureId);
      should.not.exist(deletedLecture, 'Lecture still exists');
    });

    it('should forbid lecture deletions for an unauthorized teacher', async () => {
      const lecture = await FixtureUtils.getRandomLecture();
      const course = await FixtureUtils.getCourseFromLecture(lecture);
      const unauthorizedTeacher = await User.findOne({
        _id: {$nin: [course.courseAdmin, ...course.teachers]},
        role: 'teacher'
      });
      const res = await testHelper.commonUserDeleteRequest(unauthorizedTeacher, `/${lecture._id}`);
      res.status.should.be.equal(403);
    });
  });

});
