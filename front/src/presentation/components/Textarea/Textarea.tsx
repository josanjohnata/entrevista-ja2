import React from 'react';
import { StyledTextarea } from './Textarea.styles';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return <StyledTextarea ref={ref} {...props} />;
  }
);

Textarea.displayName = 'Textarea';

