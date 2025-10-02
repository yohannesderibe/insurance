import React, { useState, useEffect } from 'react';

interface Director {
  name: string;
  position: string;
  description: string;
  image: string;
}

const BoardOfDirectors: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);

  const directors: Director[] = [
    {
      name: 'Ato Getachew Tekle',
      position: 'Board Chairman',
      description: 'Over 25 years of experience in financial services and insurance sector',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businessman%20in%20formal%20suit%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20well-groomed%2C%20dignified%20expression&width=300&height=300&seq=director1&orientation=squarish'
    },
    {
      name: 'W/ro Tigist Haile',
      position: 'Vice Chairperson',
      description: 'Expert in risk management and corporate governance',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businesswoman%20in%20formal%20attire%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20elegant%20appearance&width=300&height=300&seq=director2&orientation=squarish'
    },
    {
      name: 'Dr. Solomon Tadesse',
      position: 'Board Member',
      description: 'Specializes in strategic planning and business development',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businessman%20in%20business%20suit%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20experienced%20look&width=300&height=300&seq=director3&orientation=squarish'
    },
    {
      name: 'Ato Mekonnen Assefa',
      position: 'Board Member',
      description: 'Expert in financial markets and investment strategy',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businessman%20in%20formal%20suit%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20mature%20appearance&width=300&height=300&seq=director4&orientation=squarish'
    },
    {
      name: 'W/ro Selamawit Desta',
      position: 'Board Member',
      description: 'Specializes in corporate law and regulatory compliance',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businesswoman%20in%20corporate%20attire%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20professional%20look&width=300&height=300&seq=director5&orientation=squarish'
    },
    {
      name: 'Dr. Yohannes Mersha',
      position: 'Board Member',
      description: 'Expert in economic policy and business strategy',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businessman%20in%20business%20formal%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20experienced%20appearance&width=300&height=300&seq=director6&orientation=squarish'
    },
    {
      name: 'Ato Tewodros Bekele',
      position: 'Board Member',
      description: 'Expertise in technology and digital transformation',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businessman%20in%20formal%20attire%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20dignified%20look&width=300&height=300&seq=director7&orientation=squarish'
    },
    {
      name: 'W/ro Rahel Tesfaye',
      position: 'Board Member',
      description: 'Specializes in risk assessment and management',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businesswoman%20in%20executive%20attire%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20professional%20appearance&width=300&height=300&seq=director8&orientation=squarish'
    },
    {
      name: 'Ato Girma Wolde',
      position: 'Board Member',
      description: 'Expert in strategic partnerships and business development',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20businessman%20in%20business%20suit%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20senior%20executive%20look&width=300&height=300&seq=director9&orientation=squarish'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(window.innerWidth >= 768 ? 3 : 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlide = Math.ceil(directors.length / slidesPerView) - 1;

  const nextSlide = () => {
    if (currentSlide < maxSlide) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Board of Directors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our experienced board members leading NIB Insurance towards excellence
          </p>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
            >
              {directors.map((director, index) => (
                <div key={index} className="flex-none w-full md:w-1/3 p-4">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <img
                      src={director.image}
                      alt={director.name}
                      className="w-48 h-48 rounded-full mx-auto mb-6 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                      {director.name}
                    </h3>
                    <p className="text-gray-600 text-center mb-2">{director.position}</p>
                    <p className="text-gray-600 text-sm text-center">{director.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg z-10"
          >
            <i className="ri-arrow-left-s-line text-2xl"></i>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-3 rounded-full shadow-lg z-10"
          >
            <i className="ri-arrow-right-s-line text-2xl"></i>
          </button>
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardOfDirectors;