import React, { useEffect, useRef, useState } from "react";
import Img1 from "../assets/shirt/shirt.png";
import Img2 from "../assets/shirt/shirt2.png";
import Img3 from "../assets/shirt/shirt3.png";
import { FaStar } from "react-icons/fa";

const ProductsData = [
  { id: 1, img: Img1, title: "Casual Wear", description: "Unleash futuristic vibes with The Robotic Angel t-shirt, where sci-fi meets divine artistry. This striking design features a cybernetic angel adorned with metallic wings, embodying both technology and elegance." },
  { id: 2, img: Img2, title: "Printed Shirt", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 3, img: Img3, title: "Women Shirt", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { id: 4, img: Img1, title: "Classic Polo", description: "Stylish and comfortable polo shirt for everyday wear." },
  { id: 5, img: Img2, title: "Summer Vibes", description: "Perfect t-shirt for summer adventures." },
  { id: 6, img: Img3, title: "Urban Style", description: "Modern design for a street-smart look." }
];

const ProductBox = ({ handleOrderPopup }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const visibleCards = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (ProductsData.length - visibleCards + 1));
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMouseDrag = (e) => {
    e.preventDefault();
    let startX = e.pageX;
    const initialScroll = containerRef.current.scrollLeft;

    const onMouseMove = (moveEvent) => {
      const distance = startX - moveEvent.pageX;
      containerRef.current.scrollLeft = initialScroll + distance;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="container">
      <div className="text-left mb-24">
        <h1 className="text-primary font-bold text-3xl">New Collection</h1>
        <p className="text-xs text-gray-400">
          Discover our top-rated products curated just for you.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden w-full"
        onMouseDown={handleMouseDrag}
        style={{ cursor: 'pointer' }}
      >
        <div
          className="flex transition-transform duration-500 mt-24"
          style={{ transform: `translateX(-${currentSlide * (100 / visibleCards)}%)` }}
        >
          {ProductsData.map((data) => (
            <div key={data.id} className="min-w-[33.33%] px-4">
              <div className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px] mx-auto">
                <div className="h-[100px]">
                  <img
                    src={data.img}
                    alt="product"
                    className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                  />
                </div>
                <div className="p-4 text-center">
                  <div className="w-full flex items-center justify-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                    <FaStar className="text-yellow-500" />
                  </div>
                  <h1 className="text-xl font-bold">{data.title}</h1>
                  <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                    {data.description}
                  </p>
                  <button
                    className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                    onClick={handleOrderPopup}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductBox;
