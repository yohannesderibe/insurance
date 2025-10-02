import React, { useEffect, useRef } from 'react';

const QuickStats: React.FC = () => {
  const yearsCounterRef = useRef<HTMLDivElement>(null);
  const customersCounterRef = useRef<HTMLDivElement>(null);
  const branchesCounterRef = useRef<HTMLDivElement>(null);
  const claimsCounterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(yearsCounterRef.current, 25, "+");
          animateCounter(customersCounterRef.current, 500000, "+");
          animateCounter(branchesCounterRef.current, 85, "+");
          animateCounter(claimsCounterRef.current, 98, "%");
          observer.disconnect();
        }
      });
    });

    if (yearsCounterRef.current) {
      observer.observe(yearsCounterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounter = (element: HTMLDivElement | null, target: number, suffix: string = "") => {
    if (!element) return;
    
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString() + suffix;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }
    }, 20);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div ref={yearsCounterRef} className="text-4xl font-bold text-primary mb-2">
              0
            </div>
            <div className="text-gray-600">Years of Service</div>
          </div>
          <div className="text-center">
            <div ref={customersCounterRef} className="text-4xl font-bold text-primary mb-2">
              0
            </div>
            <div className="text-gray-600">Satisfied Customers</div>
          </div>
          <div className="text-center">
            <div ref={branchesCounterRef} className="text-4xl font-bold text-primary mb-2">
              0
            </div>
            <div className="text-gray-600">Branch Network</div>
          </div>
          <div className="text-center">
            <div ref={claimsCounterRef} className="text-4xl font-bold text-primary mb-2">
              0
            </div>
            <div className="text-gray-600">Claims Settlement Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickStats;