"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ value, onChange, isLoading }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        {isLoading ? (
          <svg className="w-5 h-5 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What do you want to update?"
        className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl
                   shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-transparent transition-shadow placeholder:text-gray-400"
        autoFocus
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
