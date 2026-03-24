# ☁️ Skyzary — Weather App

Pet-проект для изучения и закрепления: **React 19**, **TypeScript**, **Zustand**, работа с **REST API** и принципы построения масштабируемой клиентской архитектуры.

![Weather App Screenshot](https://i.imgur.com/O93lNQT.jpeg)

**Live Demo:** [weather-app-nine-bay-52.vercel.app](https://weather-app-nine-bay-52.vercel.app/)

---

## Технический стек

| Технология | Версия | Роль в проекте |
| :--- | :---: | :--- |
| React | 19.2 | UI-библиотека, функциональные компоненты + хуки |
| TypeScript | 5.9 | Статическая типизация в strict-режиме |
| Vite | 7.2 | Сборщик, HMR, ESBuild для dev, Rollup для production |
| Zustand | 5.0 | Глобальный стейт-менеджер с `persist` middleware |
| Axios | 1.13 | HTTP-клиент с поддержкой `AbortController` |
| CSS Modules | — | Scoped-стили, без глобальных конфликтов |
| ESLint (Flat Config) | 9.39 | Линтинг с `react-hooks` + `react-refresh` плагинами |

---

## Архитектура проекта

```
src/
├── components/          # UI-компоненты (feature-sliced)
│   ├── App/             # Корневой компонент, компоновка layout
│   ├── CityImage/       # Фоновое изображение города (Unsplash)
│   ├── Forecast/        # 5-дневный прогноз + Skeleton-загрузка
│   ├── VillageSearchField/  # Поле поиска с debounce-логикой
│   └── WeatherData/     # Карточка текущей погоды
├── services/            # API-слой (бизнес-логика запросов)
│   ├── weatherService.ts    # OpenWeatherMap: geo, weather, forecast
│   └── imageService.ts     # Unsplash: поиск фото по названию города
├── hooks/
│   └── useStore.ts      # Zustand store — единый источник данных
├── types/
│   └── WeatherData.ts   # TypeScript-интерфейсы для API-ответов
├── helpers/
│   └── weatherIcon.tsx  # Маппинг icon-кодов → React-иконки (react-icons/wi)
└── main.tsx             # Entry point, StrictMode, подключение iziToast CSS
```

### Организация компонентов

Каждый компонент живёт в собственной директории и содержит:
- `Component.tsx` — логика и рендеринг
- `Component.module.css` — scoped-стили

Такой подход обеспечивает **изоляцию**, простоту **рефакторинга** и лёгкое **удаление** компонентов без побочных эффектов.

---

## Ключевые технические решения

### State Management — Zustand + `persist`

Стор выполняет роль единого координатора данных. Все запросы к API инициируются через экшены стора, что позволяет централизовать обработку ошибок и управление загрузкой:

```typescript
// hooks/useStore.ts
export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      fetchWeather: async (city) => {
        set({ loading: true });
        const coords = await weatherService.getGeo(city);
        const weatherData = await weatherService.fetchWeather(coords);
        set({ weatherData, loading: false });
        // Параллельно подгружаем фото и прогноз
        await get().fetchImage(coords.name);
        await get().foreCast(coords);
      },
      // ...
    }),
    {
      name: "weather-app-storage",
      partialize: (state) => ({
        city: state.city,
        weatherData: state.weatherData,
        forecastData: state.forecastData,
      })
    }
  )
);
```

- **`partialize`** — в `localStorage` сохраняются только `city`, `weatherData` и `forecastData` (без функций и промежуточных состояний)
- **Selectors** в компонентах для предотвращения лишних ре-рендеров: `useStore((state) => state.weatherData)`

### API-слой — Service Object Pattern

Сервисы реализованы как объекты-синглтоны с отменяемыми запросами:

```typescript
// services/weatherService.ts
export const weatherService = {
  abortController: new AbortController(),

  async getGeo(city: string): Promise<CityCoords | undefined> {
    this.abortController.abort();                    // отменяем предыдущий запрос
    this.abortController = new AbortController();    // новый контроллер
    const response = await axios.get(geoUrl, {
      params,
      signal: this.abortController.signal            // привязка сигнала
    });
    // ...
  }
};
```

**Цепочка запросов:** `getGeo(city)` → `fetchWeather(coords)` → параллельно `fetchImage()` + `getForecast()`

### Оптимизация изображений (Unsplash)

Вместо загрузки raw-изображений, URL модифицируется для оптимизации:

```typescript
const optimizeUrl = new URL(result.urls.raw);
optimizeUrl.searchParams.set("fm", "avif");   // AVIF-формат
optimizeUrl.searchParams.set("w", "1200");    // ширина 1200px
optimizeUrl.searchParams.set("fit", "crop");  // кроп под размер
optimizeUrl.searchParams.set("q", "60");      // качество 60%
```

### UX: Skeleton Loading

Компонент `ForecastSkeleton` отображает CSS-анимированные плейсхолдеры пока данные прогноза загружаются, предотвращая layout shift.

### Маппинг иконок погоды

`weatherIcon.tsx` маппит коды OpenWeatherMap (`01d`, `02n`, ...) на SVG-компоненты из `react-icons/wi`, поддерживая дневные и ночные варианты для всех 9 типов погоды.

---

## Используемые API

| API | Эндпоинты | Назначение |
| :--- | :--- | :--- |
| [OpenWeatherMap](https://openweathermap.org/api) | `/geo/1.0/direct`, `/data/2.5/weather`, `/data/2.5/forecast` | Геокодинг, текущая погода, 5-дневный прогноз |
| [Unsplash](https://unsplash.com/developers) | `/search/photos` | Фоновое изображение города |

---

## UI-библиотеки

- **`@codaworks/react-glow`** — glow-эффекты на карточках
- **`@mawtech/glass-ui`** — glassmorphism-компоненты
- **`react-circular-progressbar`** — круговые индикаторы (влажность и т.д.)
- **`react-icons`** — SVG-иконки погоды (`wi`) и UI (`fa`)
- **`izitoast`** — toast-уведомления для ошибок API

**Шрифты:** Montserrat (основной) + Cascadia Code (моноширинный), Google Fonts с `preconnect`.

---

## Конфигурация TypeScript

Проект работает в **strict-режиме** со следующими флагами:

```jsonc
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noFallthroughCasesInSwitch": true,
  "verbatimModuleSyntax": true,     // type-only imports
  "erasableSyntaxOnly": true        // TS 5.8+ runtime erasure
}
```

---

## Быстрый старт

```bash
# Клонировать
git clone https://github.com/Skyzary/weather-app.git
cd weather-app

# Настроить переменные окружения
cp .env.example .env
# Заполнить VITE_API_KEY и VITE_UNSPLASH_ACCESS_KEY

# Установить зависимости и запустить
npm install
npm run dev
```

### Переменные окружения

```env
VITE_API_KEY=ваш_ключ_openweathermap
VITE_UNSPLASH_ACCESS_KEY=ваш_ключ_unsplash
```

| Скрипт | Описание |
| :--- | :--- |
| `npm run dev` | Dev-сервер с HMR |
| `npm run build` | `tsc -b && vite build` — проверка типов + production bundle |
| `npm run lint` | ESLint (flat config) |
| `npm run preview` | Превью production-сборки локально |

---

## Деплой

Развёрнуто на **Vercel**. При использовании `vercel dev` переменные окружения подтягиваются автоматически в `.env.local`.

## Лицензия

MIT
