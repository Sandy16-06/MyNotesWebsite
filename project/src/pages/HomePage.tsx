import React, { useState } from 'react';
import { BookOpen, Users, Shield, Zap, ArrowRight, Check, Star, Globe } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

interface HomePageProps {
  onGetStarted: () => void;
  onUserAuthenticated?: (user: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onUserAuthenticated }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: 'Rich Note Taking',
      description: 'Create beautiful notes with rich text formatting and organize them with categories.'
    },
    {
      icon: Globe,
      title: 'Sync Across Devices',
      description: 'Access your notes from anywhere. Your data syncs seamlessly across all your devices.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your notes are encrypted and stored securely. Only you have access to your content.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for speed with instant search and real-time synchronization.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      content: 'This notes app has completely transformed how I organize my thoughts and ideas. The interface is beautiful and intuitive.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Student',
      content: 'Perfect for taking lecture notes and organizing study materials. The sync feature is a game-changer.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Writer',
      content: 'As a writer, I need a reliable place to capture ideas. This app delivers exactly what I need with style.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="particles">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen 
              size={32} 
              className="text-white"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}
            />
            <h1 
              className="text-2xl font-bold text-white"
              style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
            >
              My Notes
            </h1>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-6 py-3 rounded-lg font-medium transition-all hover-lift ripple"
            style={{
              background: 'rgba(59, 130, 246, 0.8)',
              color: 'white',
              border: '1px solid rgba(59, 130, 246, 1)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 scale-in"
            style={{ 
              color: 'white', 
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.8)',
              lineHeight: '1.1'
            }}
          >
            Your Ideas,
            <br />
            <span className="gradient-text">Beautifully Organized</span>
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed slide-in-up"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}
          >
            Capture thoughts, organize ideas, and access them from anywhere. 
            The most beautiful way to take notes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center slide-in-up">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover-lift ripple flex items-center gap-3"
              style={{
                background: 'rgba(59, 130, 246, 0.9)',
                color: 'white',
                border: '1px solid rgba(59, 130, 246, 1)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
              }}
            >
              Get Started Free
              <ArrowRight size={20} />
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover-lift ripple"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
              }}
            >
              Try Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl font-bold text-center mb-16 text-white"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
          >
            Everything you need to stay organized
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 glass-effect rounded-2xl hover-lift card-hover stagger-${index + 1}`}
                style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
              >
                <feature.icon 
                  size={48} 
                  className="text-blue-400 mb-4"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
                />
                <h3 
                  className="text-xl font-semibold mb-3 text-white"
                  style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl font-bold text-center mb-16 text-white"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
          >
            Loved by thousands of users
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className={`p-6 glass-effect rounded-2xl hover-lift card-hover stagger-${index + 1}`}
                style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-white/90 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p 
                    className="font-semibold text-white"
                    style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}
                  >
                    {testimonial.name}
                  </p>
                  <p className="text-white/70 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
          >
            Ready to get organized?
          </h2>
          <p 
            className="text-xl mb-8 text-white/90 max-w-2xl mx-auto"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}
          >
            Join thousands of users who have transformed their note-taking experience.
          </p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-8 py-4 rounded-lg font-semibold text-lg transition-all hover-lift ripple"
            style={{
              background: 'rgba(59, 130, 246, 0.9)',
              color: 'white',
              border: '1px solid rgba(59, 130, 246, 1)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
            }}
          >
            Start Taking Notes Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen 
              size={24} 
              className="text-white"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}
            />
            <span 
              className="text-xl font-bold text-white"
              style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)' }}
            >
              My Notes
            </span>
          </div>
          <p className="text-white/70">
            © 2024 My Notes. Built with love for better productivity.
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={onUserAuthenticated}
      />
    </div>
  );
};