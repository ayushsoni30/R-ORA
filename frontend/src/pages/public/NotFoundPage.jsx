import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        <span className="text-4xl font-extrabold text-slate-300 block mb-3">404</span>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
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
              Discover Rooms
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
