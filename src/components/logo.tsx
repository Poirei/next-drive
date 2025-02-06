const SvgIcon: React.FC<React.SVGProps<SVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 800}
    height={props.height || 800}
    stroke={props.stroke || "#000"}
    strokeWidth={props.strokeWidth || "0"}
    viewBox="-3.2 -3.2 38.4 38.4"
    className={props.className}
  >
    <g
      stroke="#ffd1d1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="0.96"
    >
      <path d="M24 12V4H8v8H4v12h4v4h4v-4h8v4h4v-4h4V12zm-12 8H8v-4h4zm0-8V8h8v4zm12 8h-4v-4h4z"></path>
    </g>
    <g>
      <path d="M24 12V4H8v8H4v12h4v4h4v-4h8v4h4v-4h4V12zm-12 8H8v-4h4zm0-8V8h8v4zm12 8h-4v-4h4z"></path>
    </g>
  </svg>
);

export default SvgIcon;
