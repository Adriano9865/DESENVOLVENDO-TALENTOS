import { Injectable, signal } from '@angular/core';
import { LibraryMaterial } from '../models/library.model';

const MOCK_MATERIALS: LibraryMaterial[] = [
  { id: 1, courseId: 1, title: 'Setup do Ambiente Angular', type: 'PDF', url: '#' },
  { id: 2, courseId: 1, title: 'Vídeo: Componentes e Templates', type: 'Vídeo', url: '#' },
  { id: 3, courseId: 2, title: 'Documentação Oficial do Tailwind', type: 'Link', url: '#' },
  { id: 4, courseId: 3, title: 'Artigo: Reatividade com Signals', type: 'Link', url: '#' },
  { id: 5, courseId: 4, title: 'E-book: Princípios do Design', type: 'PDF', url: '#' },
  { id: 6, courseId: 1, title: 'Guia de Estilo do Projeto', type: 'PDF', url: '#' },
  { id: 7, courseId: 3, title: 'Vídeo: Signals vs. RxJS', type: 'Vídeo', url: '#' },
  { id: 8, courseId: 6, title: 'Repositório: Exemplo de API Node.js', type: 'Link', url: '#' },
];

@Injectable({ providedIn: 'root' })
export class LibraryService {
  private _materials = signal<LibraryMaterial[]>(MOCK_MATERIALS);
  public readonly materials = this._materials.asReadonly();

  addMaterial(material: Omit<LibraryMaterial, 'id'>) {
    const newMaterial: LibraryMaterial = {
      ...material,
      id: this._materials().length > 0 ? Math.max(...this._materials().map(m => m.id)) + 1 : 1,
    };
    this._materials.update(materials => [...materials, newMaterial]);
  }

  updateMaterial(updatedMaterial: LibraryMaterial) {
    this._materials.update(materials =>
      materials.map(m => (m.id === updatedMaterial.id ? updatedMaterial : m))
    );
  }

  deleteMaterial(materialId: number) {
    this._materials.update(materials => materials.filter(m => m.id !== materialId));
  }
}
