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
        aria-haspopup="menu" aria-label={t('switcherLabel')}
        onClick={(e: React.MouseEvent<HTMLElement>) => setEl(e.currentTarget)}>
        {vm.active.name} ▾
      </Button>
      <Menu anchorEl={el} open={!!el} onClose={close}
        data-testid="business-menu">
        {vm.businesses.map((b) => (
          <MenuItem key={b.id} selected={b.id === vm.active?.id}
            data-testid={`business-option-${b.id}`}
            onClick={() => { close(); vm.open(b); }}>
            {b.name}
          </MenuItem>
        ))}
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
          {vm.businesses.map((b) => (
            <ManageRow key={b.id} b={b} onRename={vm.rename}
              onDelete={vm.remove} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMode('closed')}>{t('close')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BusinessSwitcher;
