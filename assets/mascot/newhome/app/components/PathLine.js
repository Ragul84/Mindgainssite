import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const PathLine = ({
  width = "100%",
  height = "400",
  color, // optional solid color override
  style,
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 2000 2000"
    style={style}
  >
    <Defs>
      {/* Gradient definition */}
      <LinearGradient id="grad" x1="348.7539" y1="990.6523" x2="1624.2777" y2="990.6523" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#FFAA00" />
        <Stop offset="1" stopColor="#FF7006" />
      </LinearGradient>
    </Defs>

    <Path
      d="M1596.78,225.21c-20.94-3.25-471.85-68.71-582.53,140.48c-10.14,19.16-18.03,41.79-21.83,68.69
         c-6.11,38.09-8.66,93.93,19.91,144.46c89.13,157.62,279.37,51.72,434.68,207.2c122.32,122.46,134.96,369.87,36.38,478.99
         c-95.17,105.34-198.09,44.51-301.17,117.27c-163.72,115.57-107.81,283.75-266.78,357.73c-106.02,49.34-259.96,34.48-320.16-47.54
         c-27.64-37.66-31.58-80.11-28.86-115.61c10.54-137.67,191.16-206.47,128.91-354.29c-8.63-20.5-13.97-41.51-29.26-62.73
         c-87.5-121.42-260.3-122.61-289.81-121.9"
      fill="none"
      stroke={color ? color : 'url(#grad)'} // Use gradient unless solid color provided
      strokeWidth={55}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
    />
  </Svg>
);

export default PathLine;
