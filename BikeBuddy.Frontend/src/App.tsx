import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { AppSidebar } from './components/my/app-sidebar';

export default function App() {
  return (
    <SidebarProvider>
      {/* Боковая панель открывается при наведении */}
      <div>
        {<AppSidebar />}
      </div>
      
      <main>
        <div>
            <SidebarTrigger 
                className='mt-2 ml-2 w-100' 
                style={{ backgroundColor: "#A1FFDC" }}
            />
            {/* Основной контент */}
        </div>
      </main>
    </SidebarProvider>
  );
}