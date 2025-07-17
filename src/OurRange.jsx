import { useEffect, useRef } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';

const OurRange = () => {
  const viewerRef = useRef(null);
  const instanceRef = useRef(null);
  
  useEffect(() => {
    if (viewerRef.current) {
      instanceRef.current = new Viewer({
        container: viewerRef.current,
        panorama: '/range-360.jpg',
        defaultYaw: '130deg',
        navbar: [
          'zoom',
          'fullscreen'
        ],
      });
    }

    return () => {
      instanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="our-range-page">
      <h1>Our Range</h1>
      <div
        ref={viewerRef}
        style={{
          width: '100%',
          height: '500px',
          maxWidth: '100%',
          borderRadius: '10px',
        }}
      />
    </div>
  );
};

export default OurRange;
