import React from 'react'
import FeaturesSection from '../Components/LandingPage/FeaturesSection'
import HeroSection from '../Components/LandingPage/HeroSection'
import Navbar from '../Components/LandingPage/Navbar'
import TestimonialsAndFooter from '../Components/LandingPage/TestimonialsAndFooter'


const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsAndFooter />
    </div>
  )
}

export default LandingPage