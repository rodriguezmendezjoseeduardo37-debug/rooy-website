import { createClient } from 'next-sanity'

export const client = createClient({
  // Usamos el ID que ya tienes en tus otros archivos
  projectId: "4fzbmelx", 
  dataset: "produccion",
  apiVersion: '2024-01-01',
  useCdn: false, 
  token: process.env.SANITY_API_TOKEN, 
})