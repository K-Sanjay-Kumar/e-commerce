// import React from "react";
// import footerLogo from "../../assets/logo.png";
// import Banner from "../../assets/website/footer-pattern.jpg";
// import {
//   FaFacebook,
//   FaInstagram,
//   FaLinkedin,
//   FaLocationArrow,
//   FaMobileAlt,
// } from "react-icons/fa";

// const BannerImg = {
//   backgroundImage: `url(${Banner})`,
//   backgroundPosition: "bottom",
//   backgroundRepeat: "no-repeat",
//   backgroundSize: "cover",
//   height: "100%",
//   width: "100%",
// };

// const FooterLinks = [
//   {
//     title: "Home",
//     link: "/",
//   },
//   {
//     title: "About",
//     link: "/",
//   },
//   {
//     title: "Contact",
//     link: "/",
//   },
//   {
//     title: "Blog",
//     link: "/",
//   },
// ];

// const Footer = () => {
//   return (
//     <div style={BannerImg} className="text-white">
//       <div className="container">
//         <div data-aos="zoom-in" className="grid md:grid-cols-3 pb-44 pt-5">
//           {/* company details */}
//           <div className="py-8 px-4">
//             <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
//               <img src={footerLogo} alt="" className="max-w-[50px]" />
//               Shopsy
//             </h1>
//             <p>
//               Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum in
//               beatae ea recusandae blanditiis veritatis.
//             </p>
//           </div>

//           {/* Footer Links */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
//             <div>
//               <div className="py-8 px-4">
//                 <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
//                   Important Links
//                 </h1>
//                 <ul className="flex flex-col gap-3">
//                   {FooterLinks.map((link) => (
//                     <li
//                       className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
//                       key={link.title}
//                     >
//                       <span>{link.title}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div>
//               <div className="py-8 px-4">
//                 <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
//                   Links
//                 </h1>
//                 <ul className="flex flex-col gap-3">
//                   {FooterLinks.map((link) => (
//                     <li
//                       className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
//                       key={link.title}
//                     >
//                       <span>{link.title}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//             {/* social links */}

//             <div>
//               <div className="flex items-center gap-3 mt-6">
//                 <a href="/">
//                   <FaInstagram className="text-3xl" />
//                 </a>
//                 <a href="/">
//                   <FaFacebook className="text-3xl" />
//                 </a>
//                 <a href="/">
//                   <FaLinkedin className="text-3xl" />
//                 </a>
//               </div>
//               {/* <div className="mt-6">
//                 <div className="flex items-center gap-3">
//                   <FaLocationArrow />
//                   <p>Noida, Uttar Pradesh</p>
//                 </div>
//                 <div className="flex items-center gap-3 mt-3">
//                   <FaMobileAlt />
//                   <p>+91 123456789</p>
//                 </div>
//               </div> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;


import React from "react";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const Footer = () => {
  return (
    <div style={BannerImg} className="text-white">
      <div className="container py-10 text-center">
        {/* Logo and Short Description */}
        <div className="mb-6">
          <img src={footerLogo} alt="Logo" className="mx-auto max-w-[60px]" />
          <h1 className="text-2xl font-bold mt-2">Shopsy</h1>
          <p className="text-gray-300 mt-1">
            Get the latest updates and exclusive offers.
          </p>
        </div>

        {/* Subscribe Form */}
        <div className="max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 rounded-l-md text-black focus:outline-none"
          />
          <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-md">
            Subscribe Now
          </button>
        </div>

        {/* Footer Text */}
        <p className="text-gray-400 text-sm mt-6">
          © {new Date().getFullYear()} Shopsy.
        </p>
      </div>
    </div>
  );
};

export default Footer;
