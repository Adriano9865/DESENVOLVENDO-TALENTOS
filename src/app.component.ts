import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';

// Models
import { UserRole, Course } from './models/course.model';
import { Student } from './models/student.model';
import { Teacher } from './models/teacher.model';
import { LibraryMaterial } from './models/library.model';
import { Announcement } from './models/announcement.model';
import { AnnouncementReadReceipt } from './models/announcement-read-receipt.model';


// Services
import { CourseService } from './services/course.service';
import { StudentService } from './services/student.service';
import { TeacherService } from './services/teacher.service';
import { LibraryService } from './services/library.service';
import { AttendanceService } from './services/attendance.service';
import { AnnouncementService } from './services/announcement.service';
import { NotificationService } from './services/notification.service';

// Components
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { StudentMenuComponent, StudentView } from './components/student-menu/student-menu.component';
import { TeacherMenuComponent, TeacherView } from './components/teacher-menu/teacher-menu.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { AddCourseModalComponent } from './components/add-course-modal/add-course-modal.component';
import { StudentLoginModalComponent } from './components/student-login-modal/student-login-modal.component';
import { TeacherLoginModalComponent } from './components/teacher-login-modal/teacher-login-modal.component';
import { TeacherStudentsViewComponent } from './components/teacher-students-view/teacher-students-view.component';
import { AddStudentModalComponent } from './components/add-student-modal/add-student-modal.component';
import { EditStudentModalComponent } from './components/edit-student-modal/edit-student-modal.component';
import { StudentProfileViewComponent } from './components/student-profile-view/student-profile-view.component';
import { StudentLibraryViewComponent } from './components/student-library-view/student-library-view.component';
import { TeacherLibraryViewComponent } from './components/teacher-library-view/teacher-library-view.component';
import { AddMaterialModalComponent } from './components/add-material-modal/add-material-modal.component';
import { EditMaterialModalComponent } from './components/edit-material-modal/edit-material-modal.component';
import { TeacherCourseManagementComponent } from './components/teacher-course-management/teacher-course-management.component';
import { StudentCourseDetailComponent } from './components/student-course-detail/student-course-detail.component';
import { EnrollStudentModalComponent } from './components/enroll-student-modal/enroll-student-modal.component';
import { StudentAttendanceViewComponent } from './components/student-attendance-view/student-attendance-view.component';
import { TeacherAttendanceViewComponent } from './components/teacher-attendance-view/teacher-attendance-view.component';
import { TeacherAnnouncementsViewComponent } from './components/teacher-announcements-view/teacher-announcements-view.component';
import { StudentAnnouncementsViewComponent } from './components/student-announcements-view/student-announcements-view.component';
import { AddAnnouncementModalComponent } from './components/add-announcement-modal/add-announcement-modal.component';
import { EditAnnouncementModalComponent } from './components/edit-announcement-modal/edit-announcement-modal.component';
import { TeacherAccessViewComponent } from './components/teacher-access-view/teacher-access-view.component';
import { AddTeacherModalComponent } from './components/add-teacher-modal/add-teacher-modal.component';


