import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '@app/services/theme.service';
import { Log } from '@angular/core/testing/src/logger';
import { Router } from '@angular/router';
import { Logger } from '@app/core/logger.service';
import { CredentialsService } from '@app/core/authentication/credentials.service';
import { AuthenticationService } from '@app/core/authentication/authentication.service';

const log = new Logger('Sidebar');

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() sidebarVisible = true;
  @Input() navTab = 'menu';
  @Input() currentActiveMenu: any;
  @Input() currentActiveSubMenu: any;
  @Output() changeNavTabEvent = new EventEmitter();
  @Output() activeInactiveMenuEvent = new EventEmitter();
  public themeClass = 'theme-cyan';
  public loggedInUser: string;

  constructor(
    private themeService: ThemeService,
    private credentialsService: CredentialsService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.themeService.themeClassChange.subscribe(themeClass => {
      this.themeClass = themeClass;
    });
  }

  ngOnInit() {
    //this.loggedInUser = 'MgbakoCentric';
    //this.activeInactiveMenuEvent.emit({ item: 'home' });
  }

  changeNavTab(tab: string) {
    this.navTab = tab;
  }

  activeInactiveMenu(menuItem: string) {
    this.activeInactiveMenuEvent.emit({ item: menuItem });
  }

  changeTheme(theme: string) {
    this.themeService.themeChange(theme);
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }
}
