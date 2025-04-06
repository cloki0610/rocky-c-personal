const SiteLogo = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
      .eye {
        animation: blink 6s infinite;
        transform-origin: center;
      }
  
      @keyframes blink {
        0%, 90%, 100% { transform: scaleY(1); }
        95% { transform: scaleY(0.1); }
      }`}
      </style>

      {"Bear Head"}
      <circle cx="50" cy="50" r="40" fill="#8d6e63" />

      {"Ears"}
      <circle cx="20" cy="30" r="12" fill="#8d6e63" />
      <circle cx="80" cy="30" r="12" fill="#8d6e63" />

      {"Inner Ears"}
      <circle cx="20" cy="30" r="6" fill="#bcaaa4" />
      <circle cx="80" cy="30" r="6" fill="#bcaaa4" />

      {"Eyes"}
      <circle className="eye" cx="35" cy="50" r="4" fill="#000" />
      <circle className="eye" cx="65" cy="50" r="4" fill="#000" />

      {"Nose"}
      <ellipse cx="50" cy="60" rx="5" ry="4" fill="#3e2723" />

      {"Mouth"}
      <path
        d="M45 67 Q50 72 55 67"
        stroke="#3e2723"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

export default SiteLogo;
