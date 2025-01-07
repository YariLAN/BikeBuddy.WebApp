import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <div >
      <div className="mx-auto py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Откройте для себя мир велоспорта с BikeBuddy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Планируйте маршруты, находите единомышленников и делитесь своими велоприключениями
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg">
              Начать путешествие
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Узнать больше
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

