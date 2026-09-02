import React, { useState } from 'react';
import { Lock, ShieldCheck, Delete, Store } from 'lucide-react';
import { AuthUser } from '../types';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
}

const DEFAULT_USER: AuthUser = {
  id: '1',
  name: 'Terminal Mostrador',
  role: 'administrador',
  pin: '1234'
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Obtener el PIN guardado o el PIN por defecto (1234)
  const masterPin = localStorage.getItem('pos_master_pin') || DEFAULT_USER.pin;

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const verifyPin = (inputPin: string) => {
    if (inputPin === masterPin) {
      onLogin({ ...DEFAULT_USER, pin: masterPin });
    } else {
      setError(true);
      setTimeout(() => {
        setPin('');
      }, 700);
    }
  };

  const handleQuickLogin = () => {
    setPin(masterPin);
    setTimeout(() => {
      onLogin({ ...DEFAULT_USER, pin: masterPin });
    }, 200);
  };

  return (
    <div className="min-h-dvh w-full bg-[#FDFBF7] flex flex-col items-center justify-between p-4 sm:p-6 text-[#3C2A21] select-none">
      {/* Header Branding */}
      <div className="w-full max-w-sm flex flex-col items-center text-center pt-6">
        <div className="w-16 h-16 bg-[#8B4513] rounded-2xl flex items-center justify-center shadow-lg mb-3 border-2 border-[#5D2E0C]">
          <Store size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[#3C2A21]">Terminal Carnicería</h1>
        <p className="text-sm font-semibold text-[#8B4513] uppercase tracking-wider mt-0.5">Acceso al Sistema POS</p>
      </div>

      {/* PIN Section */}
      <div className="w-full max-w-sm flex flex-col items-center my-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#5D4037] mb-4">
            <Lock size={14} className="text-[#8B4513]" />
            <span>Ingrese su PIN de 4 dígitos</span>
          </div>
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((idx) => {
              const filled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-5 h-5 rounded-full transition-all duration-200 border-2 ${
                    error
                      ? 'bg-red-500 border-red-600 scale-110 animate-bounce'
                      : filled
                      ? 'bg-[#4F7942] border-[#2D4226] scale-110'
                      : 'bg-white border-[#D7CCC8]'
                  }`}
                />
              );
            })}
          </div>
          {error && (
            <p className="text-xs font-bold text-red-600 mt-3 animate-pulse">
              PIN incorrecto. Intente nuevamente.
            </p>
          )}
        </div>

        {/* Numeric Keypad for Mobile Screen */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-16 rounded-2xl bg-white hover:bg-[#EFEBE9] active:scale-95 border-2 border-[#D7CCC8] shadow-sm text-2xl font-bold text-[#3C2A21] flex items-center justify-center transition-all"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-16 rounded-2xl bg-[#EFEBE9] hover:bg-[#D7CCC8] active:scale-95 border border-[#D7CCC8] text-sm font-bold text-[#8B4513] flex items-center justify-center uppercase transition-all"
          >
            Limpiar
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-16 rounded-2xl bg-white hover:bg-[#EFEBE9] active:scale-95 border-2 border-[#D7CCC8] shadow-sm text-2xl font-bold text-[#3C2A21] flex items-center justify-center transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 rounded-2xl bg-[#EFEBE9] hover:bg-[#D7CCC8] active:scale-95 border border-[#D7CCC8] text-[#8B4513] flex items-center justify-center transition-all"
          >
            <Delete size={26} />
          </button>
        </div>
      </div>

      {/* Quick Demo Access Bar */}
      <div className="w-full max-w-sm pt-4 pb-2 border-t border-[#EFEBE9] text-center">
        <button
          onClick={handleQuickLogin}
          className="w-full py-2.5 bg-[#EFEBE9] hover:bg-[#D7CCC8] text-[#3C2A21] rounded-xl text-xs font-bold border border-[#D7CCC8] transition-all flex items-center justify-center gap-1.5"
        >
          <ShieldCheck size={16} className="text-[#4F7942]" />
          <span>Acceso rápido demo (PIN: {masterPin})</span>
        </button>
      </div>
    </div>
  );
}
