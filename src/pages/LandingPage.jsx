import { Link } from 'react-router-dom';
import HeroSection from '../../components/ui/HeroSection';
import FeaturedRecipes from '../../components/ui/FeaturedRecipes';
import HowItWorks from '../../components/ui/HowItWorks';
import Testimonials from '../../components/ui/Testimonials';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedRecipes />
      <HowItWorks />
      <Testimonials />
      
      {/* Call to Action */}
      <section className="bg-linear-to-r from-orange-500 to-red-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Share Your Culinary Art?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join RecipeNest today and showcase your recipes to food lovers worldwide
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started Free →
          </Link>
        </div>
      </section>
    </div>
  );
}