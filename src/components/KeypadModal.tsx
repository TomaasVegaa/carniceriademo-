import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';

interface KeypadModalProps {
  title: string;
  unit: string;
  onConfirm: (value: number) => void;
  onCancel: () => void;
}

export function KeypadModal({ title, unit, onConfirm, onCancel }: KeypadModalProps) {
  const [value, setValue] = useState('');

  const handlePress = (key: string) => {
    if (key === 'C') {
      setValue('');
    } else if (key === 'DEL') {
      setValue((prev) => prev.slice(0, -1));
    } else if (key === '.') {
      if (!value.includes('.')) {
        setValue((prev) => prev + (prev === '' ? '0.' : '.'));
      }
    } else {
      // Prevent too many decimals
      if (value.includes('.') && value.split('.')[1].length >= 3) return;
      // Prevent too many digits
      if (value.length >= 7) return;
      setValue((prev) => prev + key);
    }
  };

  const handleConfirm = () => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      onConfirm(num);
    }
  };

  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['C', '0', '.'],
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="bg-[#8B4513] text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 bg-[#FDFBF7] flex flex-col items-center border-b border-[#D7CCC8]">
          <div className="text-sm text-[#5D4037] font-medium mb-1 uppercase tracking-wider">Cantidad</div>
          <div className="flex items-end justify-center gap-2">
            <span className="text-5xl font-bold text-[#3C2A21]">
              {value || '0'}
            </span>
            <span className="text-2xl text-[#5D4037] mb-1 font-semibold">{unit}</span>
          </div>
        </div>

        <div className="p-4 grid grid-cols-3 gap-3 bg-white">
          {keys.flat().map((key) => (
            <button
              key={key}
              onClick={() => handlePress(key)}
              className="h-16 text-2xl font-semibold bg-[#EFEBE9] hover:bg-[#D7CCC8] active:bg-[#C9BBB6] text-[#3C2A21] rounded-xl transition-colors select-none"
            >
              {key}
            </button>
          ))}
          <button
             onClick={() => handlePress('DEL')}
             className="h-16 flex items-center justify-center bg-[#EFEBE9] hover:bg-[#D7CCC8] active:bg-[#C9BBB6] text-[#3C2A21] rounded-xl transition-colors select-none col-span-3"
          >
            <Delete size={28} />
          </button>
        </div>

        <div className="p-4 bg-[#FDFBF7] border-t border-[#D7CCC8]">
          <button
            onClick={handleConfirm}
            disabled={!value || parseFloat(value) <= 0}
            className="w-full py-4 text-xl font-bold text-white bg-[#4F7942] hover:brightness-110 disabled:bg-[#A3B89E] disabled:text-white/70 rounded-xl transition-colors shadow-sm uppercase border-b-4 border-[#2D4226] disabled:border-[#8FA38B]"
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );
}
