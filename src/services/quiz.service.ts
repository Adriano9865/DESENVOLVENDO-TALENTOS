import { Injectable, signal } from '@angular/core';
import { Quiz, Question, QuizAttempt, StudentAnswer } from '../models/quiz.model';

const MOCK_QUESTIONS: Question[] = [
  { id: 1, text: 'O que são componentes no Angular?', type: 'multiple-choice', options: ['Blocos de construção da UI', 'Serviços de dados', 'Módulos de roteamento', 'Pipes de formatação'], correctAnswerIndex: 0, points: 10 },
  { id: 2, text: 'Explique o conceito de data binding em uma frase.', type: 'text-answer', points: 15 },
  { id: 3, text: 'Qual diretiva é usada para renderização condicional?', type: 'multiple-choice', options: ['*ngFor', '*ngIf', '[ngClass]', '(click)'], correctAnswerIndex: 1, points: 10 },
  { id: 4, text: 'Para que servem os Signals?', type: 'multiple-choice', options: ['Gerenciamento de estado reativo', 'Animações complexas', 'Comunicação com o backend', 'Estilização de componentes'], correctAnswerIndex: 0, points: 20 },
  { id: 5, text: 'Qual a principal vantagem de usar Signals em vez de RxJS/Observables para estado local?', type: 'text-answer', points: 20 },
  { id: 6, text: 'Qual comando da CLI do Node.js inicializa um novo projeto?', type: 'multiple-choice', options: ['npm start', 'node init', 'npm init', 'ng new'], correctAnswerIndex: 2, points: 10 },
];

const MOCK_QUIZZES: Quiz[] = [
  { id: 1, courseId: 1, title: 'Prova 1: Fundamentos de Angular', questions: [MOCK_QUESTIONS[0], MOCK_QUESTIONS[1], MOCK_QUESTIONS[2]], status: 'active' },
  { id: 2, courseId: 3, title: 'Avaliação sobre Signals', questions: [MOCK_QUESTIONS[3], MOCK_QUESTIONS[4]], status: 'active' },
  { id: 3, courseId: 6, title: 'Teste Rápido: Node.js', questions: [MOCK_QUESTIONS[5]], status: 'active' },
];

const MOCK_ATTEMPTS: QuizAttempt[] = [
  {
    studentId: 1,
    quizId: 1,
    score: 67,
    answers: [
      { questionId: 1, answer: 0, isCorrect: true, score: 10 },
      { questionId: 2, answer: 'É a sincronização de dados entre o model e a view.', isCorrect: undefined, score: 10 }, 
      { questionId: 3, answer: 2, isCorrect: false, score: 0 },
    ],
    isGraded: false,
  },
  {
    studentId: 2,
    quizId: 1,
    score: 93,
    answers: [
      { questionId: 1, answer: 0, isCorrect: true, score: 10 },
      { questionId: 2, answer: 'Data binding é a forma como o Angular conecta a lógica do componente com o template, permitindo que as alterações em um lado reflitam no outro automaticamente.', isCorrect: undefined, score: 15 },
      { questionId: 3, answer: 1, isCorrect: true, score: 10 },
    ],
    isGraded: true,
  },
  {
    studentId: 2,
    quizId: 2,
    score: 50,
    answers: [
      { questionId: 4, answer: 0, isCorrect: true, score: 20 },
      { questionId: 5, answer: 'Simplicidade e melhor performance para casos de uso síncronos.', isCorrect: undefined, score: 0 },
    ],
    isGraded: true,
  },
];


@Injectable({ providedIn: 'root' })
export class QuizService {
  private _quizzes = signal<Quiz[]>(MOCK_QUIZZES);
  private _attempts = signal<QuizAttempt[]>(MOCK_ATTEMPTS);

  public readonly quizzes = this._quizzes.asReadonly();
  public readonly attempts = this._attempts.asReadonly();

  getQuizzesForCourse(courseId: number): Quiz[] {
    return this._quizzes().filter(quiz => quiz.courseId === courseId);
  }
  
  getAttemptsForStudent(studentId: number): QuizAttempt[] {
    return this._attempts().filter(attempt => attempt.studentId === studentId);
  }

  getAttemptsForQuiz(quizId: number): QuizAttempt[] {
    return this._attempts().filter(attempt => attempt.quizId === quizId);
  }

  addQuiz(quiz: Omit<Quiz, 'id' | 'status'>): Quiz {
    const newQuiz: Quiz = {
      ...quiz,
      id: this._quizzes().length > 0 ? Math.max(...this._quizzes().map(q => q.id)) + 1 : 1,
      status: 'active',
    };
    this._quizzes.update(quizzes => [...quizzes, newQuiz]);
    return newQuiz;
  }

  updateQuiz(updatedQuiz: Quiz) {
    this._quizzes.update(quizzes =>
      quizzes.map(q => (q.id === updatedQuiz.id ? updatedQuiz : q))
    );
  }
  
  toggleQuizStatus(quizId: number) {
    this._quizzes.update(quizzes => 
        quizzes.map(quiz => 
            quiz.id === quizId 
            ? { ...quiz, status: quiz.status === 'active' ? 'inactive' : 'active' }
            : quiz
        )
    );
  }

  deleteQuiz(quizId: number) {
    this._quizzes.update(quizzes => quizzes.filter(q => q.id !== quizId));
    this._attempts.update(attempts => attempts.filter(a => a.quizId !== quizId));
  }
  
  deleteAttempt(studentId: number, quizId: number) {
      this._attempts.update(attempts => attempts.filter(a => !(a.studentId === studentId && a.quizId === quizId)));
  }

  submitStudentAttempt(studentId: number, quizId: number, answers: StudentAnswer[]) {
    const quiz = this._quizzes().find(q => q.id === quizId);
    if (!quiz) return;

    let totalScore = 0;
    let autoGradablePoints = 0;
    let needsManualGrading = false;

    const gradedAnswers = answers.map(studentAnswer => {
        const question = quiz.questions.find(q => q.id === studentAnswer.questionId);
        if (!question) return studentAnswer;

        let isCorrect: boolean | undefined = undefined;
        let score = 0;

        if (question.type === 'multiple-choice') {
            autoGradablePoints += question.points;
            isCorrect = studentAnswer.answer === question.correctAnswerIndex;
            if (isCorrect) {
                score = question.points;
            }
        } else {
            needsManualGrading = true;
        }
        
        totalScore += score;
        return { ...studentAnswer, isCorrect, score };
    });
    
    const finalPercentage = autoGradablePoints > 0 ? Math.round((totalScore / autoGradablePoints) * 100) : 0;
    
    const newAttempt: QuizAttempt = {
        studentId,
        quizId,
        score: finalPercentage,
        answers: gradedAnswers,
        isGraded: !needsManualGrading,
    };
    
    this._attempts.update(attempts => {
        const existingAttemptIndex = attempts.findIndex(a => a.studentId === studentId && a.quizId === quizId);
        if(existingAttemptIndex > -1) {
            const newAttempts = [...attempts];
            newAttempts[existingAttemptIndex] = newAttempt;
            return newAttempts;
        }
        return [...attempts, newAttempt];
    });
  }

  updateAttempt(updatedAttempt: QuizAttempt) {
    this._attempts.update(attempts => {
        const index = attempts.findIndex(a => a.studentId === updatedAttempt.studentId && a.quizId === updatedAttempt.quizId);
        if (index > -1) {
            const newAttempts = [...attempts];
            newAttempts[index] = updatedAttempt;
            return newAttempts;
        }
        return attempts;
    });
  }
}