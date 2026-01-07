type QuestionBlockProps = {
  question: string;
  options: string[];
  name: string;
  value?: string;
  onChange?: (name: string, value: string) => void;
};

export default function QuestionBlock({ question, options, name, value, onChange }: QuestionBlockProps) {
  return (
   <div
    className="mb-4 p-3 border rounded shadow-sm"
    style={{ backgroundColor: "#f3f2f2ff" }}
    >
     <p className="mb-3">{question}</p>

      {options.map((opt) => (
        <div className="form-check mb-2" key={opt}>
          <input
            className="form-check-input"
            type="radio"
            name={name}
            value={opt}
            id={`${name}-${opt}`}
            checked={value === opt}
            onChange={() => onChange && onChange(name, opt)}
          />
          <label className="form-check-label" htmlFor={`${name}-${opt}`}>
            {opt}
          </label>
        </div>
      ))}
    </div>
  );
}
