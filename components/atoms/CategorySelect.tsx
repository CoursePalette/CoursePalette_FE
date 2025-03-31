import clsx from 'clsx';

import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export interface CategorySelectProps {
  infoText: string;
  placeholder: string;
  category: string;
  setCategory: (category: string) => void;
  labelClassName?: string;
  selectClassName?: string;
}

export default function CategorySelect({
  infoText,
  placeholder,
  category,
  setCategory,
  labelClassName,
  selectClassName,
}: CategorySelectProps) {
  return (
    <>
      <Label
        htmlFor='category'
        className={clsx('font-semibold text-[20px]', labelClassName)}
      >
        {infoText}
      </Label>
      <Select value={category} onValueChange={(value) => setCategory(value)}>
        <SelectTrigger
          id='category'
          className={clsx('w-full h-[42px]' + selectClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='혼자서'>#혼자서</SelectItem>
          <SelectItem value='가족들과'>#가족들과</SelectItem>
          <SelectItem value='데이트'>#데이트</SelectItem>
          <SelectItem value='친구들과'>#친구들과</SelectItem>
          <SelectItem value='단체로'>#단체로</SelectItem>
          <SelectItem value='신나는'>#신나는</SelectItem>
          <SelectItem value='감성있는'>#감성있는</SelectItem>
          {/* 원하는 카테고리들 추가 */}
        </SelectContent>
      </Select>
    </>
  );
}
