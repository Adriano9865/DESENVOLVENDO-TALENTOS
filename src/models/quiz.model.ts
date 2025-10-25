export type QuestionType = 'multiple-choice' | 'text-answer' | 'essay';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswerIndex?: number;
  points: number;
}

export interface Quiz {
  id: number;
  courseId: number;
  title: string;
  questions: Question[];
  status: 'active' | 'inactive';
}

export interface StudentAnswer {
  questionId: number;
  answer: number | string | null; // index for multiple-choice, string for text
  isCorrect?: boolean; // for auto-graded questions
  score: number; // score given for this answer
}

export interface QuizAttempt {
  studentId: number;
  quizId: number;
  score: number; // Final score in percentage
  answers: StudentAnswer[];
  isGraded: boolean; // true if all manual grading is done
}