// src/data/products.ts

import { Product } from '../types/Product';

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Ring Doorbell",
    type: "Smart Doorbells",
    price: 99.99,
    description: "HD video doorbell with two-way talk",
    accessories: [
      { id: 1, name: "Chime Pro", price: 49.99 },
      { id: 2, name: "Solar Charger", price: 39.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 19.99 },
      { duration: "2 Years", price: 29.99 }
    ],
    specialDiscount: 10,
    imageUrl: "https://commons.wikimedia.org/wiki/File:Doorbell_button.jpg" 
  },
  {
    id: 2,
    name: "August Smart Lock",
    type: "Smart Doorlocks",
    price: 149.99,
    description: "Keyless entry smart lock with remote access",
    accessories: [
      { id: 3, name: "Door Hardware Kit", price: 29.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 24.99 },
      { duration: "2 Years", price: 39.99 }
    ],
    manufacturerRebate: 15
  },
  {
    id: 3,
    name: "Amazon Echo",
    type: "Smart Speakers",
    price: 79.99,
    description: "Voice-controlled smart speaker with Alexa",
    accessories: [
      { id: 4, name: "Philips Hue Light Bulb", price: 14.99 },
      { id: 5, name: "Smart Plug", price: 24.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 9.99 },
      { duration: "2 Years", price: 14.99 }
    ]
  },
  {
    id: 4,
    name: "Philips Hue",
    type: "Smart Lightings",
    price: 59.99,
    description: "Smart LED bulb with customizable colors",
    accessories: [],
    warrantyOptions: [
      { duration: "1 Year", price: 9.99 }
    ],
    specialDiscount: 5
  },
  {
    id: 5,
    name: "Nest Thermostat",
    type: "Smart Thermostats",
    price: 249.99,
    description: "Smart thermostat with energy-saving features",
    accessories: [
      { id: 6, name: "Sensor Starter Pack", price: 99.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 29.99 },
      { duration: "2 Years", price: 49.99 },
      { duration: "3 Years", price: 69.99 }
    ],
    manufacturerRebate: 25
  },
  {
    id: 6,
    name: "Arlo Pro 3",
    type: "Smart Doorbells",
    price: 199.99,
    description: "Wireless home security camera system with HDR",
    accessories: [
      { id: 7, name: "Solar Panel Charger", price: 49.99 },
      { id: 8, name: "Extra Battery", price: 39.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 29.99 },
      { duration: "2 Years", price: 49.99 }
    ]
  },
  {
    id: 7,
    name: "Yale Assure Lock",
    type: "Smart Doorlocks",
    price: 279.99,
    description: "Touchscreen deadbolt with smart home integration",
    accessories: [
      { id: 9, name: "Wi-Fi Bridge", price: 59.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 39.99 },
      { duration: "2 Years", price: 69.99 }
    ],
    specialDiscount: 20
  },
  {
    id: 8,
    name: "Google Nest Mini",
    type: "Smart Speakers",
    price: 49.99,
    description: "Compact smart speaker with Google Assistant",
    accessories: [
      { id: 10, name: "Wall Mount", price: 14.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 7.99 }
    ],
    manufacturerRebate: 5
  },
  {
    id: 9,
    name: "Lutron Caseta",
    type: "Smart Lightings",
    price: 159.99,
    description: "Smart dimmer switch starter kit",
    accessories: [
      { id: 11, name: "Pico Remote Control", price: 19.99 },
      { id: 12, name: "Smart Bridge Pro", price: 99.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 19.99 },
      { duration: "2 Years", price: 34.99 }
    ]
  },
  {
    id: 10,
    name: "Ecobee SmartThermostat",
    type: "Smart Thermostats",
    price: 249.99,
    description: "Voice-enabled smart thermostat with room sensors",
    accessories: [
      { id: 13, name: "Additional Room Sensor", price: 79.99 },
      { id: 14, name: "Haven Temperature Sensor", price: 39.99 }
    ],
    warrantyOptions: [
      { duration: "1 Year", price: 29.99 },
      { duration: "2 Years", price: 49.99 },
      { duration: "3 Years", price: 69.99 }
    ],
    specialDiscount: 15,
    manufacturerRebate: 20
  }
];