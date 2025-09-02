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

export async function getById(id_usuario: number): Promise<Usuario> {
  return usuarios.find((u) => u.id_usuario === id_usuario);
}

export async function getOneBy(data: Partial<Usuario>): Promise<Usuario> {
  return usuarios.find((u) => {
    Object.entries(data).every(([key, value]) => u[key] === value);
  });

}
export async function findAll(data: Partial<Usuario>): Promise<Usuario[]> {
  return usuarios.filter((u) =>
    Object.entries(data).every(([key, value]) => u[key] === value)
  );
}
