import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ImageWithSkeletonSwiper.css';

const ImageWithSkeletonSwiper = ({ src, alt, className }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className={`image-with-skeleton ${className || ''}`}>
            {isLoading && <div className="skeleton-loader"></div>}
            <img
                src={src}
                alt={alt}
                className={`image ${isLoading ? 'hidden' : ''}`}
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

ImageWithSkeletonSwiper.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
};

export default ImageWithSkeletonSwiper;
