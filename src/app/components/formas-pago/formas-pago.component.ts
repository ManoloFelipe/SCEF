import { Component, OnInit, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormasPago } from 'src/app/models/formas-pago.model';
import { FormasPagoService } from 'src/app/services/formas-pago.service';

@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.component.html',
  styleUrls: ['./formas-pago.component.css'],
  providers:[FormasPagoService]
})
export class FormasPagoComponent implements OnInit {
  public almacenadoras: FormasPago[];
  
  public status: string;
  public numeroPagina: number = 0;
  public numeroItems: number = 5;
  public primeraPagina: boolean;
  public ultimaPagina: boolean;
  public listarNumeroPagina: number = 0;
  public cantidadActual: number;
  public almacenadoraModel: FormasPago;
  public almacenadoraEditable: FormasPago;
  public almacenadoraSeleccionada: number[];

  public dataSource2;

  constructor(public dialog: MatDialog, private _almacenadoraService: FormasPagoService) {
    this.limpiarVariables();
  }

  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogFormas, {
      width: '500px',
      data: { codigo: this.almacenadoraModel.codigo, descripcion: this.almacenadoraModel.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.almacenadoraModel.codigo = result.codigo;
        this.almacenadoraModel.descripcion = result.descripcion;
        console.log(result);
        console.table(this.almacenadoraModel);
        this.agregar();
      }
    });
  }


  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DialogActualizarFormas, {
      width: '500px',
      data: { codigo: this.almacenadoraEditable.codigo, descripcion: this.almacenadoraEditable.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.almacenadoraEditable.codigo = result.codigo;
        this.almacenadoraEditable.descripcion = result.descripcion;
        console.log(result);
        console.table(this.almacenadoraEditable);
        this.editar();
      }
    });
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DialogEliminarFormas, {
      width: '500px',
      data: { codigo: this.almacenadoraEditable.codigo, descripcion: this.almacenadoraEditable.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.almacenadoraEditable.codigo = result.codigo;
        this.almacenadoraEditable.descripcion = result.descripcion;
        console.log(result);
        console.table(this.almacenadoraEditable);
        this.eliminar(this.almacenadoraSeleccionada[0]);
      }
    });
  }

  ngOnInit() {
    this.listarAlmacenadorasParaTabla();
  }

  limpiarVariables() {
    this.almacenadoraEditable = new FormasPago(0, 0, '', '', '1', true);
    this.almacenadoraModel = new FormasPago(0, 0, '', '', '1', true);
  }

  siguientePagina(){
    if(!this.ultimaPagina){
      ++this.listarNumeroPagina;
      this.listarAlmacenadorasParaTabla()
    }
  }

  anteriorPagina(){
    if(!this.primeraPagina){
      --this.listarNumeroPagina;
      this.listarAlmacenadorasParaTabla()
    }
  }

  listarAlmacenadorasParaTabla() {
    this._almacenadoraService.listarPagina(this.numeroPagina, this.numeroItems).subscribe(
      response => {
        if (response.content) {
          this.almacenadoras = response.content;
          this.dataSource2 = new MatTableDataSource<FormasPago>(this.almacenadoras);
          console.log(this.almacenadoras);
          this.primeraPagina = response.first;
          this.ultimaPagina = response.last;
          this.listarNumeroPagina = response.numberOfElements;
          this.status = 'ok';
        }
      }, error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  setAlmacenadora(id) {
    if(this.almacenadoraSeleccionada == undefined) return;
    this._almacenadoraService.listarAlmacenadora(id).subscribe(
      response => {
        if (response.code == 0) {
          this.almacenadoraEditable = response;
          console.log(this.almacenadoraEditable)
          this.status = 'ok';
        } else {
          this.status = 'error';
        }
      }, error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  agregar() {
    this._almacenadoraService.crearAlmacenadora(this.almacenadoraModel).subscribe(
      response => {
        console.log(response)
        this.listarAlmacenadorasParaTabla();
        if (response.code == 0) {
          this.status = 'ok';
        } else {
          alert(response.description);
        }
      }, error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          alert(error.description);
          this.status = 'error';
        }
      }
    );
  }

  editar() {
    this._almacenadoraService.actualizarAlmacenadora(this.almacenadoraEditable).subscribe(
      response => {
        console.log(response);
        this.listarAlmacenadorasParaTabla();
        if (response.code == 0) {
          this.status = 'ok';
        } else {
          alert(response.description);
        }
      }, error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          alert(error.description);
          this.status = 'error';
        }
      }
    );
  }

  eliminar(id){
    if(this.almacenadoraSeleccionada == undefined) return;
    this._almacenadoraService.eliminarAlmacenadora(id).subscribe(
      response => {
        if (response.code == 0) {
          this.almacenadoraEditable = response;
          console.log(this.almacenadoraEditable)
          this.status = 'ok';
        } else {
          this.status = 'error';
        }
      }, error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  
  }

  displayedColumns: string[] = ['select', 'codigo', 'descripcion'];
  dataSource = new MatTableDataSource<FormasPago>(this.almacenadoras);
  selection = new SelectionModel<FormasPago>(false, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  imprimir() {
    this.almacenadoraSeleccionada = this.selection.selected.map(row => row.codigo);
    console.log(this.almacenadoraSeleccionada[0]);
    if (this.almacenadoraSeleccionada[0]) {
      this.setAlmacenadora(this.almacenadoraSeleccionada[0]);
    }
    
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource2.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: FormasPago): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.codigo + 1}`;
  }
}

//----------------------------------------- COMPONENTE DEL DIALOG --------------------------------------- 


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.component.html',
  styleUrls: ['./formas-pago.component.css'],
  providers: [FormasPagoService]
})
export class DialogFormas {
  public almacenadoras: FormasPago[];
  public status: string;
  public numeroPagina: number = 0;
  public numeroItems: number = 5;
  public primeraPagina: boolean;
  public ultimaPagina: boolean;
  public cantidadActual: number;
  public almacenadoraModel: FormasPago;
  public almacenadoraEditable: FormasPago;
  constructor(
    public dialogRef: MatDialogRef<DialogFormas>,
    @Inject(MAT_DIALOG_DATA) public data: FormasPago,
    private _almacenadoraService: FormasPagoService) {
    this.almacenadoraModel = new FormasPago(0, 0, '', '', '1', true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'actualizar-forma.component.html',
  styleUrls: ['./formas-pago.component.css']
})
export class DialogActualizarFormas {

  constructor(
    public dialogRef: MatDialogRef<DialogActualizarFormas>,
    @Inject(MAT_DIALOG_DATA) public data: FormasPago) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'eliminar-forma.component.html',
  styleUrls: ['./formas-pago.component.css']
})
export class DialogEliminarFormas{

  constructor(
    public dialogRef: MatDialogRef<DialogEliminarFormas>,
    @Inject(MAT_DIALOG_DATA) public data: FormasPago) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}