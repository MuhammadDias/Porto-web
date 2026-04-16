import { supabase } from './client';

export const getProfile = async (userId) => {
  if (!userId) {
     // If no specific userId, try to get the first one (portfolio owner)
     const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const updateProfile = async (userId, profileData) => {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profileData, updated_at: new Date() });
  
  if (error) throw error;
};
