import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function FormComponent({ onNotesClick }) {
  const URL = import.meta.env.VITE_API_URL;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `action=add&Titulo=${title}&Contenido=${content}`,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al enviar la nota");
        }
        return response;
      })
      .then(() => {
        Swal.fire({
          title: `Nota "${title}" agregada correctamente.`,
          icon: "success",
          draggable: true,
        });
        setTitle("");
        setContent("");
        onNotesClick();
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al enviar nota.",
        });
      });
  };

  return (
    <div className="card coupons fixed bottom-0">
      <label className="title bg-gray-100">Agregar Nota</label>
      <form className="form" onSubmit={handleSubmit}>
        <label>Titulo Nota</label>
        <input
          type="text"
          placeholder="Título de la nota"
          className="input_field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          maxLength={50}
        />
        <label>Contenido</label>
        <input
          type="textarea"
          placeholder="Contenido de la nota"
          className="input_field"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          minLength={3}
          maxLength={500}
        />
        <button
          type="submit"
          className="relative bottom-0 flex justify-center items-center gap-2 border border-[#000] rounded-xl text-[#FFF] font-black bg-[#000] uppercase px-8 py-4 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#000] hover:bg-[#FFF] active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 mt-4"
        >
          <span className="truncate eaes-in-out duration-300 group-active:-translate-x-96 group-focus:translate-x-96">
            Agregar
          </span>
          <div className="absolute flex flex-row justify-center items-center gap-2 -translate-x-96 eaes-in-out duration-300 group-active:translate-x-0 group-focus:translate-x-0">
            <div className="animate-spin size-4 border-2 border-[#000] border-t-transparent rounded-full"></div>
            Procesando...
          </div>
          <svg
            className="fill-[#FFF] group-hover:fill-[#000] group-hover:-translate-x-0 group-active:translate-x-96 group-active:duration-0 group-focus:translate-x-96 group-focus:fill-[#000] ease-in-out duration-700"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m476.59 227.05-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52 24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4 24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
}
