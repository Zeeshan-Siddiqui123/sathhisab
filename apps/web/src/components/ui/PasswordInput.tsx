import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from './Input';
import { IconButton } from './IconButton';
import { uiStrings } from '@/lib/uiStrings';

/** Password field with a keyboard-accessible visibility toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      ref={ref}
      autoComplete='current-password'
      {...props}
      type={visible ? 'text' : 'password'}
      endContent={
        <IconButton
          aria-label={visible ? uiStrings.hidePassword : uiStrings.showPassword}
          aria-pressed={visible}
          onPress={() => setVisible(!visible)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </IconButton>
      }
    />
  );
});