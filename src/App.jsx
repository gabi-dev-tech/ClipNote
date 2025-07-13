import React, { useEffect, useState } from "react";
import { HiOutlineAnnotation } from "react-icons/hi";
import { CgCloseO } from "react-icons/cg";
import Loader from "./components/Loader";
import Swal from "sweetalert2";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import FormComponent from "./components/FormComponent";

export default function App() {
  const URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
 

  const getNotes = () => {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const rows = data.slice(1);
        setData(rows);
      })
      .catch((error) => console.error("Error al cargar los datos", error));
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
    <div className="flex flex-col justify-center items-center gap-4">
      <div>
        <div className="text font-mono text-4xl font-extrabold tracking-wide">
          ClipNote...
        </div>
      </div>
      <div className="master-container max-h-[36rem] md:max-h-[22rem]">
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
      </div>
      <FormComponent onNotesClick={getNotes} />
    </div>
  );
}
