import { supabase } from './client';

export const sendContactMessage = async (messageData) => {
  const { error } = await supabase
    .from('contact_messages')
    .insert([messageData]);
  
  if (error) throw error;
};
