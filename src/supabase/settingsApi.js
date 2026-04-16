import { supabase } from './client';

export const getActiveTheme = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("active_theme")
    .maybeSingle();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.active_theme || "default";
};

export const updateTheme = async (theme) => {
  console.log("SAVE: Attempting to save theme:", theme);

  // Get the existing row
  const { data: row, error: fetchError } = await supabase
    .from("settings")
    .select("id, active_theme")
    .limit(1)
    .maybeSingle();

  console.log("SAVE: Existing row:", row, "Fetch error:", fetchError);

  if (fetchError) throw new Error(`Fetch failed: ${fetchError.message}`);

  if (row) {
    const { data: updated, error: updateError } = await supabase
      .from("settings")
      .update({ active_theme: theme })
      .eq("id", row.id)
      .select();

    console.log("SAVE: Update result:", updated, "Error:", updateError);
    if (updateError) throw new Error(`Update failed: ${updateError.message}`);
    if (!updated || updated.length === 0) {
      throw new Error("Update ran but no rows were modified. Check Supabase RLS policies for the settings table.");
    }
  } else {
    const { error: insertError } = await supabase
      .from("settings")
      .insert([{ active_theme: theme }]);
    console.log("SAVE: Insert error:", insertError);
    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);
  }

  localStorage.setItem("theme", theme);
  console.log("SAVE: Done. localStorage set to:", theme);
};
