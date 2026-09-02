import React, { useState } from 'react';
import { X, Delete, Plus } from 'lucide-react';

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
      // Máximo 3 decimales
      if (value.includes('.') && value.split('.')[1].length >= 3) return;
      // Máximo 6 caracteres
      if (value.length >= 6) return;
      setValue((prev) => prev + key);
    }
  };

  const handlePreset = (presetVal: number) => {
    setValue(presetVal.toString());
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
    ['C', '0', '.']
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[#FDFBF7] rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border-t-2 sm:border-2 border-[#D7CCC8] max-h-[95dvh]">
        {/* Modal Header */}
        <div className="bg-[#8B4513] text-white px-5 py-3.5 flex justify-between items-center shrink-0">
          <h3 className="text-base sm:text-lg font-bold truncate pr-2">{title}</h3>
          <button 
            onClick={onCancel} 
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-white flex flex-col items-center border-b border-[#EFEBE9] shrink-0">
          <span className="text-xs text-[#5D4037] font-bold uppercase tracking-wider mb-1">
            Cantidad a Despachar
          </span>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl sm:text-5xl font-black text-[#3C2A21] tracking-tight">
              {value || '0'}
            </span>
            <span className="text-xl sm:text-2xl text-[#8B4513] font-bold">{unit}</span>
          </div>
        </div>

        {/* Quick Presets for Speed */}
        <div className="px-4 py-2 bg-[#EFEBE9] flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {unit === 'kg' ? (
            <>
              {[0.25, 0.5, 0.75, 1, 1.5, 2].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  className="px-3 py-1.5 bg-white hover:bg-[#D7CCC8] active:scale-95 text-[#5D4037] rounded-lg text-xs font-black border border-[#D7CCC8] shrink-0 shadow-xs"
                >
                  {preset} kg
                </button>
              ))}
            </>
          ) : (
            <>
              {[1, 2, 3, 4, 5, 6, 12].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePreset(preset)}
                  className="px-3.5 py-1.5 bg-white hover:bg-[#D7CCC8] active:scale-95 text-[#5D4037] rounded-lg text-xs font-black border border-[#D7CCC8] shrink-0 shadow-xs"
                >
                  {preset} un
                </button>
              ))}
            </>
          )}
        </div>

        {/* Touch Keypad */}
        <div className="p-3 grid grid-cols-3 gap-2 bg-[#FDFBF7] flex-1">
          {keys.flat().map((key) => (
            <button
              key={key}
              onClick={() => handlePress(key)}
              className="h-14 sm:h-16 text-2xl font-bold bg-white hover:bg-[#EFEBE9] active:bg-[#D7CCC8] active:scale-95 text-[#3C2A21] rounded-2xl border border-[#D7CCC8] shadow-xs transition-all select-none"
            >
              {key}
            </button>
          ))}
          <button
            onClick={() => handlePress('DEL')}
            className="h-14 sm:h-16 flex items-center justify-center bg-[#EFEBE9] hover:bg-[#D7CCC8] active:scale-95 text-[#8B4513] rounded-2xl border border-[#D7CCC8] transition-all select-none col-span-3"
          >
            <Delete size={26} />
          </button>
        </div>

        {/* Confirmation Button */}
        <div className="p-3 bg-[#EFEBE9] border-t border-[#D7CCC8] shrink-0">
          <button
            onClick={handleConfirm}
            disabled={!value || parseFloat(value) <= 0}
            className="w-full py-4 text-lg font-black text-white bg-[#4F7942] hover:brightness-110 disabled:bg-[#A3B89E] disabled:text-white/70 rounded-2xl transition-all shadow-md uppercase border-b-4 border-[#2D4226] disabled:border-[#8FA38B] active:scale-98"
          >
            AGREGAR AL PEDIDO
          </button>
        </div>
      </div>
    </div>
  );
}
