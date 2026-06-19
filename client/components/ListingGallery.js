'use client';
import { useState } from 'react';
import { imageUrl } from '@/lib/api';

export default function ListingGallery({ images, title }) {
  const [activeImg, setActiveImg] = useState(0);
  if (!images?.length) return (
    <div style={{aspectRatio:'4/3',background:'var(--surface)',borderRadius:'var(--radius-lg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem'}}>🖼️</div>
  );
  return (
    <div className="image-gallery">
      <img className="main-image" src={imageUrl(images[activeImg])} alt={title}
        style={{borderRadius:'var(--radius-lg)',width:'100%',aspectRatio:'4/3',objectFit:'cover'}}
        onError={e=>{e.target.src=`https://placehold.co/800x600/1a2b1e/00d168?text=AdHub`;}}
      />
      {images.length > 1 && (
        <div className="thumb-strip" style={{marginTop:8}}>
          {images.map((img,i) => (
            <img key={i} src={imageUrl(img)} alt="" className={i===activeImg?'active':''}
              onClick={()=>setActiveImg(i)}
              onError={e=>{e.target.src=`https://placehold.co/72x72/1a2b1e/00d168?text=img`;}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
