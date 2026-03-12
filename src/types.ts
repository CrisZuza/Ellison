export type Language = 'ro' | 'ru';
export type Locale = 'RO' | 'RU';

export interface Translation {
  nav: {
    about: string;
    services: string;
    masters: string;
    gallery: string;
    products: string;
    courses: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    title: string;
    content: string;
  };
  services: {
    title: string;
    book: string;
  };
  masters: {
    title: string;
  };
  gallery: {
    title: string;
  };
  testimonials: {
    title: string;
    items: { name: string; text: string }[];
  };
  products: {
    title: string;
    buy: string;
  };
  courses: {
    pageTitle: string;
    intro: string;
    duration: string;
    hours: string;
    days: string;
    price: string;
    language: string;
    level: string;
    certificate: string;
    nextStarts: string;
    learn: string;
    curriculum: string;
    who: string;
    enroll: string;
    details: string;
    back: string;
    contact: string;
  };
  booking: {
    title: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    name: string;
    phone: string;
    service: string;
    master: string;
    date: string;
    time: string;
    next: string;
    back: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
  contact: {
    title: string;
    hours: string;
    weekdays: string;
    weekend: string;
    follow: string;
  };
  footer: {
    address: string;
    rights: string;
  };
}

export interface Service {
  id: string;
  name: { [key in Language]: string };
  description?: { [key in Language]: string };
  category: string;
  price: number;
  duration: string;
  image?: string;
  masters?: string[];
}

export interface Master {
  id: string;
  name: string;
  specialty: { [key in Language]: string };
  bio?: { [key in Language]: string };
  image: string;
  instagram?: string;
  telegram?: string;
  services?: string[];
  courses?: string[];
}

export interface Product {
  id: string;
  name: { [key in Language]: string };
  description?: { [key in Language]: string };
  price: number;
  image: string;
  images?: string[];
  category?: string;
}

export interface Course {
  id: string;
  name: { [key in Language]: string };
  subtitle: { [key in Language]: string };
  overview: { [key in Language]: string };
  curriculum: { [key in Language]: string[] };
  whatYouLearn?: { [key in Language]: string[] };
  whoIsFor?: { [key in Language]: string[] };
  price: number;
  duration: string;
  image: string;
  images?: string[];
  masters: string[];
  nextStartDates?: string[];
  contact?: {
    phone: string;
    instagram?: string;
    whatsapp?: string;
  };
  category?: string;
  level?: string;
  certificate?: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  order: number;
}
