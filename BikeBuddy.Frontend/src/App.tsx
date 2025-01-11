import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/my/app-sidebar';
import { Header } from './pages/header';
import { Footer } from './pages/footer';
import { HeroSection } from './pages/main/hero-section';
import { FeaturesSection } from './pages/main/feature-section';

import { useState } from 'react';
import { useIsMobile } from './hooks/use-mobile';
import useAuthStore from './stores/auth';

export default function App() {

  const authStore = useAuthStore()
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const isMobile = useIsMobile()

  const toggleSidebar = () => {
    setIsSideBarOpen(prev => !prev)
  }


  return (
    <div>
      <Header />
      
      <div className="flex">
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
        <main className='flex-grow'>
        { !authStore.isAuthenticated && (
          <>
            <HeroSection />
            <FeaturesSection />
          </>
        )}
          <Footer />
        </main>
      </div>
    </div>
  );
}