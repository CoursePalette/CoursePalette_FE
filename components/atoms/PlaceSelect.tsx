/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCreateCourseStore } from '@/store/course/useCreateCourseStore';
import { Place, PlaceResponseKakao } from '@/types/Place';
import clsx from 'clsx';

import { useState } from 'react';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PlaceSelecProps {
  className?: string;
}

export default function PlaceSelect({ className }: PlaceSelecProps) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<PlaceResponseKakao[]>([]);

  const addPlace = useCreateCourseStore((state) => state.addPlace);
  const places = useCreateCourseStore((state) => state.places);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    if (!window.kakao || !window.kakao.maps) {
      return;
    }

    window.kakao.maps.load(() => {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(keyword, (data: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setResults(data);
        } else {
          setResults([]);
        }
      });
    });
  };

  const handleSelectPlace = (place: PlaceResponseKakao) => {
    const alreadyExists = places.some((p) => p.id === place.id);
    if (alreadyExists) {
      alert('이미 추가된 장소입니다.');
      return;
    }

    const newPlace: Place = {
      id: place.id,
      place_name: place.place_name,
      address_name: place.address_name,
      place_url: place.place_url,
      longitude: place.x,
      latitude: place.y,
    };

    addPlace(newPlace);
  };

  return (
    <div className={clsx('w-full flex flex-col gap-[5px]', className)}>
      <h1 className='font-semibold text-[20px]'>장소를 선택해주세요.</h1>
      <p className='text-[12px] font-normal text-[#707070]'>
        2개 이상 10개 이하로 선택해주세요.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={
              'w-full h-[42px] rounded-md border border-input bg-transparent px-3 py-1 shadow-sm flex items-center'
            }
          >
            <p className='text-sm text-muted-foreground'>장소를 검색하세요.</p>
          </div>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogTitle>장소 검색</DialogTitle>
          <DialogDescription>
            키워드를 입력해서 원하는 장소를 검색하세요.
          </DialogDescription>
          <div className='flex gap-2 mt-4'>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder='검색어를 입력해주세요. ex)양재역 햄버거'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Button
              onClick={handleSearch}
              className='bg-[#0064FF]/80 hover:bg-[#0064FF]'
            >
              검색
            </Button>
          </div>
          <div className='mt-4 max-h-60 overflow-y-auto'>
            {results.length > 0 ? (
              results.map((result) => (
                <DialogClose asChild key={result.id}>
                  <div
                    className='p-2 border-b hover:bg-gray-100 cursor-pointer'
                    onClick={() => handleSelectPlace(result)}
                  >
                    <p className='font-bold'>{result.place_name}</p>
                    <p className='text-sm'>{result.address_name}</p>
                  </div>
                </DialogClose>
              ))
            ) : (
              <p className='text-sm text-gray-500'>검색 결과가 없습니다.</p>
            )}
          </div>
          <DialogClose asChild>
            <Button className='bg-[#0064FF]/80 hover:bg-[#0064FF] mt-4'>
              닫기
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
