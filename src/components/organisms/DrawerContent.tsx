'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Divider from '@shared/m3/Divider';
import { useNavSections } from '@/hooks/useNavSections';
import { NavSection } from '../molecules/NavSection';
import { DrawerFooter } from '../molecules/DrawerFooter';
import {
  DrawerToolLinks,
} from '../molecules/DrawerToolLinks';
import navGroups from '@/constants/nav-groups.json';
import { useGuideSelector } from './guide/useGuideSelector';
import { isSimpleLink } from './guide/guidePath';
import { AdvancedToggle } from './guide/AdvancedToggle';
import type { NavLink } from './MobileDrawer';

/** Props for DrawerContent. */
export interface DrawerContentProps {
  /** Navigation links. */
  links: NavLink[];
  /** Close the drawer on link click. */
  onClose: () => void;
}

/**
 * Scrollable drawer body with grouped, collapsible nav
 * sections, tool links, and footer.
 *
 * @param props - Component props.
 */
export const DrawerContent: React.FC<
  DrawerContentProps
> = ({ links, onClose }) => {
  const t = useTranslations('nav');
  const { open, toggle } = useNavSections();
  const advanced = useGuideSelector((s) => s.guide.advanced);
  const shown = advanced
    ? links : links.filter((l) => isSimpleLink(l.href));

  const grouped = navGroups.map((g) => ({
    ...g,
    label: t(g.labelKey as Parameters<typeof t>[0]),
    links: shown
      .filter((l) => l.section === g.key)
      .map((l) => (!advanced && l.href === '/dashboard'
        ? { ...l, label: t('home') } : l)),
  })).filter((g) => g.links.length > 0);

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}
      role="menu"
    >
      <Divider />
      {grouped.map((g) => (
        <NavSection
          key={g.key}
          sectionKey={g.key}
          label={g.label}
          links={g.links}
          open={open[g.key] ?? g.defaultOpen}
          onToggle={() => toggle(g.key)}
          onClose={onClose}
        />
      ))}
      <Divider />
      <AdvancedToggle />
      <Divider />
      {advanced && (
        <>
          <DrawerToolLinks excludeUrls={['/app']} />
          <Divider />
        </>
      )}
      <DrawerFooter />
    </div>
  );
};

export default DrawerContent;
