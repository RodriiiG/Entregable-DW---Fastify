import { Usuario } from "../model/usuarios-model.ts";

const usuarios: Usuario[] = [
  { id_usuario: 1, nombre: "Jorge", isAdmin: true },
  { id_usuario: 2, nombre: "Rodrigo", isAdmin: false },
  { id_usuario: 3, nombre: "Gastón", isAdmin: false },
];

let ultimoId = usuarios.length + 1;

export async function getAll(): Promise<Usuario[]> {
  return usuarios;
}

export async function getById(id_usuario: number): Promise<Usuario | undefined> {
  return usuarios.find((u) => u.id_usuario === id_usuario);
}

export async function getOneBy(data: Partial<Usuario>): Promise<Usuario | undefined> {
  return usuarios.find((u) => {
    Object.entries(data).every(([key, value]) => u[key] === value);
  });
}
export async function findAll(data: Partial<Usuario>): Promise<Usuario[]> {
  return usuarios.filter((u) =>
    Object.entries(data).every(([key, value]) => u[key] === value)
  );
}

export async function create(
  data: Omit<Usuario, "id_usuario">
): Promise<Usuario> {
  const usuarioNuevo: Usuario = {
    id_usuario: ultimoId++,
    nombre: data.nombre,
    isAdmin: data.isAdmin,
  };
  usuarios.push(usuarioNuevo);
  return usuarioNuevo;
}

export async function erase(id_usuario: number): Promise<void | boolean> {
  const index = usuarios.findIndex((u) => u.id_usuario == id_usuario);
  if (index === -1) return true;
  usuarios.splice(index, 1);
  return false;
}

export async function update(id_usuario: number, data: Partial<Usuario>) : Promise<Usuario | undefined>{
  const usuario = await getById(id_usuario)
  if(usuario){
    if(data.nombre){
      usuario.nombre=data.nombre;
    };
    if(data.isAdmin){
      usuario.isAdmin=data.isAdmin;
    };
    return usuario;
  }
  return;
}
