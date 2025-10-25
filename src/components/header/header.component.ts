import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { UserRole } from '../../models/course.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  currentRole = input.required<UserRole>();
  logout = output<void>();
  menuClick = output<void>();

  onLogout() {
    this.logout.emit();
  }

  onMenuClick() {
    this.menuClick.emit();
  }
}
