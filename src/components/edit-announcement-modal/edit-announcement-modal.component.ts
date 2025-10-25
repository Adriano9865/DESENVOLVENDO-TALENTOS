// FIX: The original file content was invalid. This is a complete, functional implementation of the EditAnnouncementModalComponent.
import { Component, ChangeDetectionStrategy, input, output, signal, effect, computed } from '@angular/core';
import { Course } from '../../models/course.model';
import { Announcement } from '../../models/announcement.model';
import { Student } from '../../models/student.model';
import { AnnouncementReadReceipt } from '../../models/announcement-read-receipt.model';

@Component({
  selector: 'app-edit-announcement-modal',
  template: `
<div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in" (click)="closeModal()">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl relative animate-fade-in-up max-h-[90vh] flex flex-col" (click)="$event.stopPropagation()">
    <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-2xl font-bold text-slate-800">Editar Aviso</h2>
        <button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
    </div>

    <div class="flex-grow overflow-y-auto p-6 space-y-4">
        <form (submit)="onSave(); $event.preventDefault()" id="edit-announcement-form" class="space-y-4">
            <div>
                <label for="announcement-title" class="block text-sm font-medium text-slate-700">Título</label>
                <input id="announcement-title" type="text" [value]="title()" (input)="updateField('title', $event)" class="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm" required>
            </div>
            <div>
                <label for="announcement-content" class="block text-sm font-medium text-slate-700">Conteúdo</label>
                <textarea id="announcement-content" [value]="content()" (input)="updateField('content', $event)" rows="6" class="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 text-slate-900 rounded-lg shadow-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm" required></textarea>
            </div>
            <div>
                <label for="announcement-course" class="block text-sm font-medium text-slate-700">Enviar para</label>
                <select id="announcement-course" [value]="courseId()" (change)="updateCourseId($event)" class="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-slate-100 border border-slate-300 text-slate-900 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm">
                    <option value="all">Todos os Alunos</option>
                    @for (course of courses(); track course.id) {
                        <option [value]="course.id">{{ course.title }}</option>
                    }
                </select>
            </div>
        </form>

        <div>
            <h3 class="text-lg font-medium text-slate-800 mb-2">Visualizado por ({{ readByInfo().length }})</h3>
            @if (readByInfo().length > 0) {
                <div class="max-h-40 overflow-y-auto bg-slate-50 p-3 rounded-lg border">
                    <ul class="space-y-2">
                        @for (info of readByInfo(); track info.studentName + info.readAt) {
                            <li class="text-sm text-slate-700 flex justify-between items-center">
                                <span>{{ info.studentName }}</span>
                                <span class="text-xs text-slate-500">{{ formatReadAt(info.readAt) }}</span>
                            </li>
                        }
                    </ul>
                </div>
            } @else {
                <p class="text-sm text-slate-500">Nenhum aluno visualizou este aviso ainda.</p>
            }
        </div>
    </div>

    <div class="flex justify-between items-center p-6 border-t bg-slate-50 rounded-b-lg">
        @if (!isDeleteConfirmVisible()) {
            <button (click)="isDeleteConfirmVisible.set(true)" type="button" class="text-red-600 hover:text-red-800 font-medium text-sm">
                Excluir Aviso
            </button>
        } @else {
            <div class="flex items-center gap-4">
                <span class="text-sm font-medium text-slate-700">Tem certeza?</span>
                <button (click)="onDelete()" type="button" class="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 text-sm">Sim, excluir</button>
                <button (click)="isDeleteConfirmVisible.set(false)" type="button" class="text-slate-600 hover:text-slate-800 font-medium text-sm">Cancelar</button>
            </div>
        }
        <div>
            <button (click)="closeModal()" type="button" class="mr-3 bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelar</button>
            <button type="submit" form="edit-announcement-form" class="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Salvar Alterações</button>
        </div>
    </div>
  </div>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAnnouncementModalComponent {
  announcement = input.required<Announcement>();
  courses = input.required<Course[]>();
  students = input.required<Student[]>();
  readReceipts = input.required<AnnouncementReadReceipt[]>();

  close = output<void>();
  saveAnnouncement = output<Announcement>();
  deleteAnnouncement = output<number>();

  // Form state
  title = signal('');
  content = signal('');
  courseId = signal<number | 'all'>('all');
  isDeleteConfirmVisible = signal(false);

  constructor() {
    effect(() => {
      const a = this.announcement();
      if (a) {
        this.title.set(a.title);
        this.content.set(a.content);
        this.courseId.set(a.courseId);
        this.isDeleteConfirmVisible.set(false);
      }
    });
  }

  readByInfo = computed(() => {
    // FIX: Explicitly specify generic types for the Map to resolve a type inference issue.
    const studentMap = new Map<number, Student>(this.students().map(s => [s.id, s]));
    return this.readReceipts()
      .map(receipt => {
        const student = studentMap.get(receipt.studentId);
        return {
          studentName: student ? student.fullName : 'Aluno desconhecido',
          readAt: receipt.readAt
        };
      })
      .sort((a, b) => new Date(b.readAt).getTime() - new Date(a.readAt).getTime());
  });

  updateField(field: 'title' | 'content', event: Event) {
    const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (field === 'title') {
      this.title.set(value);
    } else {
      this.content.set(value);
    }
  }

  updateCourseId(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.courseId.set(value === 'all' ? 'all' : parseInt(value, 10));
  }

  onSave() {
    if (this.title().trim() && this.content().trim()) {
      this.saveAnnouncement.emit({
        ...this.announcement(),
        title: this.title(),
        content: this.content(),
        courseId: this.courseId(),
      });
    }
  }

  onDelete() {
    this.deleteAnnouncement.emit(this.announcement().id);
  }

  closeModal() {
    this.isDeleteConfirmVisible.set(false);
    this.close.emit();
  }

  formatReadAt(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
