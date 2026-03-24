import 'bootstrap/dist/css/bootstrap.min.css';

export default function ThankYou() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 text-center p-3">
      <div className="mb-5">
        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4"
        >
          <circle cx="60" cy="60" r="55" fill="#28a745" opacity="0.1"/>
          <circle cx="60" cy="60" r="50" stroke="#28a745" strokeWidth="3"/>
          <path 
            d="M35 60 L52 77 L85 44" 
            stroke="#28a745" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="mb-4 fw-bold" style={{ color: "#28a745" }}>
        Dziękuję za udział w badaniu!
      </h1>

      <div className="mb-4" style={{ maxWidth: "600px" }}>
        <p className="lead mb-3">
          Twoje odpowiedzi zostały zapisane i będą bardzo pomocne w mojej pracy magisterskiej.
        </p>
      </div>
    </div>
  );
}

