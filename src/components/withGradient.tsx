export const withGradient = (
  IconWrapper: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>,
  className?: string
) => {
  // Generate a unique ID for each gradient instance
  const gradientId = `icon-gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <svg width="0" height="0">
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="24"
          y2="24"
        >
          <stop stopColor="rgb(238, 205, 163)" offset="20%" />
          <stop stopColor="rgb(196, 113, 237)" offset="60%" />
          <stop stopColor="rgb(239, 98, 159)" offset="80%" />
        </linearGradient>
      </svg>
      <IconWrapper
        className={className}
        style={{
          stroke: `url(#${gradientId})`,
          fill: "none",
        }}
      />
    </>
  );
};
