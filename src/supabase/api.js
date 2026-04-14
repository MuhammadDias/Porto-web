import { supabase } from './client';

/**
 * Image Upload Helper
 * @param {File} file - File object to upload
 * @param {string} bucket - Bucket name ('avatars' or 'projects')
 * @returns {Promise<string>} - Public URL of the uploaded image
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
 * Profile APIs
 */
export const getProfile = async (userId) => {
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

export const ensureProfileExists = async (user) => {
  if (!user) return;
  const profile = await getProfile(user.id);
  if (!profile) {
    await updateProfile(user.id, {
      name: user.email.split('@')[0],
      bio: 'Portfolio Owner',
      avatar_url: '',
    });
  }
};

/**
 * Like APIs
 */
export const toggleLike = async (userId, projectId) => {
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .single();

  if (existingLike) {
    const { error } = await supabase.from('likes').delete().eq('id', existingLike.id);
    if (error) throw error;
    return false; // Result is unliked
  } else {
    const { error } = await supabase.from('likes').insert([{ user_id: userId, project_id: projectId }]);
    if (error) throw error;
    return true; // Result is liked
  }
};

export const getLikeCount = async (projectId) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);
  
  if (error) throw error;
  return count || 0;
};

export const checkIfLiked = async (userId, projectId) => {
  if (!userId) return false;
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

/**
 * Bookmark APIs
 */
export const toggleBookmark = async (userId, projectId) => {
  const { data: existingBookmark } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .single();

  if (existingBookmark) {
    const { error } = await supabase.from('bookmarks').delete().eq('id', existingBookmark.id);
    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase.from('bookmarks').insert([{ user_id: userId, project_id: projectId }]);
    if (error) throw error;
    return true;
  }
};

export const checkIfBookmarked = async (userId, projectId) => {
  if (!userId) return false;
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
};

export const getSavedProjects = async (userId) => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      project_id,
      projects (*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data.map(item => item.projects);
};

/**
 * View Analytics APIs
 */
export const incrementViews = async (projectId) => {
  const { error } = await supabase
    .from('views')
    .insert([{ project_id: projectId }]);
  
  if (error) throw error;
};

export const getViewCount = async (projectId) => {
  const { count, error } = await supabase
    .from('views')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);
  
  if (error) throw error;
  return count || 0;
};