@Component({
  selector: 'app-root',
  imports: [
    LoginComponent,
    HeaderComponent,
    StudentMenuComponent,
    TeacherMenuComponent,
    CourseCardComponent,
    AddCourseModalComponent,
    StudentLoginModalComponent,
    TeacherLoginModalComponent,
    TeacherStudentsViewComponent,
    AddStudentModalComponent,
    EditStudentModalComponent,
    StudentProfileViewComponent,
    StudentLibraryViewComponent,
    TeacherLibraryViewComponent,
    AddMaterialModalComponent,
    EditMaterialModalComponent,
    TeacherCourseManagementComponent,
    StudentCourseDetailComponent,
    EnrollStudentModalComponent,
    StudentAttendanceViewComponent,
    TeacherAttendanceViewComponent,
    TeacherAnnouncementsViewComponent,
    StudentAnnouncementsViewComponent,
    AddAnnouncementModalComponent,
    EditAnnouncementModalComponent,
    TeacherAccessViewComponent,
    AddTeacherModalComponent,
  ],
  template: `
<main class="bg-slate-50 min-h-screen font-sans text-slate-800">
  @if (!currentUserRole()) {
    <app-login (login)="handleLogin($event)" />
  } @else {
    <div class="flex flex-col min-h-screen">
      <app-header 
        [currentRole]="currentUserRole()!" 
        (logout)="handleLogout()"
        (menuClick)="handleMenuClick()"
      />

      <div class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @switch (currentUserRole()) {
          @case ('student') {
            @if (studentView() === 'dashboard') {
              <app-student-menu
                layout="horizontal"
                [notificationCounts]="notificationCounts()"
                (viewChanged)="handleStudentViewChange($event)"
              />
            } @else if(studentViewingCourse()){
               <app-student-course-detail 
                [course]="studentViewingCourse()!" 
                [student]="currentStudent()!" 
                (back)="handleBackToStudentCourses()"
              />
            } @else {
              @switch (studentView()) {
                @case ('courses') {
                  <div class="animate-fade-in-up">
                    <h2 class="text-3xl font-bold tracking-tight text-slate-900 mb-6">Meus Cursos</h2>
                    @if (studentCourses().length > 0) {
                      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        @for (course of studentCourses(); track course.id; let i = $index) {
                          <app-course-card 
                            [course]="course" 
                            role="student" 
                            [isEnrolled]="true"
                            (view)="handleViewCourse($event)"
                            [priority]="i === 0" />
                        }
                      </div>
                    } @else {
                       <div class="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                         <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                         </svg>
                        <h3 class="mt-2 text-xl font-semibold text-slate-900">Você ainda não está matriculado em nenhum curso.</h3>
                        <p class="mt-1 text-sm text-slate-500">Peça ao seu professor para matriculá-lo em um curso para que ele apareça aqui.</p>
                      </div>
                    }
                  </div>
                }
                @case ('profile') {
                  <app-student-profile-view [student]="currentStudent()!" (saveStudent)="handleSaveStudent($event)" />
                }
                @case ('library') {
                  <app-student-library-view [student]="currentStudent()!" [courses]="courses()" [materials]="materials()"/>
                }
                @case ('presence') {
                  <app-student-attendance-view [student]="currentStudent()!" />
                }
                @case ('announcements') {
                  <app-student-announcements-view [student]="currentStudent()!" [courses]="courses()" />
                }
              }
            }
          }
          @case ('teacher') {
            @if (teacherView() === 'dashboard') {
              <app-teacher-menu
                layout="horizontal"
                (viewChanged)="handleTeacherViewChange($event)"
              />
            } @else {
                @switch (teacherView()) {
                  @case ('courses') {
                    @if (!courseToManage()) {
                      <div class="animate-fade-in-up">
                        <div class="flex justify-between items-center mb-6">
                          <h2 class="text-3xl font-bold tracking-tight text-slate-900">Gerenciar Cursos</h2>
                          <button (click)="isAddCourseModalOpen.set(true)" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
                            Adicionar Curso
                          </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                          @for (course of teacherCourses(); track course.id; let i = $index) {
                            <app-course-card [course]="course" role="teacher" (manage)="handleManageCourse($event)" [priority]="i === 0" />
                          }
                        </div>
                      </div>
                    } @else {
                      <app-teacher-course-management 
                        [course]="courseToManage()!"
                        (back)="handleBackToCourses()"
                        (courseUpdated)="handleCourseUpdate($event)"
                        (courseDeleted)="handleCourseDelete($event)"
                         />
                    }
                  }
                  @case ('students') {
                    <app-teacher-students-view [students]="students()" (addStudent)="isAddStudentModalOpen.set(true)" (editStudent)="handleEditStudent($event)" />
                  }
                  @case ('library') {
                    <app-teacher-library-view 
                      [materials]="materials()" 
                      [courses]="courses()" 
                      (addMaterial)="isAddMaterialModalOpen.set(true)"
                      (editMaterial)="handleEditMaterial($event)"
                      />
                  }
                   @case ('presence') {
                    <app-teacher-attendance-view [students]="students()" />
                  }
                   @case ('announcements') {
                    <app-teacher-announcements-view 
                      [courses]="teacherCourses()" 
                      (addAnnouncement)="isAddAnnouncementModalOpen.set(true)"
                      (editAnnouncement)="handleEditAnnouncement($event)"
                      />
                  }
                  @case ('access') {
                    <app-teacher-access-view 
                      [currentTeacher]="currentTeacher()!"
                      [allTeachers]="teachers()"
                      (addTeacher)="isAddTeacherModalOpen.set(true)"
                      (saveTeacher)="handleSaveTeacher($event)"
                      />
                  }
                }
            }
          }
        }
      </div>
    </div>
  }

  <!-- Modals -->
  @if (isStudentLoginModalOpen()) {
    <app-student-login-modal (close)="isStudentLoginModalOpen.set(false)" (loginSuccess)="handleStudentLoginSuccess($event)" />
  }
  @if (isTeacherLoginModalOpen()) {
    <app-teacher-login-modal (close)="isTeacherLoginModalOpen.set(false)" (loginSuccess)="handleTeacherLoginSuccess($event)" />
  }
  @if (isAddCourseModalOpen()) {
    <app-add-course-modal (close)="isAddCourseModalOpen.set(false)" (addCourse)="handleAddCourse($event)" />
  }
  @if (isAddStudentModalOpen()) {
    <app-add-student-modal (close)="isAddStudentModalOpen.set(false)" (addStudent)="handleAddStudent($event)" />
  }
  @if (isAddTeacherModalOpen()) {
    <app-add-teacher-modal (close)="isAddTeacherModalOpen.set(false)" (addTeacher)="handleAddTeacher($event)" />
  }
  @if (isEditStudentModalOpen() && studentToEdit()) {
    <app-edit-student-modal 
      [student]="studentToEdit()!" 
      [courses]="courses()"
      (close)="isEditStudentModalOpen.set(false)" 
      (saveStudent)="handleSaveStudent($event)"
      (deleteStudent)="handleDeleteStudent($event)" />
  }
  @if (isAddMaterialModalOpen()) {
    <app-add-material-modal [courses]="teacherCourses()" (close)="isAddMaterialModalOpen.set(false)" (addMaterial)="handleAddMaterial($event)" />
  }
   @if (isEditMaterialModalOpen() && materialToEdit()) {
    <app-edit-material-modal 
        [material]="materialToEdit()!"
        [courses]="teacherCourses()"
        (close)="isEditMaterialModalOpen.set(false)"
        (saveMaterial)="handleSaveMaterial($event)"
        (deleteMaterial)="handleDeleteMaterial($event)"
    />
  }
  @if (isAddAnnouncementModalOpen()) {
    <app-add-announcement-modal [courses]="teacherCourses()" (close)="isAddAnnouncementModalOpen.set(false)" (addAnnouncement)="handleAddAnnouncement($event)" />
  }
   @if (isEditAnnouncementModalOpen() && announcementToEdit()) {
    <app-edit-announcement-modal 
        [announcement]="announcementToEdit()!"
        [courses]="teacherCourses()"
        [students]="students()"
        [readReceipts]="readReceiptsForAnnouncement()"
        (close)="isEditAnnouncementModalOpen.set(false)"
        (saveAnnouncement)="handleSaveAnnouncement($event)"
        (deleteAnnouncement)="handleDeleteAnnouncement($event)"
    />
  }
  @if (isEnrollModalOpen() && studentToEnroll()) {
    <app-enroll-student-modal 
      [student]="studentToEnroll()!"
      [courses]="activeTeacherCourses()"
      (close)="isEnrollModalOpen.set(false)"
      (enroll)="handleEnrollStudentInCourses($event)"
      />
  }

  <!-- WhatsApp FAB for Students -->
  @if (currentUserRole() === 'student') {
    <a 
      href="https://api.whatsapp.com/send?phone=5511965723906" 
      target="_blank" 
      rel="noopener noreferrer"
      class="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 flex items-center justify-center animate-bounce-in"
      aria-label="Fale conosco no WhatsApp"
      title="Fale conosco no WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.433-9.89-9.889-9.89-5.452 0-9.887 4.434-9.889 9.889.001 2.225.651 4.315 1.731 6.096l-.346 1.257 1.272.355zm11.371-6.46c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
    </a>
  }
</main>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private courseService = inject(CourseService);
  private studentService = inject(StudentService);
  private teacherService = inject(TeacherService);
  private libraryService = inject(LibraryService);
  private announcementService = inject(AnnouncementService);
  private attendanceService = inject(AttendanceService); // Injected but not used directly, just to initialize it
  private notificationService = inject(NotificationService);

  // App State
  currentUserRole = signal<UserRole | null>(null);
  currentStudent = signal<Student | null>(null);
  currentTeacher = signal<Teacher | null>(null);
  
  // View State
  studentView = signal<StudentView | 'dashboard'>('dashboard');
  teacherView = signal<TeacherView | 'dashboard'>('dashboard');
  courseToManage = signal<Course | null>(null);
  studentViewingCourse = signal<Course | null>(null);
  
  // Modal State
  isStudentLoginModalOpen = signal(false);
  isTeacherLoginModalOpen = signal(false);
  isAddCourseModalOpen = signal(false);
  isAddStudentModalOpen = signal(false);
  isAddTeacherModalOpen = signal(false);
  isEditStudentModalOpen = signal(false);
  isAddMaterialModalOpen = signal(false);
  isEditMaterialModalOpen = signal(false);
  isAddAnnouncementModalOpen = signal(false);
  isEditAnnouncementModalOpen = signal(false);
  isEnrollModalOpen = signal(false);
  
  // Data
  courses = this.courseService.courses;
  students = this.studentService.students;
  teachers = this.teacherService.teachers;
  materials = this.libraryService.materials;
  announcements = this.announcementService.announcements;

  studentToEdit = signal<Student | null>(null);
  materialToEdit = signal<LibraryMaterial | null>(null);
  announcementToEdit = signal<Announcement | null>(null);
  studentToEnroll = signal<Student | null>(null);

  // Computed State
  studentCourses = computed(() => {
    const student = this.currentStudent();
    if (!student) return [];
    const enrolledIds = new Set(student.enrolledCourseIds);
    return this.courses().filter(course => enrolledIds.has(course.id));
  });

  teacherCourses = computed(() => this.courses().filter(c => c.isTeacherCourse));

  activeTeacherCourses = computed(() => this.teacherCourses().filter(c => c.status === 'active'));

  readReceiptsForAnnouncement = computed<AnnouncementReadReceipt[]>(() => {
      const ann = this.announcementToEdit();
      if (!ann) return [];
      return this.announcementService.getReceiptsForAnnouncement(ann.id);
  });
  
  // --- Notifications ---
  unreadAnnouncementsCount = computed(() => {
    const student = this.currentStudent();
    if (!student) return 0;
    
    const studentAnnouncements = this.announcementService.getAnnouncementsForStudent(student);
    const readIds = this.announcementService.getReadAnnouncementIdsForStudent(student.id);

    return studentAnnouncements.filter(a => !readIds.has(a.id)).length;
  });

  notificationCounts = computed(() => {
    const student = this.currentStudent();
    if (!student) {
        return {};
    }
    const announcementCount = this.unreadAnnouncementsCount();
    const otherCounts = this.notificationService.getUnreadCountsByView(student.id);

    return {
      ...otherCounts, // counts for courses, library, presence
      announcements: announcementCount,
    };
  });

  // --- Event Handlers ---

  // Login/Logout
  handleLogin(role: UserRole) {
    if (role === 'student') {
      this.isStudentLoginModalOpen.set(true);
    } else {
      this.isTeacherLoginModalOpen.set(true);
    }
  }

  handleStudentLoginSuccess(student: Student) {
    this.currentStudent.set(student);
    this.currentUserRole.set('student');
    this.isStudentLoginModalOpen.set(false);
  }

  handleTeacherLoginSuccess(teacher: Teacher) {
    this.currentTeacher.set(teacher);
    this.currentUserRole.set('teacher');
    this.isTeacherLoginModalOpen.set(false);
  }

  handleLogout() {
    this.currentUserRole.set(null);
    this.currentStudent.set(null);
    this.currentTeacher.set(null);
    this.studentView.set('dashboard');
    this.teacherView.set('dashboard');
    this.courseToManage.set(null);
    this.studentViewingCourse.set(null);
  }

  // View Changers
  handleMenuClick() {
    if (this.currentUserRole() === 'student') {
      this.studentView.set('dashboard');
      this.studentViewingCourse.set(null);
    } else if (this.currentUserRole() === 'teacher') {
      this.teacherView.set('dashboard');
      this.courseToManage.set(null);
    }
  }
  
  handleStudentViewChange(view: StudentView) {
    this.studentViewingCourse.set(null);
    this.studentView.set(view);
  
    const student = this.currentStudent();
    if (!student) return;
  
    // When student visits announcements, clear the notification (existing logic)
    if (view === 'announcements') {
      this.announcementService.markAllAsRead(student);
    } else if (view === 'courses' || view === 'library' || view === 'presence') {
      // New logic for other notifications
      this.notificationService.markViewAsRead(student.id, view);
    }
  }

  handleTeacherViewChange(view: TeacherView) {
    this.teacherView.set(view);
    this.courseToManage.set(null); // Reset when changing main teacher view
  }

  // Course Management (Teacher)
  handleAddCourse(courseData: Omit<Course, 'id' | 'isTeacherCourse' | 'status'>) {
    this.courseService.addCourse({ ...courseData, isTeacherCourse: true });
    this.isAddCourseModalOpen.set(false);
  }

  handleManageCourse(course: Course) {
    this.teacherView.set('courses');
    this.courseToManage.set(course);
  }
  
  handleBackToCourses() {
    this.courseToManage.set(null);
  }
  
  handleCourseUpdate(course: Course) {
    this.courseService.updateCourse(course);
  }

  handleCourseDelete(courseId: number) {
    // First, un-enroll all students from this course to maintain data integrity
    this.studentService.unenrollAllStudentsFromCourse(courseId);
    
    // Then, delete the course itself
    this.courseService.deleteCourse(courseId);
    
    this.courseToManage.set(null);
  }
  
  // Student Management (Teacher & Student)
  handleAddStudent(studentData: Omit<Student, 'id' | 'status' | 'enrolledCourseIds'>) {
    const newStudent = this.studentService.addStudent(studentData);
    this.isAddStudentModalOpen.set(false);
    this.studentToEnroll.set(newStudent);
    this.isEnrollModalOpen.set(true);
  }
  
  // Teacher Management
  handleAddTeacher(teacherData: Omit<Teacher, 'id'>) {
    this.teacherService.addTeacher(teacherData);
    this.isAddTeacherModalOpen.set(false);
  }
  
  handleSaveTeacher(teacher: Teacher) {
    this.teacherService.updateTeacher(teacher);
    if (this.currentTeacher()?.id === teacher.id) {
        this.currentTeacher.set(teacher);
    }
  }

  handleEnrollStudentInCourses(event: { studentId: number; courseIds: number[] }) {
    event.courseIds.forEach(courseId => {
      this.studentService.enrollInCourse(event.studentId, courseId);
       // Notify student
       const course = this.courses().find(c => c.id === courseId);
       if (course) {
           this.notificationService.addNotification(
               [event.studentId],
               'enrollment',
               'courses',
               `Você foi matriculado(a) no curso: ${course.title}`
           );
       }
    });
    this.isEnrollModalOpen.set(false);
    this.studentToEnroll.set(null);
  }
  
  handleEditStudent(student: Student) {
    this.studentToEdit.set(student);
    this.isEditStudentModalOpen.set(true);
  }
  
  handleSaveStudent(student: Student) {
    this.studentService.updateStudent(student);
    // Also update current student if they are the one being edited
    if (this.currentStudent()?.id === student.id) {
      this.currentStudent.set(student);
    }
    this.isEditStudentModalOpen.set(false);
    this.studentToEdit.set(null);
  }
  
  handleDeleteStudent(studentId: number) {
    this.studentService.deleteStudent(studentId);
    this.isEditStudentModalOpen.set(false);
    this.studentToEdit.set(null);
  }
  
  // Library Management (Teacher)
  handleAddMaterial(materialData: Omit<LibraryMaterial, 'id'>) {
    this.libraryService.addMaterial(materialData);
     // Notify enrolled students
     const course = this.courses().find(c => c.id === materialData.courseId);
     if (course) {
         const enrolledStudents = this.studentService.getEnrolledStudentsForCourse(materialData.courseId);
         const studentIds = enrolledStudents.map(s => s.id);
         if (studentIds.length > 0) {
             this.notificationService.addNotification(
                 studentIds,
                 'material',
                 'library',
                 `Novo material "${materialData.title}" adicionado em ${course.title}.`
             );
         }
     }
    this.isAddMaterialModalOpen.set(false);
  }

  handleEditMaterial(material: LibraryMaterial) {
    this.materialToEdit.set(material);
    this.isEditMaterialModalOpen.set(true);
  }

  handleSaveMaterial(material: LibraryMaterial) {
    this.libraryService.updateMaterial(material);
    this.isEditMaterialModalOpen.set(false);
    this.materialToEdit.set(null);
  }

  handleDeleteMaterial(materialId: number) {
    this.libraryService.deleteMaterial(materialId);
    this.isEditMaterialModalOpen.set(false);
    this.materialToEdit.set(null);
  }
  
  // Announcement Management (Teacher)
  handleAddAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdAt'>) {
      this.announcementService.addAnnouncement(announcementData);
      this.isAddAnnouncementModalOpen.set(false);
  }

  handleEditAnnouncement(announcement: Announcement) {
    this.announcementToEdit.set(announcement);
    this.isEditAnnouncementModalOpen.set(true);
  }

  handleSaveAnnouncement(announcement: Announcement) {
    this.announcementService.updateAnnouncement(announcement);
    this.isEditAnnouncementModalOpen.set(false);
    this.announcementToEdit.set(null);
  }

  handleDeleteAnnouncement(announcementId: number) {
    this.announcementService.deleteAnnouncement(announcementId);
    this.isEditAnnouncementModalOpen.set(false);
    this.announcementToEdit.set(null);
  }

  // Student Actions
  isCourseEnrolled(courseId: number): boolean {
    return this.currentStudent()?.enrolledCourseIds.includes(courseId) ?? false;
  }
  
  handleViewCourse(course: Course) {
    this.studentView.set('courses');
    this.studentViewingCourse.set(course);
  }

  handleBackToStudentCourses() {
    this.studentViewingCourse.set(null);
    this.studentView.set('courses'); // Go back to the course list, not the main menu
  }
}
