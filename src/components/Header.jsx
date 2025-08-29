import React, { useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const sliderImages = [
    '/img/1.jpeg',
    '/img/2.jpeg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/img/11.jpg',
    '/img/12.jpg',
    '/img/13.jpg',
    '/img/14.jpg',
    '/img/15.jpg',

];

function getRandomIndex(excludeIndex, length) {
    let idx;
    do {
        idx = Math.floor(Math.random() * length);
    } while (idx === excludeIndex);
    return idx;
}

export default function Header() {
    const swiperRef = useRef(null);

    // Shuffle once on mount (optional, you can keep sliderImages as is)
    const images = useMemo(() => sliderImages, []);

    React.useEffect(() => {
        if (!swiperRef.current) return;

        // Every 3 seconds, pick a random slide index different from current
        const interval = setInterval(() => {
            const swiper = swiperRef.current;
            if (!swiper) return;

            const currentIndex = swiper.realIndex;
            const nextIndex = getRandomIndex(currentIndex, images.length);
            swiper.slideToLoop(nextIndex); // slideToLoop handles looping indexes
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <header style={{ width: '100%', height: '120px', overflow: 'hidden',marginBottom: '0px' }}>
            <Swiper
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                modules={[Autoplay]}
                autoplay={false} // disable swiper autoplay since we handle it manually
                loop={true}
                spaceBetween={0}
                slidesPerView={1}
            >
                {images.map((imgPath, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={imgPath}
                            alt={`Slide ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover',
                                display: 'block',
                                marginBottom: '0px',
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </header>
    );
}
