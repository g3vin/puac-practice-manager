import './Gallery.css';

import img1 from './Gallery/home_gallery_1.jpeg';
import img2 from './Gallery/home_gallery_2.jpg';
import img3 from './Gallery/home_gallery_3.jpg';
import img4 from './Gallery/home_gallery_4.jpg';
import img5 from './Gallery/home_gallery_5.jpg';
import img6 from './Gallery/home_gallery_6.jpg';
import img7 from './Gallery/home_gallery_7.jpg';
// Add more imports as needed

const images = [img7, img1, img3, img4, img5, img6, img2];

const Gallery = () => {
  return (
    <div className="gallery-container">
      {images.map((src, i) => (
        <img key={i} src={src} alt={`PUAC photo ${i + 1}`} className="gallery-image" />
      ))}
    </div>
  );
};

export default Gallery;
