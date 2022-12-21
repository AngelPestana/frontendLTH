import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Codificar } from 'src/app/helpers/Codificar';
import { Bateria } from 'src/app/models/Bateria';
import { Cliente } from 'src/app/models/Cliente';
import { Details } from 'src/app/models/Details';
import { BateriaService } from 'src/app/services/bateria.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { PedidoService } from 'src/app/services/pedido.service';
import Swal from 'sweetalert2';
import { PedidoPorBateria } from '../../models/PedidoPorBateria';
import { Pedido } from '../../models/Pedido';

@Component({
  selector: 'app-pedidos-gestion',
  templateUrl: './pedidos-gestion.component.html',
  styleUrls: ['./pedidos-gestion.component.css']
})
export class PedidosGestionComponent implements OnInit {

  formBusqueda1: any;
  formBusqueda2: any;
  formPedido: any;
  idCliente = 0;
  pedidoPorBateria: PedidoPorBateria[] = [];
  contador = 0;
  total = 0;
  agente = 'Miguel Angel Pestaña Villalana';
  //precioCliente: any;
  //GetSubscription: Subscription | any;
  estaBuscando = false;
  buscar = '';
  urlBaseBusqueda = 'http://localhost:8080/api/clientes/search';
  urlBase = 'http://localhost:8080/api/clientes';
  url = 'http://localhost:8080/api/clientes';
  clientes: Cliente[] = [];
  cliente: Cliente | any;
  details1: Details | any;//por objeto
  numbers: number[] = [];
  GetSubscriptions: Subscription | any;
  paso1: boolean = false;
  paso2: boolean = false;
  // atributos para la bateria
  estaBuscando2 = false;
  buscar2 = '';
  urlBaseBusqueda2 = 'http://localhost:8080/api/baterias/search';
  urlBase2 = 'http://localhost:8080/api/baterias';
  url2 = 'http://localhost:8080/api/baterias';
  baterias: Bateria[] = [];
  details2: Details | any;//por objeto
  numbers2: number[] = [];
  GetSubscriptions2: Subscription | any;

  GetSubscriptions3: Subscription | any;
  PostSubscription: Subscription | any;
  PostSubscriptions: Subscription | any;

  constructor(private service: ClienteService, private service2: BateriaService, private service3: PedidoService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerBaterias();
    this.formulariosReactivos();
    this.service3.vaciarPedido();//Vaciamos el pedido en caso de navegacion a otras pestañas en el momento de agregar baterias
    this.contador = 0;//reiniciamos el contador
    //console.log(this.precioCliente);
    //console.log(this.formListClientControl.busqueda1.value);
  }

