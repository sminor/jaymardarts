import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

// Require all images from the 'assets/about_images' directory
const importAll = (r) => {
  return r.keys().map(r);
}

const images = importAll(require.context('../assets/about_images', false, /\.(png|jpe?g|svg|JPEG|JPG)$/));

const About = () => {

  return (
    <section id="about" className="App-section">
      <div className="info-box">
        <h2>About Us</h2>
        <p>
          Welcome to JayMar Darts, your go-to destination for soft tip dart enthusiasts in the Portland Metro area. At JayMar Darts, we specialize in providing a top-notch dart experience using the renowned Bullshooter brand soft tip dart boards.
        </p>
        <p>
          We take pride in our partnerships with local bars, where we host weekly tournaments that bring together players from all over the area. Our dedication to keeping our dart boards in perfect working condition ensures that every game is fair, fun, and competitive.
        </p>
        <p>
          Whether you're a seasoned pro or new to the game, JayMar Darts is the perfect place to sharpen your skills, meet fellow dart enthusiasts, and enjoy the thrill of competition. Join us at one of our weekly events and become a part of our growing community.
        </p>

        {/* Photo Carousel */}
        <div className="carousel-wrapper">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            showIndicators={true}
            interval={5000}
          >
            {images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Carousel ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default About;
