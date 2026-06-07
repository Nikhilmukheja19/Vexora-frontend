import { Check } from 'lucide-react';

const DesignSelector = ({ label, description, options, value, onChange }) => (
  <div className="space-y-3">
    <div>
      <p className="text-sm font-semibold">{label}</p>
      {description && <p className="text-xs text-surface-500 mt-0.5">{description}</p>}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`relative text-left p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-sm ${
              isSelected
                ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
            }`}
          >
            {isSelected && (
              <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary-500 text-white flex items-center justify-center">
                <Check className="w-3 h-3" />
              </span>
            )}
            <p className="text-sm font-medium pr-6">{option.name}</p>
            <p className="text-xs text-surface-500 mt-0.5">{option.description}</p>
          </button>
        );
      })}
    </div>
  </div>
);

export default DesignSelector;
