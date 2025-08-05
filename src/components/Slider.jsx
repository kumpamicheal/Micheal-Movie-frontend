import React from 'react';
import './Slider.css'; // keep your styling, but update it accordingly

function Slider({ sliderItems }) {
    return (
        <div className="slider-container">
            {sliderItems.map((item) => (
                <a
                    key={item._id}
                    href={item.linkToMovie}
                    className="slider-item no-image"
                >
                    <div className="slider-text-content">
                        <h2>{item.title || 'Untitled Movie'}</h2>
                        {item.description && <p>{item.description}</p>}
                    </div>
                </a>
            ))}
        </div>
    );
}

export default Slider;
