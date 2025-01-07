import { Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; 2024 BikeBuddy. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}

