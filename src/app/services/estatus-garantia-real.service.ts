import { Injectable } from '@angular/core';
import {HttpHeaders,HttpClient} from '@angular/common/http';
import {GLOBAL} from './global.service'
import { EstatusGarantiaReal } from '../models/estatus-garantia-real.model'
import { Observable } from 'rxjs';

@Injectable()
export class EstatusGarantiaRealService {

  public url: String;
  public headers = new HttpHeaders().set('Content-Type', 'application/json');
  
  constructor(private _http:HttpClient) {
    this.url = GLOBAL.url
   }

   listarPagina(numeroPagina, numeroItems):Observable<any> {
    return this._http.get(this.url + 'statusGarantiaReal/listPage?page='+numeroPagina+'&size='+numeroItems+'&sort=id.codigo,asc&query=id.empresa==1',{headers: this.headers});
  }

  listarEstatusGarantia(id):Observable<any>{
    return this._http.get(this.url+'statusGarantiaReal/read?empresa=1&codigo='+id);
  }

  eliminarEstatusGarantia(id):Observable<any>{
    return this._http.delete(this.url+'statusGarantiaReal/delete?empresa=1&codigo='+id);
  }

  actualizarEstatusGarantia(estatus: EstatusGarantiaReal):Observable<any>{
    var params = JSON.stringify(estatus)
    return this._http.patch(this.url+'statusGarantiaReal/update',params,{headers:this.headers})
  }

  crearEstatusGarantia(estatus: EstatusGarantiaReal):Observable<any>{
    var params = estatus
    return this._http.post(this.url+'statusGarantiaReal/create',params,{headers:this.headers})
  }
}
