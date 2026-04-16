import { supabase } from './client';

export const getSkills = async () => {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true });
  
  if (error) throw error;
  return data;
};
