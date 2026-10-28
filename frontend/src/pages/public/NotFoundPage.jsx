import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md bg-white border border-warm-border rounded-xl p-8 shadow-subtle">
        <span className="text-5xl font-extrabold text-forest-800/20 block mb-3">404</span>
        <h1 className="text-xl font-bold text-charcoal mb-2">Page Not Found</h1>
        <p className="text-xs text-charcoal-muted mb-6 leading-relaxed">
          The page you are looking for does not exist or may have been relocated.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Go to Home
            </Button>
          </Link>
          <Link to="/rooms">
            <Button variant="outline" size="md">
              Find Rooms
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
