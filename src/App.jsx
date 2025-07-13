import React, { useEffect, useState } from "react";
import { HiOutlineAnnotation } from "react-icons/hi";
import { CgCloseO } from "react-icons/cg";
import Loader from "./components/Loader";
import Swal from "sweetalert2";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function App() {
  const URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const getNotes = () => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const rows = data.slice(1);
        setData(rows);
      })
      .catch((error) => console.error("Error al cargar los datos", error));
  };

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
      .then((data) => {
        Swal.fire({
          title: "Nota agregada correctamente.",
          icon: "success",
          draggable: true,
        });
        setTitle("");
        setContent("");
        getNotes();
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al enviar nota.",
          // footer: '<a href="#">Why do I have this issue?</a>',
        });
      });
  };

  const handleDelete = (titleDelete) => {
    Swal.fire({
      title: "Estas seguro?",
      text: "No puedes revertir estos cambios!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d63030ff",
      cancelButtonColor: "#000000",
      confirmButtonText: "Si, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado!",
          text: "La nota a sido eliminada",
          icon: "success",
        });
        fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `action=delete&ID=${titleDelete}`,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Error al eliminar la nota");
            }
            return response;
          })
          .then(() => {
            setData([]);
            getNotes();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error al Eliminar",
              // footer: '<a href="#">Why do I have this issue?</a>',
            });
            console.error(error);
          });
      }
    });
  };

  // Función para reordenar el array según el drag
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Callback que se ejecuta al terminar el drag
  const onDragEnd = (result) => {
    const { source, destination } = result;
    // Si no hay destino (drop fuera del droppable), no hacer nada
    if (!destination) return;
    // Si la posición no cambió, no hacer nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    // Reordenar el array con la función reorder
    const newData = reorder(data, source.index, destination.index);
    // Actualizar el estado con el nuevo orden
    setData(newData);
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div class="typing-animation-container">
        <span class="typing font-mono text-4xl font-extrabold mt-4">ClipNote</span>
      </div>
      <div className="master-container">
        {data.length > 0 ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="data">
              {(droppableProvider) => (
                <div
                  ref={droppableProvider.innerRef}
                  {...droppableProvider.droppableProps}
                >
                  {data.map((el, index) => {
                    return (
                      <Draggable
                        index={index}
                        key={el[0]}
                        draggableId={el[0].toString()}
                      >
                        {(draggableProvider) => (
                          <div
                            ref={draggableProvider.innerRef}
                            {...draggableProvider.draggableProps}
                            {...draggableProvider.dragHandleProps}
                            className="card cart"
                          >
                            <div className="flex flex-row justify-between">
                              <label className="title">{`Nota ${
                                index + 1
                              }`}</label>
                              <button
                                className="mr-4"
                                onClick={() => handleDelete(el[0])}
                              >
                                <CgCloseO />
                              </button>
                            </div>

                            <div className="products">
                              <div className="product">
                                <HiOutlineAnnotation size={50} />
                                <div>
                                  <span>{el[1]}</span>
                                  <p>{el[2]}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {droppableProvider.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <Loader />
        )}

        <div className="card coupons">
          {/*---> fixed bottom-0 */}
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
              maxLength={50}
            />
            <button
              type="submit"
              class="relative bottom-0 flex justify-center items-center gap-2 border border-[#000] rounded-xl text-[#FFF] font-black bg-[#000] uppercase px-8 py-4 z-10 overflow-hidden ease-in-out duration-700 group hover:text-[#000] hover:bg-[#FFF] active:scale-95 active:duration-0 focus:bg-[#FFF] focus:text-[#000] isolation-auto before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-[#FFF] before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 mt-4"
            >
              <span class="truncate eaes-in-out duration-300 group-active:-translate-x-96 group-focus:translate-x-96">
                Agregar
              </span>
              <div class="absolute flex flex-row justify-center items-center gap-2 -translate-x-96 eaes-in-out duration-300 group-active:translate-x-0 group-focus:translate-x-0">
                <div class="animate-spin size-4 border-2 border-[#000] border-t-transparent rounded-full"></div>
                Procesando...
              </div>
              <svg
                class="fill-[#FFF] group-hover:fill-[#000] group-hover:-translate-x-0 group-active:translate-x-96 group-active:duration-0 group-focus:translate-x-96 group-focus:fill-[#000] ease-in-out duration-700"
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
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
      </div>
    </div>
  );
}
