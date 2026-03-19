import { supabase } from '@/lib/supabase/client'

export interface Usuario {
  id: string
  email: string
  role: string
  ativo: boolean
}

export async function fetchUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email, role, ativo')
    .order('email', { ascending: true })

  if (error) {
    console.error('Error fetching usuarios:', error)
    return []
  }

  return data as Usuario[]
}
