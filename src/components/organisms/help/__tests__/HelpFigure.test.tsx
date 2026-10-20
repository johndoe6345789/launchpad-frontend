import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelpFigure } from '../HelpFigure';

const spec = {
  id: 'kpi', slug: 'plan-tools', afterSection: 3,
  src: 'kpi.png', width: 1280, height: 720,
};

describe('HelpFigure', () => {
  it('shows the picture, caption and numbered legend', () => {
    render(<HelpFigure spec={spec} alt="A scorecard"
      caption="The scorecard." legend={['Title', 'Add Metric']} />);
    expect(screen.getByAltText('A scorecard')).toBeTruthy();
    expect(screen.getByText('The scorecard.')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('omits the list for pictures without call-outs', () => {
    render(<HelpFigure spec={spec} alt="A flow"
      caption="A flow." legend={[]} />);
    expect(screen.queryByRole('list')).toBeNull();
  });
});
