import clsx from 'clsx';

import { Input } from '../ui/input';
import { Label } from '../ui/label';

export interface TextInputProps {
  infoText: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  labelClassName?: string;
  inputClassName?: string;
}

export default function TextInput({
  infoText,
  placeholder,
  value,
  setValue,
  labelClassName,
  inputClassName,
}: TextInputProps) {
  return (
    <>
      <Label
        htmlFor='text'
        className={clsx('font-semibold text-[20px]', labelClassName)}
      >
        {infoText}
      </Label>
      <Input
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={clsx('w-full h-[42px]', inputClassName)}
        tabIndex={0}
      />
    </>
  );
}
