import { Link } from 'react-router-dom';
import HeroSection from '../components/ui/HeroSection';
import FeaturedRecipes from '../components/ui/FeaturedRecipes';
import HowItWorks from '../components/ui/HowItWorks';
import Testimonials from '../components/ui/Testimonials';
import CursorEffect from '../components/ui/CursorEffect';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <CursorEffect />
      <ScrollReveal>
        <HeroSection />
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <FeaturedRecipes />
      </ScrollReveal>
      <ScrollReveal delay={0.4}>
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal delay={0.6}>
        <Testimonials />
      </ScrollReveal>
      
      {/* Enhanced Call to Action */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            </div>
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to Share Your
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-orange-300">
              Culinary Art?
            </span>
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Join RecipeNest today and showcase your recipes to food lovers worldwide
          </p>
          <Link
            to="/register"
            className="group relative inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/30 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl overflow-hidden"
          >
            <span className="relative z-10">Get Started Free</span>
            <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="absolute inset-0 bg-linear-to-r from-orange-100 to-red-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </Link>
        </div>
      </section>
    </div>
  );
}