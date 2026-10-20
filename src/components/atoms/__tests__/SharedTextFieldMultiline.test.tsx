import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextField from '@shared/m3/TextField';

describe('shared TextField (multiline)', () => {
  it('reports blur, focus and key presses like the single-line one', () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();
    const onKeyDown = jest.fn();
    render(
      <TextField multiline label="Notes" value="x"
        onChange={() => undefined} onBlur={onBlur}
        onFocus={onFocus} onKeyDown={onKeyDown} />,
    );
    const box = screen.getByLabelText('Notes');
    fireEvent.focus(box);
    fireEvent.keyDown(box, { key: 'a' });
    fireEvent.blur(box);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });
});
