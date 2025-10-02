import React, { useState, useEffect } from 'react';

interface Executive {
  name: string;
  position: string;
  image: string;
}

const ExecutiveManagement: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(4);

  const executives: Executive[] = [
    {
      name: 'W/ro Zufan Abebe',
      position: 'Chief Executive Officer',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20female%20CEO%20in%20formal%20business%20attire%2C%20confident%20pose%2C%20corporate%20headshot%20style%2C%20neutral%20background%2C%20leadership%20presence&width=300&height=300&seq=exec1&orientation=squarish'
    },
    {
      name: 'Ato Kumelachew Abate',
      position: 'Executive Officer, Claims',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20executive%20in%20business%20formal%2C%20confident%20pose%2C%20corporate%20style%2C%20neutral%20background&width=300&height=300&seq=exec2&orientation=squarish'
    },
    {
      name: 'Ato Girum Fekede',
      position: 'Executive Officer, Underwriting',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20executive%20in%20corporate%20attire%2C%20confident%20pose%2C%20business%20style%2C%20neutral%20background&width=300&height=300&seq=exec3&orientation=squarish'
    },
    {
      name: 'W/ro Mekdes Letta',
      position: 'Director, Research & BD',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20female%20director%20in%20business%20attire%2C%20confident%20pose%2C%20corporate%20style%2C%20neutral%20background&width=300&height=300&seq=exec4&orientation=squarish'
    },
    {
      name: 'Ato Yimenu Mekonnen',
      position: 'Director, HR',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20HR%20director%20in%20formal%20attire%2C%20confident%20pose%2C%20corporate%20style%2C%20neutral%20background&width=300&height=300&seq=exec5&orientation=squarish'
    },
    {
      name: 'Ato Mallede Adunga',
      position: 'Director, Finance',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20finance%20director%20in%20business%20formal%2C%20confident%20pose%2C%20corporate%20style%2C%20neutral%20background&width=300&height=300&seq=exec6&orientation=squarish'
    },
    {
      name: 'Ato Letarik Terefe',
      position: 'Director, IT',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20IT%20director%20in%20corporate%20wear%2C%20confident%20pose%2C%20tech%20executive%20style%2C%20neutral%20background&width=300&height=300&seq=exec7&orientation=squarish'
    },
    {
      name: 'Ato Habtamu Terefe',
      position: 'Director, Audit',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20audit%20director%20in%20business%20attire%2C%20confident%20pose%2C%20corporate%20style%2C%20neutral%20background&width=300&height=300&seq=exec8&orientation=squarish'
    },
    {
      name: 'Ato Tesfahun Shibiru',
      position: 'Manager, Legal',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20legal%20manager%20in%20formal%20suit%2C%20confident%20pose%2C%20corporate%20style%2C%20neutral%20background&width=300&height=300&seq=exec9&orientation=squarish'
    },
    {
      name: 'Ato Asheber Tadesse',
      position: 'Manager, Ethics',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20ethics%20manager%20in%20business%20formal%2C%20confident%20pose%2C%20corporate%20style%2C%20neutral%20background&width=300&height=300&seq=exec10&orientation=squarish'
    },
    {
      name: 'Ato Birhan Abate',
      position: 'Manager, Procurement',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20procurement%20manager%20in%20corporate%20attire%2C%20confident%20pose%2C%20business%20style%2C%20neutral%20background&width=300&height=300&seq=exec11&orientation=squarish'
    },
    {
      name: 'Ato Behigu Tedela',
      position: 'Manager, Engineering',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20engineering%20manager%20in%20business%20wear%2C%20confident%20pose%2C%20technical%20style%2C%20neutral%20background&width=300&height=300&seq=exec12&orientation=squarish'
    },
    {
      name: 'W/ro Hilina Ayalew',
      position: 'Manager, NWCD',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20female%20manager%20in%20corporate%20attire%2C%20confident%20pose%2C%20business%20style%2C%20neutral%20background&width=300&height=300&seq=exec13&orientation=squarish'
    },
    {
      name: 'W/ro Serkalem Bekele',
      position: 'Manager, NWU',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20female%20manager%20in%20business%20formal%2C%20confident%20pose%2C%20corporate%20style%2C%20neutral%20background&width=300&height=300&seq=exec14&orientation=squarish'
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSlidesPerView(4);
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(3);
      } else {
        setSlidesPerView(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlide = Math.ceil(executives.length / slidesPerView) - 1;

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Executive Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our experienced leadership team driving NIB Insurance forward
          </p>
        </div>
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
            >
              {executives.map((executive, index) => (
                <div key={index} className="flex-none w-full md:w-1/3 lg:w-1/4 p-4">
                  <div className="bg-amber-50 rounded-xl shadow-lg p-6 h-full">
                    <img
                      src={executive.image}
                      alt={executive.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">
                      {executive.name}
                    </h3>
                    <p className="text-primary text-center mb-2">{executive.position}</p>
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

export default ExecutiveManagement;