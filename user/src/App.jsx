import React, {useEffect} from "react";
import Hero from "./components/Hero/Hero";
import AOS from "aos";
import "aos/dist/aos.css";
import './App.css';

import Product from "./components/Products/product";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Reload the page once after login
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const reloaded = sessionStorage.getItem("reloaded");

    if (user && !reloaded) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      {/* <Navbar handleOrderPopup={handleOrderPopup} /> */}
      <Hero handleOrderPopup={handleOrderPopup} />
      {/* <ProductBox /> */}
      {/* <Products /> */}
      <Product />
      {/* <TopProducts handleOrderPopup={handleOrderPopup} />
      <Banner />
      <Subscribe />
      <Products />
      <Testimonials /> */}
      {/* <Footer /> */}
      {/* <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} /> */}
    </div>
  );
};

export default App;
