import React, { useCallback, useRef, useEffect, useState } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  label?: string;
}

export const DualRangeSlider = React.memo(
  ({ min, max, valueMin, valueMax, onChange, label }: DualRangeSliderProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [localMin, setLocalMin] = useState(valueMin);
    const [localMax, setLocalMax] = useState(valueMax);

    // Sync local state when props change (e.g. reset)
    useEffect(() => {
      setLocalMin(valueMin);
      setLocalMax(valueMax);
    }, [valueMin, valueMax]);

    const handleMinChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.min(Number(e.target.value), localMax - 1);
        setLocalMin(val);
        onChange(val, localMax);
      },
      [localMax, onChange]
    );

    const handleMaxChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Math.max(Number(e.target.value), localMin + 1);
        setLocalMax(val);
        onChange(localMin, val);
      },
      [localMin, onChange]
    );

    const leftPercent = ((localMin - min) / (max - min)) * 100;
    const rightPercent = ((localMax - min) / (max - min)) * 100;

    return (
      <div className="min-w-[180px]">
        {label && (
          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {localMin}
          </span>
          <span className="text-xs text-gray-400">—</span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
            {localMax}
          </span>
        </div>
        <div ref={trackRef} className="relative h-6 flex items-center">
          {/* Background track */}
          <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
          {/* Active range track */}
          <div
            className="absolute h-1.5 bg-blue-500 rounded-full"
            style={{
              left: `${leftPercent}%`,
              width: `${rightPercent - leftPercent}%`,
            }}
          />
          {/* Min thumb */}
          <input
            type="range"
            min={min}
            max={max}
            value={localMin}
            onChange={handleMinChange}
            className="dual-range-thumb absolute w-full pointer-events-none appearance-none bg-transparent h-1.5"
            style={{ zIndex: localMin > max - 10 ? 5 : 3 }}
          />
          {/* Max thumb */}
          <input
            type="range"
            min={min}
            max={max}
            value={localMax}
            onChange={handleMaxChange}
            className="dual-range-thumb absolute w-full pointer-events-none appearance-none bg-transparent h-1.5"
            style={{ zIndex: 4 }}
          />
        </div>
      </div>
    );
  }
);

DualRangeSlider.displayName = 'DualRangeSlider';
