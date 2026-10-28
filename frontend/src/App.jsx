import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import { HomePage } from './pages/public/HomePage';
import { RoomCatalogPage } from './pages/public/RoomCatalogPage';
import { RoomDetailPage } from './pages/public/RoomDetailPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsPage } from './pages/public/TermsPage';
import { AboutPage } from './pages/public/AboutPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

import { StudentBookingsPage } from './pages/student/StudentBookingsPage';

import { OwnerDashboardPage } from './pages/owner/OwnerDashboardPage';
import { OwnerRoomsPage } from './pages/owner/OwnerRoomsPage';
import { RoomFormPage } from './pages/owner/RoomFormPage';
import { OwnerBookingsPage } from './pages/owner/OwnerBookingsPage';

import { ProfilePage } from './pages/shared/ProfilePage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomCatalogPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/student/bookings"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/rooms"
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerRoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/rooms/new"
            element={
              <ProtectedRoute allowedRole="owner">
                <RoomFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/rooms/:id/edit"
            element={
              <ProtectedRoute allowedRole="owner">
                <RoomFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/bookings"
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
