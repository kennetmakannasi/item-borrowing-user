import React, { useRef, useState } from 'react';

interface OtpInputProps {
  onChange: (value: string) => void;
}

export default function OtpInput({ onChange }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return; 

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 mt-6">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(el) => (inputRefs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-14 border-2 rounded-xl text-center text-2xl font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all border-gray-200"
        />
      ))}
    </div>
  );
}