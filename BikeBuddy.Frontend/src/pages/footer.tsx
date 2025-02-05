import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faGithub, faTelegram, faVk } from '@fortawesome/free-brands-svg-icons'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a href="https://www.instagram.com/yari_lane?igsh=MWlzMXVpN3BqOHlhdg==" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <FontAwesomeIcon  icon={faInstagram} size='xl' /> 
          </a>
          <a href="https://github.com/YariLAN/BikeBuddy.WebApp" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Github</span>
            <FontAwesomeIcon icon={faGithub} size='xl' />
          </a>
          <a href="https://t.me/Yari_la" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Telegram</span>
            <FontAwesomeIcon icon={faTelegram} size="xl" />
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Vk</span>
            <FontAwesomeIcon icon={faVk} size="xl" />
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

