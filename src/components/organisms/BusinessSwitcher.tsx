'use client';

import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Button from '@shared/m3/Button';
import Divider from '@shared/m3/Divider';
import Menu from '@shared/m3/Menu';
import MenuItem from '@shared/m3/MenuItem';
import Dialog from '@shared/m3/Dialog';
import DialogTitle from '@shared/m3/DialogTitle';
import DialogContent from '@shared/m3/DialogContent';
import DialogActions from '@shared/m3/DialogActions';
import TextField from '@shared/m3/TextField';
import { useTranslations } from 'next-intl';
import { businessError, useBusinesses } from '@/hooks/useBusinesses';
import type { Business } from '@/store/api/businessesApi';

type Mode = 'closed' | 'new' | 'manage';

/** A long name is cut with an ellipsis (the full name is the tooltip). */
const NAME_STYLE: React.CSSProperties = {
  display: 'inline-block', maxWidth: 280, overflow: 'hidden',
  textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'bottom',
};
/** The button keeps its room in the app bar instead of being squeezed. */
const SWITCHER_STYLE: React.CSSProperties = {
  flexShrink: 0, minWidth: 120, maxWidth: 'min(320px, 45vw)',
};
/** The menu never grows wider than the screen. */
const MENU_STYLE: React.CSSProperties = { maxWidth: 'min(92vw, 360px)' };
/** The list of businesses scrolls; New and Manage stay in view below it. */
const LIST_STYLE: React.CSSProperties = {
  maxHeight: '80vh', minHeight: 72, overflowY: 'auto',
  resize: 'vertical',            // the little corner triangle: drag to resize
};
const LIST_START_VH = 0.5;
const LIST_START_PX = 320;

/**
 * Start a resizable list at a comfortable height (about half the
 * screen, at most 320px, or its content if shorter). The person can
 * then drag the corner triangle to make it larger or smaller.
 */
function startHeight(
  el: HTMLElement | null, maxFraction: number, maxPx: number,
) {
  if (!el || el.style.height) return;
  const cap = Math.min(window.innerHeight * maxFraction, maxPx);
  el.style.height = `${Math.round(Math.min(el.scrollHeight, cap))}px`;
}

/** The manage dialog scrolls when there are many businesses. */
const MANAGE_LIST_STYLE: React.CSSProperties = {
  maxHeight: '75vh', minHeight: 96, overflowY: 'auto', paddingTop: 4,
  resize: 'vertical',
};

/** One row of the manage dialog: rename in place, delete with a confirm. */
const ManageRow: React.FC<{
  b: Business;
  onRename: (id: string, name: string) => Promise<unknown>;
  onDelete: (b: Business) => Promise<void>;
}> = ({ b, onRename, onDelete }) => {
  const t = useTranslations('business');
  const [name, setName] = useState(b.name);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const run = async (fn: () => Promise<unknown>) => {
    setError(null);
    try { await fn(); } catch (e) { setError(businessError(e)); }
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}
      data-testid={`business-row-${b.id}`}>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField size="small" value={name} fullWidth
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)}
          inputProps={{ 'aria-label': t('renameLabel', { name: b.name }) }} />
        <Button disabled={!name.trim() || name.trim() === b.name}
          onClick={() => void run(() => onRename(b.id, name))}>
          {t('save')}
        </Button>
        {!confirm && (
          <Button color="error" onClick={() => setConfirm(true)}>
            {t('delete')}
          </Button>
        )}
      </Box>
      {confirm && (
        <Box role="alert"
          sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <span>{t('confirmDelete', { name: b.name })}</span>
          <Button color="error" data-testid="business-delete-confirm"
            onClick={() => void run(() => onDelete(b))}>
            {t('deleteForever')}
          </Button>
          <Button onClick={() => setConfirm(false)}>{t('cancel')}</Button>
        </Box>
      )}
      {error && <span role="alert">{error}</span>}
    </Box>
  );
};

/**
 * App-bar control for people who plan more than one business: shows the
 * open business, switches between them, and creates / renames / deletes.
 */
export const BusinessSwitcher: React.FC = () => {
  const t = useTranslations('business');
  const vm = useBusinesses();
  const [el, setEl] = useState<null | HTMLElement>(null);
  const [mode, setMode] = useState<Mode>('closed');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const close = () => setEl(null);

  const submitNew = async () => {
    setError(null);
    try {
      await vm.create(name);
      setName('');
      setMode('closed');
    } catch (e) { setError(businessError(e)); }
  };

  if (vm.isLoading || !vm.active) return null;

  return (
    <>
      <Button color="inherit" data-testid="business-switcher"
        style={SWITCHER_STYLE}
        aria-haspopup="menu" aria-label={t('switcherLabel')}
        onClick={(e: React.MouseEvent<HTMLElement>) => setEl(e.currentTarget)}>
        <span title={vm.active.name} style={NAME_STYLE}>
          {vm.active.name}
        </span>
        {' ▾'}
      </Button>
      <Menu anchorEl={el} open={!!el} onClose={close}
        data-testid="business-menu" style={MENU_STYLE}>
        <div data-testid="business-list" style={LIST_STYLE}
          ref={(n) => startHeight(n, LIST_START_VH, LIST_START_PX)}>
          {vm.businesses.map((b) => (
            <MenuItem key={b.id} selected={b.id === vm.active?.id}
              data-testid={`business-option-${b.id}`}
              onClick={() => { close(); vm.open(b); }}>
              <span title={b.name} style={NAME_STYLE}>{b.name}</span>
            </MenuItem>
          ))}
        </div>
        <Divider />
        <MenuItem data-testid="business-new"
          onClick={() => { close(); setMode('new'); }}>
          {t('new')}
        </MenuItem>
        <MenuItem data-testid="business-manage"
          onClick={() => { close(); setMode('manage'); }}>
          {t('manage')}
        </MenuItem>
      </Menu>

      <Dialog open={mode === 'new'} onClose={() => setMode('closed')}
        aria-label={t('new')} data-testid="business-new-dialog">
        <DialogTitle>{t('new')}</DialogTitle>
        <DialogContent>
          <p>{t('newHelp')}</p>
          <TextField autoFocus fullWidth label={t('nameLabel')} value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' && name.trim()) void submitNew();
            }} />
          {error && <span role="alert">{error}</span>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMode('closed')}>{t('cancel')}</Button>
          <Button variant="contained" disabled={!name.trim()}
            data-testid="business-create" onClick={() => void submitNew()}>
            {t('create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={mode === 'manage'} onClose={() => setMode('closed')}
        aria-label={t('manage')} data-testid="business-manage-dialog">
        <DialogTitle>{t('manage')}</DialogTitle>
        <DialogContent>
          <div style={MANAGE_LIST_STYLE} data-testid="business-manage-list"
            ref={(n) => startHeight(n, 0.6, 520)}>
            {vm.businesses.map((b) => (
              <ManageRow key={b.id} b={b} onRename={vm.rename}
                onDelete={vm.remove} />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMode('closed')}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BusinessSwitcher;
