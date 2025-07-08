import React from 'react';

const TestimonialCard = ({ text, name, position, company, direction }) => (
  <div className="bg-blue-500 text-white p-6 rounded-2xl mb-4">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-sm mb-4 leading-relaxed">{text}</p>
    <div className="flex items-center">
      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
        <span className="text-white font-semibold text-sm">{name.charAt(0)}</span>
      </div>
      <div>
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-xs opacity-80">{position}, {company}</p>
      </div>
    </div>
  </div>
);

const ScrollingTestimonials = () => {
  const testimonials = [
    {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
      name: "John Doe",
      position: "CEO",
      company: "Tech Corp"
    },
    {
      text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      name: "Jane Smith",
      position: "Designer",
      company: "Creative Studio"
    },
    {
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.",
      name: "Mike Johnson",
      position: "Developer",
      company: "Code Labs"
    },
    {
      text: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.",
      name: "Sarah Wilson",
      position: "Manager",
      company: "Business Inc"
    },
    {
      text: "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.",
      name: "Alex Brown",
      position: "Analyst",
      company: "Data Co"
    },
    {
      text: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint.",
      name: "Emma Davis",
      position: "Consultant",
      company: "Advisory Group"
    }
  ];

  // Duplicate testimonials untuk seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="font-family-poppins min-h-screen bg-blue-100">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-8 overflow-hidden">
          {/* Left column - scrolling down */}
          <div className="md:flex-1 relative h-screen overflow-hidden">
            <div className="animate-scroll-down flex flex-col">
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`left-${index}`}
                  text={testimonial.text}
                  name={testimonial.name}
                  position={testimonial.position}
                  company={testimonial.company}
                />
              ))}
            </div>
          </div>

          {/* Right column - scrolling up */}
          <div className="hidden md:block md:flex-1 relative h-screen overflow-hidden">
            <div className="animate-scroll-up flex flex-col">
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`right-${index}`}
                  text={testimonial.text}
                  name={testimonial.name}
                  position={testimonial.position}
                  company={testimonial.company}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`


        @keyframes scroll-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0%);
          }
        }

        @keyframes scroll-up {
          0% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-scroll-down {
          animation: scroll-down 30s linear infinite;
        }

        .animate-scroll-up {
          animation: scroll-up 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ScrollingTestimonials;