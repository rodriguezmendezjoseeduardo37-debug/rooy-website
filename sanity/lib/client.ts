import { createClient } from 'next-sanity'

export const client = createClient({
  // Hardcode del ID para que Vercel no falle al compilar
  projectId: "4fzbmelx", 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'produccion',
  apiVersion: '2024-01-01',
  useCdn: false, 
  token: process.env.SANITY_API_TOKEN, 
})