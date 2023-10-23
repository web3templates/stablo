export default function Loading() {
  return (
    <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
      {new Array(6).fill().map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <SkeletonImg />
        </div>
      ))}
    </div>
  );
}

const SkeletonImg = () => {
  const style = `
     .dark svg#skeleton #colorbase {
        stop-color: #2d2d2d;
      }
      .dark svg#skeleton #colorhighlight {
        stop-color: #3d3d3d;
      }
  `;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      id="skeleton"
      aria-labelledby="loading-aria"
      viewBox="0 0 500 750"
      preserveAspectRatio="none">
      <title id="loading-aria">Loading...</title>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clip-path)"
        style={{ fill: 'url("#fill")' }}
      />
      <defs>
        <clipPath id="clip-path">
          <rect
            x="0"
            y="0"
            rx="10"
            ry="10"
            width="505"
            height="505"
          />
          <rect x="0" y="585" rx="0" ry="0" width="480" height="18" />
          <rect x="0" y="625" rx="0" ry="0" width="365" height="18" />
          <rect x="0" y="535" rx="0" ry="0" width="154" height="21" />
          <rect
            x="-10"
            y="433"
            rx="2"
            ry="2"
            width="365"
            height="1"
          />
          <rect
            x="60"
            y="676"
            rx="0"
            ry="0"
            width="164"
            height="27"
          />
          <rect
            x="277"
            y="683"
            rx="0"
            ry="0"
            width="179"
            height="14"
          />
          <circle cx="20" cy="689" r="18" />
          <circle cx="250" cy="690" r="4" />
        </clipPath>
        <linearGradient id="fill">
          <stop
            offset="0.599964"
            stopColor="#f0f0f0"
            stopOpacity="1"
            id="colorbase">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop
            offset="1.59996"
            stopColor="#f7f7f7"
            stopOpacity="1"
            id="colorhighlight">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop
            offset="2.59996"
            stopColor="#f0f0f0"
            stopOpacity="1"
            id="colorbase">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
};
