export * from './projectApi';
export * from './profileApi';
export * from './likeApi';
export * from './viewApi';
export * from './contactApi';
export * from './skillsApi';
export * from './settingsApi';

import { supabase } from './client';

/**
 * Image Upload Helper
 */
export const uploadImage = async (file, bucket) => {
  if (!file) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

/**
 * Ensure Profile Exists
 */
export const ensureProfileExists = async (user) => {
  if (!user) return;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (!profile) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        name: user.email.split('@')[0],
        bio: 'Portfolio Owner',
        avatar_url: '',
        updated_at: new Date() 
      });
    if (error) throw error;
  }
};
