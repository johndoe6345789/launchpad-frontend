'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/store/hooks';
import { useGuideSelector } from './useGuideSelector';
import { setAdvanced } from '@/store/slices/guideSlice';

/** Switch between the simple menu and every tool. */
export const AdvancedToggle: React.FC = () => {
  const t = useTranslations('guide');
  const dispatch = useAppDispatch();
  const advanced = useGuideSelector((s) => s.guide.advanced);
  return (
    <label data-testid="advanced-toggle" style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '12px 16px', cursor: 'pointer',
    }}>
      <input type="checkbox" checked={advanced}
        onChange={(e) => dispatch(setAdvanced(e.target.checked))}
        style={{ width: 18, height: 18, marginTop: 2,
          accentColor: '#8000ff' }} />
      <span>
        <strong style={{ display: 'block', fontSize: 14 }}>
          {t('advancedLabel')}
        </strong>
        <span style={{ fontSize: 12, opacity: 0.75 }}>
          {t('advancedHint')}
        </span>
      </span>
    </label>
  );
};

export default AdvancedToggle;