  formulariosReactivos(): void {
    this.formBusqueda1 = new FormGroup({
      busqueda1: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
    });
    this.formBusqueda2 = new FormGroup({
      busqueda2: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
    });
    this.formPedido = new FormGroup({
      fecha: new FormControl('', [
        Validators.required
      ]),
      condiciones: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9 ]{3,45}'),
        Validators.minLength(3),
        Validators.maxLength(45)
      ])
    });
    //console.log(this.formulario);
  }

  obtenerClientesBase() {
    this.formBusqueda1.reset();//Borramos el campo de busqueda
    this.estaBuscando = false;//Indicamos que no esta buscando para formatear la paginacion
    this.spinner.show();//Mostramos el loading
    this.GetSubscriptions = this.service.getClientes().subscribe((res: any) => {
      this.clientes = res.clientes;
      this.details1 = res.getDetails;
      //console.log(this.clientes);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar();
      this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  obtenerClientes() {
    this.spinner.show();//Mostramos el loading
    //console.log(this.url)
    this.GetSubscriptions = this.service.getClientes2(this.url).subscribe((res: any) => {
      this.clientes = res.clientes;
      this.details1 = res.getDetails;
      //console.log(this.clientes);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar();
      this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  obtenerBateriasBase() {
    this.estaBuscando2 = false;
    this.formBusqueda2.reset();
    this.spinner.show();//Mostramos el loading
    this.GetSubscriptions2 = this.service2.getBaterias().subscribe((res: any) => {
      this.baterias = res.baterias;
      this.details2 = res.getDetails;
      //console.log(this.baterias);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar2();
      this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  obtenerBaterias() {
    this.spinner.show();//Mostramos el loading
    //console.log(this.url)
    this.GetSubscriptions2 = this.service2.getBaterias2(this.url2).subscribe((res: any) => {
      this.baterias = res.baterias;
      this.details2 = res.getDetails;
      //console.log(this.baterias);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar2();
      this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  mostrarOtrosBaterias(otroUrl: string) {
    //console.log(otroUrl);
    this.url2 = otroUrl;
    //console.log(this.url);
    this.obtenerBaterias();
  }

  mostrarOtrosBaterias2(otroUrl: string) {//para el boton de busqueda
    //console.log(otroUrl);
    this.estaBuscando2 = true;
    let diagonalQuitado = Codificar.codificarDiagonal(this.formControlBusqueda2.busqueda2.value);
    //console.log(diagonalQuitado);
    this.buscar2 = diagonalQuitado;
    this.url2 = otroUrl + '/' + diagonalQuitado;
    this.obtenerBaterias();
  }

  paginaActiva2(currentpage: number, numero: number): string {
    if (currentpage == numero) {
      return "active"
    }
    return ""
  }
  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  contar() {// paginacion para los clientes
    this.numbers = [];
    for (let i = 1; i <= this.details1.pageCount; i++) {
      this.numbers.push(i);
    }
  }

  contar2() {// paginacion para las baterias
    this.numbers2 = [];
    for (let i = 1; i <= this.details2.pageCount; i++) {
      this.numbers2.push(i);
    }
  }

  mensajeError2(mensaje: string) {//En caso que para consultar los datos de la tabla salga con error entonces que muestre este alert
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigate(['/home']);//Para que me rediriga a la pagina de inicio
      }
    })
  }

  mostrarOtrosClientes(otroUrl: string) {//para la paginacion
    this.url = otroUrl;
    this.obtenerClientes();
  }

  mostrarOtrosClientes2(otroUrl: string) {//para el boton de busqueda
    this.estaBuscando = true;
    this.buscar = this.formControlBusqueda1.busqueda1.value;//esta variable nos sirve para que la paginacion en caso de busqueda
    //mandemos el valor que queremos buscar y asi mismo realizar la paginacion
    this.url = otroUrl + '/' + this.formControlBusqueda1.busqueda1.value;
    this.obtenerClientes();
  }

  mensajeError(mensaje: string) {//este mensaje es para el crud en caso de error
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
  }

  paginaActiva(currentpage: number, numero: number): string {// colorcito de pagina activa en lista de clientes
    if (currentpage == numero) {
      return "active"
    }
    return ""
  }

  mensajeExito(mensaje: string) {//este mensaje es para el crud en caso de exito
    Swal.fire({
      icon: 'success',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      this.router.navigate(['/pedidos']);//redirigir a la pagina de pedidos
    })
  }

  establecerIdCliente(idCliente: number | any): void {
    this.idCliente = idCliente;
  }

  paso1Completado(): void {
    this.paso1 = true;
  }

  agregarAlPedido(idBateria: number, cantidad: number): void {
    //Aqui ME QUEDE
    this.spinner.show();
    this.GetSubscriptions3 = this.service2.getPedidoPorCliente(this.idCliente, idBateria, cantidad).subscribe((res: any) => {
      let pedidoPorBateria = new PedidoPorBateria();
      pedidoPorBateria = res;
      this.service3.agregarBateriaAlPedido(pedidoPorBateria);
      this.contador = this.service3.obtenerContador();
      this.obtenerPedidoPorBaterias();
      this.cerrarLoading();
    }, (error: any) => {
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
      this.cerrarLoading();
    })
    //pedidoPorBateria.
  }

  async obtenerCantidad(idBateria: number | any): Promise<void> {
    const { value: cantidad } = await Swal.fire({
      title: 'Introduzca la cantidad',
      input: 'number',
      text: 'La cantidad debe ser valida y no debe ser mayor a 5 digitos',
      inputPlaceholder: 'Cantidad',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false
    })

    let regex = /^[0-9]{1,5}$/;//Expresion regular para validar la cantidad
    let validado = regex.test(cantidad);
    //console.log(regex.test(cantidad));
    //console.log(resultado);
    //console.log(cantidad);

    if (validado == true && cantidad != 0) {//paso la validacion pero tambien se tiene que pedir un valor distinto de 0
      this.agregarAlPedido(idBateria, cantidad);
    } else if (cantidad != undefined) {//en caso de no entrar en esta condicion, significa que dio clic en cancelar
      Swal.fire({
        icon: 'error',
        title: 'Cantidad Invalida',
        text: 'Favor de intentar nuevamente!'
      })
    }
  }

  checarIdCliente(): boolean {
    if (this.idCliente == 0) {
      return true;
    }
    return false;
  }

  regresarPaso1(): void {
    this.idCliente = 0;
    this.paso1 = false;
    this.service3.vaciarPedido();
    this.contador = 0;//reiniciamos contador porque regreso al paso 1 este valor es el atributo que se muestra en la vista por eso en necesario reiniciarlo directamente
    this.pedidoPorBateria = [];//reiniciamos el arreglo porque se regreso al paso 1 este valor es el atributo que se muestra en la vista por eso en necesario reiniciarlo directamente 
  }

  checarId(idBateria: number | any): boolean {
    //Obtenemos las baterias del servicio y comparamos con los ids agregados
    let baterias = this.service3.obtenerBateriasAlPedido();
    //usamos un foreach para iterar sobre los productos agregados en el arreglo e identificar si existe el id relacionado
    for (let i = 0; i < baterias.length; i++) {
      if (baterias[i]['idBateria'] == idBateria) {
        //si esto es verdad, entonces desactivame el boton
        return true;
      }
    }
    return false;
  }

  obtenerPedidoPorBaterias(): void {
    this.pedidoPorBateria = this.service3.obtenerBateriasAlPedido();
  }

  eliminarPPB(ppb: PedidoPorBateria): void {
    this.service3.eliminarBateriaAlPedido(ppb);
    this.contador = this.service3.obtenerContador();
  }

  paso2Completado(): void {
    this.paso2 = true;
    this.total = this.service3.obtenerTotalDelPedido();
  }

  checarPedido(): boolean {
    if (this.pedidoPorBateria.length == 0) {
      return true;
    }
    return false;
  }

  regresarPaso2(): void {
    this.paso2 = false;
    this.formPedido.reset();
  }

  preguntarAntesCrear(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success me-3',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Esta seguro?',
      text: "Esta a punto de crear un pedido, si no esta seguro aun puede confirmar, esto no se podrá editar despues",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, crear pedido!!',
      cancelButtonText: 'No, cancelar!!',
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.crearPedido();
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) { }
    })
  }

  crearPedido(): void {
    //console.log('Ya quieres crear pedido prro!!!')
    let pedido = new Pedido();
    pedido.idCliente = this.idCliente;
    pedido.totalSinDescuento = this.service3.obtenerTotalSinDescuento();
    pedido.totalDescuento = this.service3.obtenerTotalDescuento();
    pedido.totalConDescuento = this.service3.obtenerTotalConDescuento();
    pedido.totalMasCasco = this.service3.obtenerTotalDelPedido();
    pedido.condiciones = this.formControlPedido.condiciones.value;
    pedido.agente = this.agente;
    pedido.fecha = this.formControlPedido.fecha.value;

    this.spinner.show();
    this.PostSubscription = this.service3.postPedido(pedido).subscribe((res: any) => {
      let idPedido = res.id;
      console.log("Se agrego pedido esperando..");
      this.agregarBaterias(idPedido);
      console.log('termino el metodo agregaragregarBaterias2')
    }, (error: any) => {
      this.cerrarLoading();
      //console.log(error);
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError(mensajeError);
    });
  }

  /*async agregarBaterias(idPedido: string) {
    this.callerFun();
    let promises = this.pedidoPorBateria.map((ppb) => {
      ppb.idPedido = idPedido;
      this.PostSubscriptions = this.service3.postPedidoPorBateria(ppb).subscribe((res: any) => {
        console.log('todo bien!!');
      });
    });
    await Promise.all(promises).then((res: any) => {
      console.log(promises);
    });
  }*/

  agregarBaterias(idPedido: string) {
      //here our function should be implemented 
      let cont = 0;
      this.pedidoPorBateria.map((ppb) => {
        ppb.idPedido = idPedido;
        console.log('map corriendo');
        this.PostSubscriptions = this.service3.postPedidoPorBateria(ppb).subscribe(async (res: any) => {
          cont++;
          console.log('todo bien!!');
          await this.checarSiTermino(cont);
        });
      });

    }
    
    checarSiTermino(cont: number): void {
      console.log('contador: ' + cont);
      console.log('contador del pedido: ' + this.contador);
      if(this.contador == cont){
        this.cerrarLoading();
        let mensaje = 'Se creó el pedido con exito!!';
        this.mensajeExito(mensaje);
      }
    }

  /*async agregarBaterias2(idPedido: string) {
    let promises = this.pedidoPorBateria.map(async(ppb) => {
      ppb.idPedido = idPedido;
      this.PostSubscriptions = this.service3.postPedidoPorBateria(ppb).subscribe((res: any) => {
        await if(res){
          
        }
      });
    });
    Promise.all(promises).then(res => {
      console.log('acabo el map');
    });
  }*/

  get formControlBusqueda1() {//NO borrar
    return this.formBusqueda1.controls;
  }

  get formControlBusqueda2() {//NO borrar
    return this.formBusqueda2.controls;
  }

  get formControlPedido() {
    return this.formPedido.controls;
  }

  ngOnDestroy(): void {
    this.GetSubscriptions.unsubscribe();
    this.GetSubscriptions2.unsubscribe();
    if (this.GetSubscriptions3 != null || this.GetSubscriptions3 != undefined) {
      this.GetSubscriptions3.unsubscribe();
      //console.log('se elimino el get edit')
    }

    if (this.PostSubscription != null || this.PostSubscription != undefined) {
      this.PostSubscription.unsubscribe();
      //console.log('se elimino el post')
    }

    if (this.PostSubscriptions != null || this.PostSubscriptions != undefined) {
      this.PostSubscriptions.unsubscribe();
      //console.log('se elimino el post')
    }
    //console.log('Hola se ejecuto el ngOnDestroy')
  }


}
