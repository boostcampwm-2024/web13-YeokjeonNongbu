interface BackIconProps {
  onClick: () => void;
  className?: string;
}

const BackIcon: React.FC<BackIconProps> = ({ onClick, className }) => {
  return (
    <svg
      onClick={onClick}
      className={`cursor-pointer ${className}`}
      width="25"
      height="25"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.08301 17.0834L30.9163 17.0834C32.0209 17.0834 32.9163 17.9788 32.9163 19.0834L32.9163 26.3333C32.9163 27.4379 32.0209 28.3333 30.9163 28.3333L11.6663 28.3333"
        stroke="black"
        strokeWidth="1.00088"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 12.0833C9.29738 14.0359 8.20262 15.1307 6.25 17.0833L11.25 22.0833"
        stroke="black"
        strokeWidth="1.00088"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BackIcon;
