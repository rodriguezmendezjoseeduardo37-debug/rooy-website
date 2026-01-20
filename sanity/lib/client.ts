import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  // Usamos 'produccion' como default ya que es el que tienes en tus otras APIs
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'produccion', 
  apiVersion: '2024-01-01', // Esta línea es obligatoria
  useCdn: false, 
  token: process.env.SANITY_API_TOKEN, 
})