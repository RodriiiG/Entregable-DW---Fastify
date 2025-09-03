import { Type } from "@sinclair/typebox";
import { Usuario } from "../model/usuarios-model.ts";
import { get } from "http";

const usuarios: Usuario[] = [
  { id_usuario: 1, nombre: "Jorge", isAdmin: true },
  { id_usuario: 2, nombre: "Rodrigo", isAdmin: false },
  { id_usuario: 3, nombre: "Gastón", isAdmin: false },
];

let ultimoId = usuarios.length + 1;

export async function getAll(): Promise<Usuario[]> {
  return usuarios;
}

export async function getByID(
  id_usuario: number
): Promise<Usuario | undefined> {
  return usuarios.find((u) => u.id_usuario == id_usuario);
}

export async function getOneBy(
  data: Omit<Usuario, "isAdmin" | "id_usuario">
): Promise<Usuario[]> {
  if (data && data.nombre) {
    const usuario = usuarios.find((u) => u.nombre === data.nombre);
    return usuario ? [usuario] : [];
  }
  return usuarios;
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

export default { erase, getAll, getByID, create };
