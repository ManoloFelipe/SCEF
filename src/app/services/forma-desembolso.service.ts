import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GLOBAL } from './global.service';
import { Observable } from 'rxjs';
import { FormaDesembolso } from '../models/forma-desembolso.model';

@Injectable()
export class FormaDesembolsoService {
  public url: string;
  public headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  listarPagina(numeroPagina, numeroItems):Observable<any> {
    return this._http.get(this.url + 'formaDesembolso/listPage?page='+numeroPagina+'&size='+numeroItems+'&sort=id.codigo,asc&query=id.empresa==1',{headers: this.headers});
  }

  listarFormaDes(id):Observable<any>{
    return this._http.get(this.url + 'formaDesembolso/read?empresa=1&codigo='+id);
  }

  eliminarFormaDes(id):Observable<any>{
    return this._http.delete(this.url + 'formaDesembolso/delete?empresa=1&codigo='+id);
  }

  actualizarFormaDes(poder: FormaDesembolso):Observable<any>{
    var params = JSON.stringify(poder)
    return this._http.put(this.url + 'formaDesembolso/update', params, {headers: this.headers});
  }

  crearFormaDes(poder: FormaDesembolso):Observable<any>{
    var params = JSON.stringify(poder)
    return this._http.post(this.url + 'formaDesembolso/create', params, {headers: this.headers});
  }

  leerFormaDes(id):Observable<any>{
    return this._http.get(this.url + 'formaDesembolso/read?empresa=1&codigo='+ id, {headers: this.headers});
  }
}