import { type Category } from "@/shared/labels";

export interface Equipment {
  id: string;
  name: string;
  category: Category;
  pricePerDay: number;
  deposit: number;
  images: string[];
  specs: Record<string, string>;
  rules: string[];
  stock: number;
  /** для имитации 409 */
  bookedDates?: string[];
}

const img = (n: number) => [
  `/placeholder/${n}-1.jpg`,
  `/placeholder/${n}-2.jpg`,
];
function daysFromToday(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date.toISOString().slice(0, 10);
}
export const equipment: Equipment[] = [
  {
    id: "tent-nova-2",
    name: "Палатка Nova 2",
    category: "tents",
    pricePerDay: 900,
    deposit: 5000,
    images: img(1),
    specs: { Мест: "2", Вес: "2.4 кг", Сезонность: "3" },
    rules: ["Возврат в сухом виде", "Чистка при сильном загрязнении — 500 ₽"],
    stock: 4,
  },
  {
    id: "tent-nova-4",
    name: "Палатка Nova 4",
    category: "tents",
    pricePerDay: 1400,
    deposit: 7000,
    images: img(2),
    specs: { Мест: "4", Вес: "3.8 кг", Сезонность: "3" },
    rules: ["Возврат в сухом виде"],
    stock: 2,
    bookedDates: [daysFromToday(3), daysFromToday(4)],
  },
  {
    id: "tent-alpine-3",
    name: "Палатка Alpine 3",
    category: "tents",
    pricePerDay: 1800,
    deposit: 9000,
    images: img(3),
    specs: { Мест: "3", Вес: "3.1 кг", Сезонность: "4" },
    rules: ["Только для опытных", "Возврат в сухом виде"],
    stock: 1,
  },
  {
    id: "sup-river-10",
    name: "Сапборд River 10'6",
    category: "sup",
    pricePerDay: 1600,
    deposit: 15000,
    images: img(4),
    specs: { Длина: "320 см", Нагрузка: "120 кг", Комплект: "весло, насос" },
    rules: ["Обязателен спасжилет", "Промыть после солёной воды"],
    stock: 3,
  },
  {
    id: "sup-lake-11",
    name: "Сапборд Lake 11'0",
    category: "sup",
    pricePerDay: 1900,
    deposit: 18000,
    images: img(5),
    specs: {
      Длина: "335 см",
      Нагрузка: "140 кг",
      Комплект: "весло, насос, лиш",
    },
    rules: ["Обязателен спасжилет"],
    stock: 2,
  },
  {
    id: "sup-kids-8",
    name: "Сапборд Kids 8'0",
    category: "sup",
    pricePerDay: 1100,
    deposit: 9000,
    images: img(6),
    specs: { Длина: "244 см", Нагрузка: "70 кг", Комплект: "весло, насос" },
    rules: ["Только под присмотром взрослых"],
    stock: 0,
  },
  {
    id: "backpack-trek-60",
    name: "Рюкзак Trek 60",
    category: "backpacks",
    pricePerDay: 400,
    deposit: 3000,
    images: img(7),
    specs: { Объём: "60 л", Вес: "1.9 кг", Спина: "регулируемая" },
    rules: ["Возврат без посторонних запахов"],
    stock: 6,
  },
  {
    id: "backpack-trek-90",
    name: "Рюкзак Trek 90",
    category: "backpacks",
    pricePerDay: 550,
    deposit: 4000,
    images: img(8),
    specs: { Объём: "90 л", Вес: "2.4 кг", Спина: "регулируемая" },
    rules: ["Возврат без посторонних запахов"],
    stock: 3,
  },
  {
    id: "backpack-city-35",
    name: "Рюкзак City 35",
    category: "backpacks",
    pricePerDay: 250,
    deposit: 2000,
    images: img(9),
    specs: { Объём: "35 л", Вес: "1.1 кг" },
    rules: ["Без залога при аренде от 5 дней"],
    stock: 8,
  },
  {
    id: "sleep-comfort-0",
    name: "Спальник Comfort 0°",
    category: "sleeping",
    pricePerDay: 350,
    deposit: 2500,
    images: img(10),
    specs: { Комфорт: "0°C", Вес: "1.5 кг", Наполнитель: "синтетика" },
    rules: ["Обязателен вкладыш (выдаётся)", "Стирка — 400 ₽"],
    stock: 7,
  },
  {
    id: "sleep-light-10",
    name: "Спальник Light +10°",
    category: "sleeping",
    pricePerDay: 250,
    deposit: 1500,
    images: img(11),
    specs: { Комфорт: "10°C", Вес: "0.8 кг", Наполнитель: "синтетика" },
    rules: ["Обязателен вкладыш (выдаётся)"],
    stock: 9,
  },
  {
    id: "sleep-down-15",
    name: "Спальник Down -15°",
    category: "sleeping",
    pricePerDay: 700,
    deposit: 6000,
    images: img(12),
    specs: { Комфорт: "-15°C", Вес: "1.2 кг", Наполнитель: "пух" },
    rules: ["Не хранить сжатым", "Беречь от влаги"],
    stock: 2,
    bookedDates: [daysFromToday(8)],
  },
  {
    id: "stove-gas-mini",
    name: "Горелка Gas Mini",
    category: "stoves",
    pricePerDay: 200,
    deposit: 1200,
    images: img(13),
    specs: { Мощность: "2.6 кВт", Вес: "95 г", Тип: "газовая" },
    rules: ["Баллоны не входят в комплект", "Возврат без нагара"],
    stock: 10,
  },
  {
    id: "stove-multi-fuel",
    name: "Горелка Multi Fuel",
    category: "stoves",
    pricePerDay: 450,
    deposit: 4000,
    images: img(14),
    specs: { Мощность: "3.2 кВт", Вес: "310 г", Тип: "мультитопливная" },
    rules: ["Инструктаж перед выдачей", "Возврат без нагара"],
    stock: 3,
  },
  {
    id: "stove-system-1l",
    name: "Горелочная система 1 л",
    category: "stoves",
    pricePerDay: 550,
    deposit: 5000,
    images: img(15),
    specs: { Объём: "1 л", Вес: "480 г", Тип: "интегрированная" },
    rules: ["Баллоны не входят в комплект"],
    stock: 4,
  },
  {
    id: "tent-tarp-3x4",
    name: "Тент-шатёр 3×4",
    category: "tents",
    pricePerDay: 600,
    deposit: 3000,
    images: img(16),
    specs: { Размер: "3×4 м", Вес: "2.1 кг", Стойки: "в комплекте" },
    rules: ["Возврат в сухом виде"],
    stock: 5,
  },
];
