import { Component, OnInit, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Instancia } from 'src/app/models/instancia.model';
import { InstanciaService } from 'src/app/services/instancia.service';

@Component({
  selector: 'app-instancia',
  templateUrl: './instancia.component.html',
  styleUrls: ['./instancia.component.css'],
  providers: [InstanciaService]
})
export class InstanciaComponent implements OnInit {
  public instancias: Instancia[];
  
  public status: string;
  public numeroPagina: number = 0;
  public numeroItems: number = 5;
  public primeraPagina: boolean;
  public ultimaPagina: boolean;
  public listarNumeroPagina: number = 0;
  public cantidadActual: number;
  public instanciaModel: Instancia;
  public instanciaEditable: Instancia;
  public instanciaSeleccionada: number[];

  public dataSource2;

  constructor(public dialog: MatDialog, private _instanciaService: InstanciaService) {
    this.limpiarVariables();
  }

  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(CrearInstancia, {
      width: '500px',
      data: { codigoInstancia: this.instanciaModel.codigoInstancia, descripcion: this.instanciaModel.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.instanciaModel.codigoInstancia = result.codigoInstancia;
        this.instanciaModel.descripcion = result.descripcion;
        console.log(result);
        console.table(this.instanciaModel);
        this.agregar();
      }
    });
  }


  openDialogEdit(): void {
    const dialogRef = this.dialog.open(ActualizarInstancia, {
      width: '500px',
      data: { codigoInstancia: this.instanciaEditable.codigoInstancia, descripcion: this.instanciaEditable.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.instanciaEditable.codigoInstancia = result.codigoInstancia;
        this.instanciaEditable.descripcion = result.descripcion;
        console.log(result);
        console.table(this.instanciaEditable);
        this.editar();
      }
    });
  }

  openDialogView(): void {
    const dialogRef = this.dialog.open(VerInstancia, {
      width: '500px',
      data: { codigoInstancia: this.instanciaEditable.codigoInstancia, descripcion: this.instanciaEditable.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.instanciaEditable.codigoInstancia = result.codigoInstancia;
        this.instanciaEditable.descripcion = result.descripcion;
        console.log(result);
        console.table(this.instanciaEditable);
      }
    });
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(EliminarInstancia, {
      width: '500px',
      data: { codigoInstancia: this.instanciaEditable.codigoInstancia, descripcion: this.instanciaEditable.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.instanciaEditable.codigoInstancia = result.codigoInstancia;
        this.instanciaEditable.descripcion = result.descripcion;
        console.log(result);
        console.table(this.instanciaEditable);
        this.eliminar(this.instanciaSeleccionada[0]);
      }
    });
  }

  ngOnInit() {
    this.listarInstanciasParaTabla();
  }

  limpiarVariables() {
    this.instanciaEditable = new Instancia(0, 0, '', '', '1', true);
    this.instanciaModel = new Instancia(0, 0, '', '', '1', true);
  }

  siguientePagina(){
    if(!this.ultimaPagina){
      ++this.listarNumeroPagina;
      this.listarInstanciasParaTabla()
    }
  }

  anteriorPagina(){
    if(!this.primeraPagina){
      --this.listarNumeroPagina;
      this.listarInstanciasParaTabla()
    }
  }

  listarInstanciasParaTabla() {
    this._instanciaService.listarPagina(this.numeroPagina, this.numeroItems).subscribe(
      response => {
        if (response.content) {
          this.instancias = response.content;
          this.dataSource2 = new MatTableDataSource<Instancia>(this.instancias);
          console.log(this.instancias);
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

  setInstancia(id) {
    if(this.instanciaSeleccionada == undefined) return;
    this._instanciaService.listarInstancia(id).subscribe(
      response => {
        if (response.code == 0) {
          this.instanciaEditable = response;
          console.log(this.instanciaEditable)
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
    this._instanciaService.crearInstancia(this.instanciaModel).subscribe(
      response => {
        console.log(response)
        this.listarInstanciasParaTabla();
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
    this._instanciaService.actualizarInstancia(this.instanciaEditable).subscribe(
      response => {
        console.log(response);
        this.listarInstanciasParaTabla();
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
    if(this.instanciaSeleccionada == undefined) return;
    this._instanciaService.eliminarInstancia(id).subscribe(
      response => {
        if (response.code == 0) {
          this.instanciaEditable = response;
          console.log(this.instanciaEditable)
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

  displayedColumns: string[] = ['select', 'codigoInstancia', 'descripcion'];
  dataSource = new MatTableDataSource<Instancia>(this.instancias);
  selection = new SelectionModel<Instancia>(false, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  imprimir() {
    this.instanciaSeleccionada = this.selection.selected.map(row => row.codigoInstancia);
    console.log(this.instanciaSeleccionada[0]);
    if (this.instanciaSeleccionada[0]) {
      this.setInstancia(this.instanciaSeleccionada[0]);
    }
    //    console.table(this.selection.selected)
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource2.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Instancia): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.codigoInstancia + 1}`;
  }
}

//----------------------------------------- COMPONENTE DEL DIALOG --------------------------------------- 


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'agregar-instancia.component.html',
  styleUrls: ['./instancia.component.css']
})
export class CrearInstancia {
  public instanciaModel: Instancia;
  constructor(
    public dialogRef: MatDialogRef<CrearInstancia>,
    @Inject(MAT_DIALOG_DATA) public data: Instancia) {
    this.instanciaModel = new Instancia(0, 0, '', '', '1', true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  agregarAlmacenadora() {

  }


}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'actualizar-instancia.component.html',
  styleUrls: ['./instancia.component.css']
})
export class ActualizarInstancia {

  constructor(
    public dialogRef: MatDialogRef<ActualizarInstancia>,
    @Inject(MAT_DIALOG_DATA) public data: Instancia) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'eliminar-instancia.component.html',
  styleUrls: ['./instancia.component.css']
})
export class EliminarInstancia {

  constructor(
    public dialogRef: MatDialogRef<EliminarInstancia>,
    @Inject(MAT_DIALOG_DATA) public data: Instancia) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'ver-instancia.component.html',
  styleUrls: ['./instancia.component.css']
})
export class VerInstancia {

  constructor(
    public dialogRef: MatDialogRef<VerInstancia>,
    @Inject(MAT_DIALOG_DATA) public data: Instancia) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}