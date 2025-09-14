import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/my/app-sidebar';
import { Header } from './pages/header';
import { Footer } from './pages/footer';
import { HeroSection } from './pages/main/hero-section';
import { FeaturesSection } from './pages/main/feature-section';

import { useState } from 'react';
import { useIsMobile } from './hooks/use-mobile';
import useAuthStore from './stores/auth';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/profile/profile-page';
import EventsPage, { PageMode } from './pages/events/events-page/event-page'

import JwtService from './core/services/JwtService';
import { items } from './components/my/menu-items';
import CreateEventPage from './pages/events/create-event/create-event-page';
import EventDetailsPage from './pages/events/event-details/event-details-page';
import EventChatPage from './pages/events/event-chat/event-chat-page';
import EmailVerificationPage from './pages/auth/email-verification-page';

export default function App() {

  const authStore = useAuthStore()
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const isMobile = useIsMobile()

  const toggleSidebar = () => {
    setIsSideBarOpen(prev => !prev)
  }

  const ProtectedProfileRoute = () => {
    const decoded = JwtService.decodeToken()
    
    if (!authStore.isAuthenticated || !decoded?.nameId) {
      return <Navigate to="/" replace />
    }
    return <ProfilePage userId={decoded.nameId} />
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      
      <div className="flex flex-1">
      { authStore.isAuthenticated && 
        <SidebarProvider>
          <div className="flex">
            <AppSidebar />
            <SidebarTrigger 
              onClick={toggleSidebar}
              className={ `top-2 fixed ${isSideBarOpen && !isMobile ? 'left-64' : 'left-3'}  translate-x-1/2 z-0`}
              style={{ backgroundColor: "#A1FFDC" }}
            />
          </div>
        </SidebarProvider>
      }

        {/* Main content */}
        <main className="flex-1 w-full flex flex-col">
          <div className="flex-1">
            <Routes>
              <Route 
                path="/" 
                element={
                  !authStore.isAuthenticated ? (
                    <>
                      <HeroSection />
                      <FeaturesSection />
                    </>
                  ) : null
                } 
              />
              <Route 
                path="/profile/:userId" 
                element={<ProtectedProfileRoute />} 
              />
              <Route path="/auth/verify" element={<EmailVerificationPage />} />
              <Route 
                path={items[0].url}
                element={authStore.isAuthenticated ? <EventsPage /> : <Navigate to="/" replace />} 
              />
              <Route 
                path={items[1].url}
                element={authStore.isAuthenticated ? <EventsPage mode={PageMode.History} /> : <Navigate to="/" replace />} 
              />
              <Route 
                path={`${items[0].url}/create`}
                element={
                  authStore.isAuthenticated ? <CreateEventPage /> : <Navigate to="/" replace />
                } 
              />
              <Route
                path={`${items[0].url}/edit/:eventId`}
                element={authStore.isAuthenticated ? <CreateEventPage /> : <Navigate to="/" replace />}
              />
              <Route
                path={`${items[0].url}/:eventId`}
                element={
                  authStore.isAuthenticated ? <EventDetailsPage /> : <Navigate to="/" replace />
                }
              />
              <Route 
                path={`${items[0].url}/:eventId/chat`}
                element={authStore.isAuthenticated ? <EventChatPage /> : <Navigate to="/" replace />}
              />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}