import React from "react";
import Step1Image from "../../assets/hero/step-1.png";
import Step2Image from "../../assets/hero/step-2.png";
import Step3Image from "../../assets/hero/step-3.png";
import Step4Image from "../../assets/hero/step-4.png";
import Slider from "react-slick";

const ImageList = [
  {
    id: 1,
    img: Step1Image,
    title: "Step 1: Create Your Account",
    description:
      "Sign up as a seller on our platform. It's quick, easy, and free! Provide your details and verify your account to get started.",
  },
  {
    id: 2,
    img: Step2Image,
    title: "Step 2: Set Your Profit Margin",
    description:
      "Define your profit margin for each product. Our intuitive dashboard helps you set prices that work best for your business.",
  },
  {
    id: 3,
    img: Step3Image,
    title: "Step 3: Share Your Unique Link",
    description:
      "Share your personalized store link with your customers. Use social media, email, or any other platform to reach a wider audience.",
  },
  {
    id: 4,
    img: Step4Image,
    title: "Step 4: Get Orders & Earn",
    description:
      "Start receiving orders through your link. Track your sales, manage orders, and watch your earnings grow!",
  },
];

const token=localStorage.getItem("token");

const Hero = ({ handleOrderPopup }) => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200 ">
      {/* background pattern */}
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>
      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                    <button
                      onClick={()=> token ? location.href= "/" : location.href="/login"}
                      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 lg:scale-120 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;

