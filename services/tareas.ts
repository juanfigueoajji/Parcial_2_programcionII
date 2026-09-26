import { supabase } from "../lib/supabase";
import { Tarea } from "../types/tarea";

export const obtenerTareas = async (): Promise<Tarea[]> => {

  const { data, error } = await supabase
    .from("tareas")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log("ERROR AL OBTENER:", error);
    throw error;
  }

  return data as Tarea[];
};


export const agregarTarea = async (
  tarea: Omit<Tarea, "id">
) => {

  console.log("1. ENTRÓ A AGREGAR TAREA");
  console.log("2. DATOS:", tarea);

  const { data, error } = await supabase
    .from("tareas")
    .insert([tarea])
    .select();

  console.log("3. RESPUESTA SUPABASE");
  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Supabase no devolvió la tarea insertada.");
  }

  return data;
};


export const actualizarTarea = async (
  id: number,
  tarea: Omit<Tarea, "id">
) => {

  const { data, error } = await supabase
    .from("tareas")
    .update(tarea)
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
};


