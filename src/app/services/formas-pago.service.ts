import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GLOBAL } from './global.service';
import { Observable } from 'rxjs';
import { FormasPago } from '../models/formas-pago.model';

@Injectable()
export class FormasPagoService {
  public url: string;
  public headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  listarPagina(numeroPagina, numeroItems):Observable<any> {
    return this._http.get(this.url + 'formaDePago/listPage?page='+numeroPagina+'&size='+numeroItems+'&sort=id.codigo,asc&query=id.empresa==1',{headers: this.headers});
  }

  listarAlmacenadora(id):Observable<any>{
    return this._http.get(this.url + 'formaDePago/read?empresa=1&codigo='+id);
  }

  eliminarAlmacenadora(id):Observable<any>{
    return this._http.delete(this.url + 'formaDePago/delete?empresa=1&codigo='+id);
  }

  actualizarAlmacenadora(formasPago: FormasPago):Observable<any>{
    var params = JSON.stringify(formasPago)
    return this._http.put(this.url + 'formaDePago/update', params, {headers: this.headers});
  }

  crearAlmacenadora(formasPago: FormasPago):Observable<any>{
    var params = JSON.stringify(formasPago)
    return this._http.post(this.url + 'formaDePago/create', params, {headers: this.headers});
  }
}

