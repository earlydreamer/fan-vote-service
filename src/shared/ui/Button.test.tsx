import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders primary variant by default with base button classes', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button-primary');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button-secondary');
  });

  it('renders unstyled variant without default button classes', () => {
    render(<Button variant="unstyled" className="custom-class">Unstyled Button</Button>);
    const button = screen.getByRole('button', { name: /unstyled button/i });
    expect(button).not.toHaveClass('button');
    expect(button).not.toHaveClass('button-primary');
    expect(button).not.toHaveClass('button-secondary');
    expect(button).toHaveClass('custom-class');
  });

  it('supports custom className merging with existing classes', () => {
    render(<Button variant="primary" className="my-custom-btn">Merged Button</Button>);
    const button = screen.getByRole('button', { name: /merged button/i });
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button-primary');
    expect(button).toHaveClass('my-custom-btn');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const button = screen.getByRole('button', { name: /clickable/i });
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click event when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('accepts type attribute overrides', () => {
    render(<Button type="submit">Submit Button</Button>);
    const button = screen.getByRole('button', { name: /submit button/i });
    expect(button).toHaveAttribute('type', 'submit');
  });
});
