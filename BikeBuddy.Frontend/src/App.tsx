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
import JwtService from './core/services/JwtService';

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
        <main className="flex-1 flex flex-col">
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
                element={
                  <ProtectedProfileRoute />
                } 
              />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}