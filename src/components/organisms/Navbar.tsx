'use client';

import React from 'react';
import AppBar from '@shared/m3/AppBar';
import Toolbar from '@shared/m3/Toolbar';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@shared/m3/Button';
import { useKeycloak } from '@/hooks/useKeycloak';
import type { User } from '@/types/auth';
import { SkipLink } from '../molecules/SkipLink';
import { NavbarLogo } from '@shared/components/ui/NavbarLogo';
import { DesktopActions } from '../molecules/DesktopActions';
import { AvatarMenu } from './AvatarMenu';
import { MobileDrawer } from './MobileDrawer';
import {
  GamificationSummary,
} from '../molecules/GamificationSummary';
import NotificationBell
  from '../molecules/NotificationBell';
import BusinessSwitcher from './BusinessSwitcher';
import { useWhoAmIQuery } from '@/store/api/businessesApi';
import navLinks from '@/constants/nav-links.json';

/** Props for the Navbar organism. */
export interface NavbarProps {
  testId?: string;
}

/** App bar with drawer, logo, and actions. */
export const Navbar: React.FC<NavbarProps> = ({
  testId = 'navbar',
}) => {
  const {
    user: kcUser, isAuthenticated, logout,
  } = useKeycloak();
  const { data: me } = useWhoAmIQuery(
    undefined, { skip: !isAuthenticated },
  );
  const kcRoles = kcUser?.realm_access?.roles ?? [];
  const role: User['role'] =
    kcRoles.includes('admin') ? 'admin'
    : kcRoles.includes('moderator') ? 'moderator'
    : 'user';
  const user: User | null = kcUser ? {
    id: kcUser.sub,
    email: me?.email || kcUser.email || '',
    username: kcUser.preferred_username ?? '',
    displayName:
      me?.displayName
      || kcUser.name
      || kcUser.preferred_username || '',
    role,
    createdAt: '',
    updatedAt: '',
  } : null;
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const tA11y = useTranslations('a11y');

  const LINKS = navLinks.map((l) => ({
    label: tNav(l.labelKey),
    href: l.href,
    section: l.section,
  }));

  return (
    <>
      <SkipLink label={tA11y('skipToContent')} />
      <AppBar
        position="sticky"
        role="navigation"
        aria-label={tA11y('mainNav')}
        data-testid={testId}
      >
        <Toolbar>
          <MobileDrawer links={LINKS} />
          <NavbarLogo label={tCommon('appName')} />
          {isAuthenticated && <BusinessSwitcher />}
          <div className="spacer" />
          <DesktopActions />
          {isAuthenticated && <GamificationSummary compact />}
          {isAuthenticated && <NotificationBell />}
          {isAuthenticated ? (
            <AvatarMenu user={user} onLogout={logout} />
          ) : (
            <Button
              component={Link} href="/login"
              variant="text" testId="navbar-login"
              style={LOGIN_STYLE}
            >
              {tAuth('login')}
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

const LOGIN_STYLE = {
  whiteSpace: 'nowrap' as const,
  flexShrink: 0,
};

export default Navbar;
