import { Map, Users, Calendar, Trophy } from 'lucide-react'

const features = [
  {
    name: 'Планирование маршрутов',
    description: 'Создавайте и делитесь велосипедными маршрутами с сообществом.',
    icon: Map,
  },
  {
    name: 'Сообщество',
    description: 'Присоединяйтесь к единомышленникам и участвуйте в групповых поездках.',
    icon: Users,
  },
  {
    name: 'События',
    description: 'Следите за велособытиями в вашем регионе и участвуйте в них.',
    icon: Calendar,
  },
  {
    name: 'Достижения',
    description: 'Отслеживайте свой прогресс и получайте награды за достижения.',
    icon: Trophy,
  },
]

export function FeaturesSection() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary sm:text-2xl">Возможности</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Все что нужно для велосипедиста
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            BikeBuddy предоставляет все необходимые инструменты для комфортной езды на велосипеде
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                </div>
                <dt className="text-base font-semibold leading-7">
                  {feature.name}
                </dt>
                <dd className="mt-1 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

