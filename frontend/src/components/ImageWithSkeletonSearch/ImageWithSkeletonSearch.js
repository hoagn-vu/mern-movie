import React, { useState } from 'react';
import './ImageWithSkeletonSearch.css';

const ImageWithSkeletonSearch = ({ src, alt, className, width, height }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            style={{
                position: 'relative',
                width: width || '100%',
                height: height || 'auto',
                // overflow: 'hidden',
                borderRadius: '0.375rem',
                backgroundColor: '#e0e0e0',
            }}
            className={className}
        >
            {/* Skeleton */}
            {!loaded && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #444 25%, #555 50%, #444 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeleton-loading 1.5s infinite',
                        borderRadius: '0.375rem',
                    }}
                ></div>
            )}

            {/* Image */}
            <img
                src={src}
                alt={alt}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: loaded ? 'block' : 'none',
                    borderRadius: '0.375rem',

                }}
                onLoad={() => setLoaded(true)}
            />
        </div>
    );
};

export default ImageWithSkeletonSearch;


