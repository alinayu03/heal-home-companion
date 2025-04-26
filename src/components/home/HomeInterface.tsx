import React, { useState, useEffect } from 'react';
import { Heart, Home, MessageCircle, Menu, X } from 'lucide-react';

const HomeAttendant = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Navigation */}
      <nav className="py-6 px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Home className="text-indigo-500" size={24} />
          <span className="font-medium text-xl">Aura</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-indigo-500 transition-colors">Features</a>
          <a href="#about" className="text-gray-600 hover:text-indigo-500 transition-colors">About</a>
          <a href="#contact" className="text-gray-600 hover:text-indigo-500 transition-colors">Contact</a>
        </div>
        
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-8">
          <button className="absolute top-6 right-8" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
          <a href="#features" className="text-xl" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a href="#about" className="text-xl" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#contact" className="text-xl" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      )}

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 pt-20 pb-32">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-50 rounded-full mb-6">
            <Heart className="text-indigo-500" size={24} />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {greeting}, I'm Aura
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-10">
            Your thoughtful AI companion for a more peaceful and organized home life.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-sm">
              Get Started
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-500 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How I can help you</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-indigo-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Home className="text-indigo-500" size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Home Management</h3>
              <p className="text-gray-600">I'll help you keep track of household tasks and create a peaceful environment.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-indigo-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <MessageCircle className="text-indigo-500" size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Thoughtful Assistance</h3>
              <p className="text-gray-600">I'm always here to listen and provide gentle guidance when you need it.</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="bg-indigo-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                <Heart className="text-indigo-500" size={20} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Wellness Support</h3>
              <p className="text-gray-600">I can help you maintain routines that support your physical and mental wellbeing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-2xl md:text-3xl font-light italic text-gray-600 mb-8">
            "Having Aura in my home has brought a sense of calm and organization I didn't think was possible. It's like having a thoughtful friend who's always there when you need them."
          </p>
          <p className="text-gray-800 font-medium">Sarah L.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Home className="text-indigo-500" size={20} />
            <span className="font-medium">Aura</span>
          </div>
          
          <div className="flex space-x-8">
            <a href="#privacy" className="text-sm text-gray-600 hover:text-indigo-500">Privacy</a>
            <a href="#terms" className="text-sm text-gray-600 hover:text-indigo-500">Terms</a>
            <a href="#contact" className="text-sm text-gray-600 hover:text-indigo-500">Contact</a>
          </div>
          
          <p className="text-sm text-gray-500">© 2025 Aura AI Assistant</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeAttendant;