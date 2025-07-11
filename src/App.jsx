import React, { useEffect, useState } from "react";
import { HiOutlineAnnotation } from "react-icons/hi";
import { CgCloseO } from "react-icons/cg";
import Loader from "./components/Loader";

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
        alert("Nota agregada correctamente");
        setTitle("");
        setContent("");
        getNotes();
      })
      .catch((error) => {
        console.error(error);
        alert("Hubo un error al enviar la nota");
      });
  };

  const handleDelete = (titleDelete) => {
    console.log(
      "encodeURIComponent(titleDelete)",
      encodeURIComponent(titleDelete)
    );
    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=delete&Titulo=${encodeURIComponent(titleDelete)}`,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al eliminar la nota");
        }
        return response;
      })
      .then(() => {
        getNotes();
        alert("Se elimino la Nota!");
      })
      .catch((error) => {
        alert("Error al eliminar");
        console.error(error);
      });
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h1 className="font-mono text-2xl">ClipNote</h1>
      <div className="master-container">
        {data.length > 0 ? (
          data.map((el, index) => {
            return (
              <div key={index} className="card cart">
                <div className="flex flex-row justify-between">
                  <label className="title"> {`Nota ${index + 1}`} </label>
                  <button className="mr-4" onClick={() => handleDelete(el[0])}>
                    <CgCloseO />
                  </button>
                </div>

                <div className="products">
                  <div className="product">
                    <HiOutlineAnnotation size={50} />
                    <div>
                      <span> {el[0]} </span>
                      <p> {el[1]} </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Loader />
        )}

        <div className="card coupons">
          <label className="title">Agregar Nota</label>
          <form className="form" onSubmit={handleSubmit}>
            <label>Titulo Nota</label>
            <input
              type="text"
              placeholder="Título de la nota"
              className="input_field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label>Contenido</label>
            <input
              type="textarea"
              placeholder="Contenido de la nota"
              className="input_field"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button>Agregar</button>
          </form>
        </div>

        {/* <div class="card checkout">
          <label class="title">Checkout</label>
          <div class="details">
            <span>Your cart subtotal:</span>
            <span>47.99$</span>
            <span>Discount through applied coupons:</span>
            <span>3.99$</span>
            <span>Shipping fees:</span>
            <span>4.99$</span>
          </div>
          <div class="checkout--footer">
            <label class="price">
              <sup>$</sup>57.99
            </label>
            <button class="checkout-btn">Checkout</button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
