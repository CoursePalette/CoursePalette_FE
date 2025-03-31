"use client";

import { PlaceWithSequence } from '@/types/Place';
import { motion, Reorder } from 'motion/react';
import DeleteButton from '../atoms/DeleteButton';


export interface PlacesManageProps {
  places: PlaceWithSequence[];
  reorderPlaces: (newOrder: PlaceWithSequence[]) => void;
  removePlace: (id: string) => void;
}

export default function PlacesManage({ places, reorderPlaces, removePlace }: PlacesManageProps) {

  return (
    <div className="mt-[10px]">
      <p className="text-[12px] font-normal text-[#707070] mb-2">드래그로 장소의 순서를 지정해주세요.</p>

      <motion.ul
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2"
      >
        <Reorder.Group
          axis="y"
          values={places}
          onReorder={(newOrder) => reorderPlaces(newOrder)}
          className="flex flex-col gap-2"
        >
          {places.map((place, index) => (
            <Reorder.Item
              key={place.id}
              value={place}
              as="li"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between items-center border p-[10px] rounded hover:bg-gray-50 cursor-grab"
            >
              <div className='flex flex-col'>
              <p className="font-semibold">
                #{place.sequence} {place.place_name}
              </p>
              <p className="text-sm text-gray-600">{place.address_name}</p>
              </div>
             
              <DeleteButton onClick={() => removePlace(place.id)} />
              
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </motion.ul>
    </div>
  );
}