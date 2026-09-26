import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";

import { Tarea } from "../../types/tarea";

import {
  obtenerTareas,
  agregarTarea,
  actualizarTarea,
} from "../../services/tareas";

export default function Tareas() {

  const [tareas, setTareas] = useState<Tarea[]>([]);

  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [responsable, setResponsable] = useState("");

  const [editando, setEditando] = useState<number | null>(null);

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);


  // CARGAR TAREAS
  useEffect(() => {
    cargarTareas();
  }, []);


  const cargarTareas = async () => {

    try {

      const data = await obtenerTareas();

      setTareas(data);

    } catch (error) {

      console.log("Error:", error);

    }
  };


  // LIMPIAR FORMULARIO
  const limpiarFormulario = () => {

    setNombre("");
    setFecha("");
    setResponsable("");

    setEditando(null);

    setMostrarFormulario(false);
  };


  // GUARDAR TAREA
  const guardarTarea = async () => {

  console.log("BOTÓN GUARDAR PRESIONADO");

  if (
    nombre.trim() === "" ||
    fecha.trim() === "" ||
    responsable.trim() === ""
  ) {

    Alert.alert(
      "Campos incompletos",
      "Debes llenar todos los campos."
    );

    return;
  }

  try {

    const tarea = {
      nombre: nombre.trim(),
      fecha: fecha.trim(),
      responsable: responsable.trim(),
    };

    console.log("TAREA A GUARDAR:", tarea);

    if (editando !== null) {

      await actualizarTarea(
        editando,
        tarea
      );

      Alert.alert(
        "Correcto",
        "Tarea actualizada correctamente."
      );

    } else {

      await agregarTarea(tarea);

      Alert.alert(
        "Correcto",
        "Tarea guardada correctamente."
      );
    }

    limpiarFormulario();

    await cargarTareas();

  } catch (error: any) {

    console.log("ERROR AL GUARDAR:", error);

    Alert.alert(
      "Error",
      error?.message || "Ocurrió un error al guardar."
    );
  }
};

  // EDITAR
  const editar = (tarea: Tarea) => {

    setNombre(tarea.nombre);
    setFecha(tarea.fecha);
    setResponsable(tarea.responsable);

    setEditando(tarea.id);

    setMostrarFormulario(true);
  };


  


  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        LISTA DE TAREAS
      </Text>


      {/* BOTÓN NUEVA TAREA */}

      {!mostrarFormulario && (

        <TouchableOpacity
          style={styles.botonNueva}
          onPress={() => setMostrarFormulario(true)}
        >

          <Text style={styles.textoBoton}>
            + Nueva tarea
          </Text>

        </TouchableOpacity>

      )}


      {/* FORMULARIO */}

      {mostrarFormulario && (

        <View style={styles.formulario}>

          <Text style={styles.subtitulo}>
            {editando !== null
              ? "Editar tarea"
              : "Nueva tarea"}
          </Text>


          <TextInput
            style={styles.input}
            placeholder="Nombre de la tarea"
            value={nombre}
            onChangeText={setNombre}
          />


          <TextInput
            style={styles.input}
            placeholder="Fecha (AAAA-MM-DD)"
            value={fecha}
            onChangeText={setFecha}
          />


          <TextInput
            style={styles.input}
            placeholder="Responsable"
            value={responsable}
            onChangeText={setResponsable}
          />


          <View style={styles.filaBotones}>

            <TouchableOpacity
              style={styles.botonGuardar}
              onPress={guardarTarea}
            >

              <Text style={styles.textoBoton}>
                {editando !== null
                  ? "Actualizar"
                  : "Guardar"}
              </Text>

            </TouchableOpacity>


            <TouchableOpacity
              style={styles.botonCancelar}
              onPress={limpiarFormulario}
            >

              <Text style={styles.textoBoton}>
                Cancelar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      )}


      {/* LISTA */}

      <FlatList
        data={tareas}

        keyExtractor={(item) =>
          item.id.toString()
        }

        renderItem={({ item }) => (

          <View style={styles.tarea}>

            <View style={styles.informacion}>

              <Text style={styles.nombre}>
                {item.nombre}
              </Text>

              <Text>
                Fecha: {item.fecha}
              </Text>

              <Text>
                Responsable: {item.responsable}
              </Text>

            </View>


            <View style={styles.botones}>

              <TouchableOpacity
                style={styles.botonEditar}
                onPress={() => editar(item)}
              >

                <Text style={styles.textoBoton}>
                  Editar
                </Text>

              </TouchableOpacity>


              

            </View>

          </View>

        )}
      />

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1f1e1e",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#ffffff",
    marginLeft: 530,
  },

  botonNueva: {
    backgroundColor: "#1976d2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  formulario: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },

  filaBotones: {
    flexDirection: "row",
    gap: 10,
  },

  botonGuardar: {
    backgroundColor: "#1976d2",
    padding: 10,
    borderRadius: 6,
    flex: 1,
  },

  botonCancelar: {
    backgroundColor: "#757575",
    padding: 10,
    borderRadius: 6,
    flex: 1,
  },

  tarea: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  informacion: {
    flex: 1,
  },

  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  botones: {
    marginLeft: 10,
    gap: 5,
  },

  botonEditar: {
    backgroundColor: "#388e3c",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  botonEliminar: {
    backgroundColor: "#d32f2f",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  textoBoton: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

});