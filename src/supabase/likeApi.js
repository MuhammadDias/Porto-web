import { supabase } from './client';

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

export const getLikeCount = async (projectId) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);
  
  if (error) throw error;
  return count || 0;
};

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
