import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-placeholder-view',
  template: `
    <div class="flex flex-col items-center justify-center text-center bg-white p-12 rounded-lg shadow-md mt-10 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-2xl font-semibold text-slate-800">{{ title() }}</h2>
      <p class="text-slate-500 mt-2 max-w-md">Em breve! {{ message() }}</p>
    </div>
    <style>
      .animate-fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderViewComponent {
  title = input.required<string>();
  message = input.required<string>();
}
