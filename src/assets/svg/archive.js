import * as React from 'react';

const Svg = (props) => {
  return (
    <svg
      id="download_svg__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x={0}
      y={0}
      width={30}
      height={30}
      viewBox="-9.5 -9.5 36 36"
      xmlSpace="preserve"
      {...props}
    >
      <style>
        {
          '#download_svg__Layer_1:hover #download_svg__action{transform:translateY(-4px)}#download_svg__Layer_1:hover path{fill:#203457}'
        }
      </style>
      <path
        style={{
          transition: 'all .3s ease',
          fill: props.color,
        }}
        id="download_svg__action"
        d="M9,13l3.3-3.3c0.3-0.3,0.3-0.9,0-1.2l0,0c-0.3-0.3-0.9-0.3-1.2,0l-1.8,1.8V3.8c0-0.5-0.4-0.9-0.9-0.9
          S7.5,3.3,7.5,3.8v6.5L5.7,8.5c-0.3-0.3-0.9-0.3-1.2,0c-0.3,0.3-0.3,0.9,0,1.2L7.8,13C8.1,13.3,8.7,13.3,9,13L9,13z M15.3,0H1.4
          C0.6,0,0,0.6,0,1.4l0,0v13.8c0,0.8,0.6,1.4,1.4,1.4l0,0h13.9c0.8,0,1.4-0.6,1.4-1.4l0,0V1.4C16.8,0.6,16.1,0,15.3,0L15.3,0z M15,8.6
          v6.3H1.7V9.3l0,0V1.7H15V8.6L15,8.6z"
        fill="#555"
      />
    </svg>
  );
};

export default Svg;
