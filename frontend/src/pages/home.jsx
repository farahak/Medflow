import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Features from '../components/Features';
import DrugSearch from '../components/DrugSearch';
import Testimonials from '../components/Testimonials';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DrugSearch />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Home;