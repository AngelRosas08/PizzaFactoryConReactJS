import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPizzaSlice, faSearch, faUser, faBars, faArrowAltCircleRight, faStar, faPlusCircle, faHeart, faCalendar } from '@fortawesome/free-solid-svg-icons';
import emailjs from '@emailjs/browser'
import imagen from './Assets/pizzaInicio.png'
import imgPedido from './Assets/imgPedido.png'
import imgContact from './Assets/pizzeriaContact.png'
import imgCorreo from './Assets/contactImage.png'
import imgUsers from './Assets/ImgUsers.png'


const AppInicio = () => {

  const [nombreCliente, setNombreCliente] = useState('');
  const [direccionEntrega, setDireccionEntrega] = useState('');
  const [referenciaEntrega, setReferenciaEntrega] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [totalPedido, setTotalPedido] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [nombres, setNombres] = useState([]);
  const [selectedNombre, setSelectedNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [showText, setShowText] = useState(false);
  const [telefonoBuscar, setTelefonoBuscar] = useState('');
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [message, setMessage] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [pendientes, setPendientes] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [dataPar, setDataPar] = useState([]);

  const form = useRef();

  console.log(dataPar);

  useEffect(() => {

    const fetchNombres = async () => {
      try {
        const response = await fetch('http://localhost:3001/api');
        const data = await response.json();
        setNombres(data);
      } catch (error) {
        console.error('Error fetching nombres:', error);
      }
    };
    fetchNombres();

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/ver-ultimos-pedidos');
        const jsonData = await response.json();
        console.log('ssj');
        console.log(jsonData)
        setDataPar(jsonData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();

  }, []);

  const fetchPendientes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ver-pendientes');
      const data = await response.json();
      console.log(data);
      setPendientes(data);
    } catch (error) {
      console.error('Error fetching pendientes:', error);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(nombreCliente);
    console.log(direccionEntrega);
    console.log(referenciaEntrega);
    console.log(telefonoCliente);
    console.log(cantidad * precio);
    console.log(selectedNombre);
    console.log(cantidad);

    try {
      const response = await fetch('http://localhost:3001/api/hacer-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_cliente: nombreCliente,
          direccion_entrega: direccionEntrega,
          referencia_entrega: referenciaEntrega,
          telefono_cliente: telefonoCliente,
          total_pedido: (cantidad * precio),
          producto_id: selectedNombre,
          cantidad: cantidad
        }),
      });

      if (response.ok) {
        console.log('Cliente insertado exitosamente');
        setNombreCliente('');
        setDireccionEntrega('');
        setReferenciaEntrega('');
        setTelefonoCliente('');
        setTotalPedido('');
        selectedNombre('');
        setCantidad('');
      } else {
        console.error('Error al insertar el cliente');
      }
    } catch (error) {
      console.error(error);
    }

    fetchPendientes();

  };

  const fetchPrecio = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/ver-precio/${selectedNombre}`);
      const data = await response.json();
      const precio = data[0].precio;
      setPrecio(precio);
      console.log(precio)
    } catch (error) {
      console.error('Error fetching precio:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/ver-clientes/${telefonoBuscar}`);
      const data = await response.json();

      if (response.ok) {
        const cliente = data[0];
        setNombre(cliente.nombre_cliente);
        setDireccion(cliente.direccion_cliente);
        setReferencia(cliente.referencia_cliente);
      } else {
        setMessage('Error al obtener los datos del cliente');
      }
    } catch (error) {
      setMessage('Error al comunicarse con el servidor');
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/actualizar-cliente/${telefonoBuscar}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_cliente: nombre,
          direccion_cliente: direccion,
          referencia_cliente: referencia,
        }),
      });

      if (response.ok) {
        setMessage(`Cliente ${telefonoBuscar} actualizado exitosamente`);
      } else {
        setMessage('Error al actualizar el cliente');
      }
    } catch (error) {
      setMessage('Error al comunicarse con el servidor');
    }
  };

  const handleClick = (pedidoId) => {
    setPedidoSeleccionado(pedidoId);

    const actualizarPedido = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/actualizar-pedido/${(pedidoId)}`, {
          method: 'PUT'
        });
        if (response.ok) {
          alert('Pedido Actualizado!');
          console.log('Pedido actualizado');
        } else {
          alert('No se pudo actualizar el Pedido.');
        }
      } catch (error) {
        console.error('Error actualizando pedido:', error);
      }
    };

    actualizarPedido();
    fetchPendientes();
  };

  const handlePasswordSubmit = () => {
    const input = document.querySelector('.contraEntregas');
    const password = input.value;

    if (password === 'hola') {
      setShowContent(true);
      fetchPendientes();
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleNombreChange = (event) => {
    setSelectedNombre(event.target.value);

    fetchPrecio();
  };

  const cambiarCantidad = (e) => {
    setCantidad(parseInt(e.target.value))

    fetchPrecio();
  }

  const handleMouseOver = () => {
    setShowText(true);
  };

  const handleMouseOut = () => {
    setShowText(false);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_q19nlbe', 'template_il2i096', form.current, 'qwcyT7lTmIsVr3VTP')
      .then((result) => {
        console.log(result.text);
        alert('Correo enviado satisfactoriamente');
      }, (error) => {
        console.log(error.text);
      });

  };

  return (
    <div>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous"></link>

      <header className="head" id='home'>
        <h1>Pizza&nbsp;<FontAwesomeIcon icon={faPizzaSlice} />&nbsp;Zone</h1>
        <nav className="navbar">
          <a href=".home">Inicio</a>
          <a href="#menu">Menu</a>
          <a href="#pedido">Pedido</a>
          <a href="#usuario">Usuario</a>
          <a href="#entregas">Entregas</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <form action="#" className="search-bar">
          <input type="search" name="search" id="1" placeholder="Search Here" />
        </form>
      </header>

      <section className="home" id='home'>
        <div className="home-content">
          <div className="inner-content">
            <h3>Bienvenido a Pizza&nbsp;<FontAwesomeIcon icon={faPizzaSlice} />&nbsp;Zone</h3>
            <p>Donde ofrecemos deliciosas pizzas artesanales preparadas con ingredientes frescos y de alta calidad. Ven y descubre el auténtico sabor de Italia en cada bocado. ¡Te esperamos con los brazos abiertos!</p>
            <a className='btn' href="#menu" style={{ backgroundColor: 'white' }}>Menu</a>
          </div>
          <div className="inner-content-img">
            <img src={imagen} alt="img" />
          </div>
        </div>
      </section>

      <section className="menu" id="menu">
        <h4>Menu</h4>
        <div className="menu-content">
          {nombres.map((nombre, index) => (
            <div className="in-box" key={index}>
              <button className='btn-outline-success veg-icon' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}></button>
              {showText && <div className="text-overlay">Descripcion: {nombre.descripcion}</div>}
              <img src={`./Assets/${nombre.imagen}`} alt=""></img>
              <div className="in-content">
                <div>
                  <h2>{nombre.nombre_producto}</h2>
                  <div className="price">Precio: {nombre.precio}</div>
                  <button className="btn">
                    <i className="fas fa-plus-circle"></i>
                    <a href="#pedido" className='btn' style={{ backgroundColor: 'white' }}>Hacer pedido</a>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <br /><br />
      <section className="pedido" id="pedido">
        <h4>Haga su pedido</h4>
        <div className='contFormPed'>
          <form className='formPedido' onSubmit={handleSubmit} style={{ marginLeft: '20px' }}>
            <br /><br />
            <label htmlFor="productoId">seleccione su producto:</label><br />
            <select className='selectpicker' value={selectedNombre} onChange={handleNombreChange}>
                <option>Seleccione un producto</option>
              {nombres.map((nombre, index) => {
                return (
                <option key={index} value={nombre.producto_id}>
                  {nombre.nombre_producto}
                </option>)
              })}
            </select>

            <label htmlFor="nombreCliente">Nombre del cliente:</label>
            <input className='form-control' type="text" id="nombreCliente" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required
            />
            <label htmlFor="direccionEntrega">Dirección de entrega:</label>
            <input className='form-control' type="text" id="direccionEntrega" value={direccionEntrega} onChange={(e) => setDireccionEntrega(e.target.value)} required
            />
            <label htmlFor="direccionEntrega">Referencia de entrega:</label>
            <input className='form-control' type="text" id="referenciaEntrega" value={referenciaEntrega} onChange={(e) => setReferenciaEntrega(e.target.value)} required
            />
            <label htmlFor="telefonoCliente">Teléfono del cliente:</label>
            <input className='form-control' type="text" id="telefonoCliente" value={telefonoCliente} onChange={(e) => setTelefonoCliente(e.target.value)} required
            />
            <label htmlFor="cantidad">Cantidad:</label>
            <input className='form-control' type="number" id="cantidad" value={cantidad} onChange={cambiarCantidad} required
            />
            <label htmlFor="totalPedido">Total del pedido:</label>
            <input className='form-control' type="text" id="totalPedido" value={cantidad * precio} onChange={(e) => setTotalPedido(parseFloat(e.target.value))} readonly
            /><br />
            <button className='btn btn-outline-primary' type="submit">Enviar Pedido</button>
          </form>
          <div>
            <img className='imgPedido' src={imgPedido} alt="img" />
          </div>
        </div>
      </section>
      {/* --------------------------------------------------- */}
      <section className="usuario" id="usuario">
        <h4>Ver mis datos / Actualizar Cliente</h4>
        <div className='contFormUsuarios'>
          <div>
            <img src={imgUsers} alt="" />
          </div>
          <form className='formUsuario'>
            <br />
            <input className='form-control' type="text" placeholder="Teléfono" value={telefonoBuscar} onChange={(e) => setTelefonoBuscar(e.target.value)} required />
            <button className='btn btn-outline-primary' onClick={fetchData}>Obtener Datos</button>
            <br /><br />
            <input className='form-control' type="text" placeholder="Nuevo Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <br />
            <input className='form-control' type="text" placeholder="Nueva Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
            <br />
            <input className='form-control' type="text" placeholder="Nueva Referencia" value={referencia} onChange={(e) => setReferencia(e.target.value)} required />
            <button className='btn btn-outline-primary' onClick={handleUpdate} >Actualizar Cliente</button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </section>


      {/* ----------------------------------------------------------------------------------------- */}
      <section className="entregas" id="entregas">
        <h4>Entregas pendientes</h4>
        <div>
          <h2>Ingrese la contraseña de acceso</h2><br />
          <div className="about-sec">
            <input className='contraEntregas form-control' type="password" placeholder='*********' style={{ width: '250px', marginLeft: '350px' }} />
            <button className='btn-outline-primary' onClick={handlePasswordSubmit} style={{ height: '35', width: '100px', marginLeft: '10px' }}>Enviar</button><br />
          </div>

          {showContent && (
            <div>
              <table className='table table-striped table-bordered'>
                <thead>
                  <tr>
                    <th>Nombre del Cliente</th>
                    <th>Dirección de Entrega</th>
                    <th>Referencia de Entrega</th>
                    <th>Teléfono del Cliente</th>
                    <th>Total</th>
                    <th>Hecho</th>
                  </tr>
                </thead>
                <tbody>
                  {pendientes.map(pedido => (
                    <tr key={pedido.pedido_id}>
                      <td><input type="text" value={pedido.nombre_cliente} /></td>
                      <td><input type="text" value={pedido.direccion_entrega} /></td>
                      <td><input type="text" value={pedido.referencia_entrega} style={{ width: '100%' }} /></td>
                      <td><input type="text" value={pedido.telefono_cliente} /></td>
                      <td><input type="text" value={pedido.total_pedido} style={{ width: '50%' }} /></td>
                      <td><button
                        className='btn-outline-primary'
                        onClick={() => handleClick(pedido.pedido_id)}
                        disabled={pedidoSeleccionado === pedido.pedido_id}
                        style={{ width: '20px', height: '20px' }}
                      >
                        OK
                      </button></td>
                    </tr>
                  ))}
                  {pedidoSeleccionado}
                </tbody>
              </table>
              <div>
            <h1>Últimos pedidos:</h1>
            <div className='contRecient'>
              {dataPar.map((pedido) => (
                <div key={pedido.pedido_id} className='contInfoRecent'>
                  <p style={{color: 'black'}}>Cliente: {pedido.nombre_cliente}</p>
                  <p style={{color: 'black'}}>Fecha: {pedido.fecha_pedido}</p>
                  <p style={{color: 'black'}}>Dirección: {pedido.direccion_entrega}</p>
                </div>
              ))}
            </div>
          </div>
            </div>
          )}
        </div>
      </section>
      {/* ----------------------------------------------------------------------------------------- */}
      <section className="about" id="about">
        <h4>Acerca de nosotros</h4>
        <div className="about-sec">
          <div className="about-content">
            <h3>Pizza Zone</h3>
            <p>Valoramos la calidad, la pasión y la autenticidad. Nos esforzamos por ofrecerte un lugar donde puedas deleitar tu paladar con nuestras deliciosas pizzas artesanales y disfrutar de un ambiente acogedor que te haga sentir como en casa. Nuestro objetivo es brindarte una experiencia gastronómica excepcional que perdure en tu memoria. ¡Te invitamos a vivir el verdadero valor de nuestro establecimiento con cada bocado!</p>
            <div className="about-inner">
              <h5><FontAwesomeIcon icon={faArrowAltCircleRight} />Buena calidad</h5>
              <h5><FontAwesomeIcon icon={faArrowAltCircleRight} />Vegetles frescos</h5>
              <h5><FontAwesomeIcon icon={faArrowAltCircleRight} />Disponibles 24/7</h5>
              <h5><FontAwesomeIcon icon={faArrowAltCircleRight} />Mejor precio</h5>
              <h5><FontAwesomeIcon icon={faArrowAltCircleRight} />Mejor calidad</h5>
            </div>
          </div>
          <div className="img">
            <img src={imgContact} alt="img" />
          </div>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-sec">
          <div className="contact-inner">
            <div className="contact-inner-col">
              <img src={imgCorreo} alt="img" className="image" />
            </div>
            <div className="contact-inner-col">
              <h1>Contactanos&nbsp;<i className="fas fa-paper-plane"></i></h1>
              <p>San Felipe Coamango, Chapa de Mota, Estado de México</p>
              <p>Queremos saber de ti, escríbenos:</p>
              <form ref={form} onSubmit={sendEmail}>
                <input type="text" name="name" id="" placeholder="Ingrese su nombre" required />
                <input type="email" name="email" id="" placeholder="Ingrese su correo electronico" required />
                <input type="text" name="subject" id="" placeholder="Por favor ingrese un asunto" required />
                <textarea name="message" id="" cols="10" rows="8" placeholder='ingrese aqui su mensaje'></textarea>
                <button className="btn">Submit</button>
              </form>
            </div>
          </div>
          <div className="map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d469.0260124032061!2d-99.61080391488353!3d19.873432874110655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d247cd365a85d7%3A0x64622bed39e47587!2sAlex%20Pizza!5e0!3m2!1ses-419!2smx!4v1687108834896!5m2!1ses-419!2smx"
              width="100%" height="250" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
          </div>
          <div className="copyright">
            <p>Design By&copy; Knowledge Place KP</p>
            <div className="social">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-pinterest"></i>
              <i className="fab fa-google-plus"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppInicio;