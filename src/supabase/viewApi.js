import { supabase } from './client';

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

export const getTotalViews = async () => {
    const { count, error } = await supabase
      .from('views')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
};
