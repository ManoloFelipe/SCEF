import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator' ;
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatSnackBar} from  '@angular/material/snack-bar' ;
import { Almacenadora } from 'src/app/models/almacenadora.model';
import { AlmacenadoraService } from 'src/app/services/almacenadora.service';

@Component({
  selector: 'app-almacenadora',
  templateUrl: './almacenadora.component.html',
  styleUrls: ['./almacenadora.component.css'],
  providers: [AlmacenadoraService]
})
export class AlmacenadoraComponent implements OnInit {
  public almacenadoras: Almacenadora[];
  
  public status: string;
  public numeroPagina: number = 0;
  public numeroItems: number = 5;
  public primeraPagina: boolean;
  public ultimaPagina: boolean;
  public listarNumeroPagina: number = 0;
  public cantidadActual: number;
  public almacenadoraModel: Almacenadora;
  public almacenadoraEditable: Almacenadora;
  public almacenadoraSeleccionada: number[];
  
  public dataSource2;

  constructor(public dialog: MatDialog,public snackBar: MatSnackBar, private _almacenadoraService: AlmacenadoraService) {
    this.limpiarVariables();
  }

  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAlma, {
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
        this.limpiarVariables()
      }
    });
  }


  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DialogActualizarAlma, {
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
        this.limpiarVariables();
      }
    });
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DialogEliminarAlma, {
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
        this.limpiarVariables();
      }
    });
  }

  openDialogView(): void {
    const dialogRef = this.dialog.open(VerAlmacenadora, {
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

      }
    });
  }

  @ViewChild (MatPaginator) paginator: MatPaginator;
  ngOnInit() {
    this.listarAlmacenadorasParaTabla();
  }

  limpiarVariables() {
    this.almacenadoraEditable = new Almacenadora(0, 0, '', '', '1', true);
    this.almacenadoraModel = new Almacenadora(0, 0, '', '', '1', true);
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
    this._almacenadoraService.listarPagina().subscribe(
      response => {
        if (response.content) {
          this.almacenadoras = response.content;
          this.dataSource2 = new MatTableDataSource<Almacenadora>(this.almacenadoras);
          console.log(this.almacenadoras);
          this.dataSource2.paginator = this.paginator;
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
          this.snackBar.open('Agregado exitosamente','',{duration: 3000});
          this.status = 'ok';
        } else {
          this.snackBar.open(response.description,'',{duration: 3000});
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
          this.snackBar.open('Actualizado exitosamente','',{duration: 2000});
          this.status = 'ok';
        } else {
          this.snackBar.open(response.description,'',{duration: 3000});
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

  eliminar(id){
    if(this.almacenadoraSeleccionada == undefined) return;
    this._almacenadoraService.eliminarAlmacenadora(id).subscribe(
      response => {
        this.listarAlmacenadorasParaTabla();
        if (response.code == 0) {
          this.almacenadoraEditable = response;
          console.log(this.almacenadoraEditable)
          this.snackBar.open('Eliminado exitosamente','',{duration: 3000});
          this.status = 'ok';
        } else {
          this.snackBar.open(response.description,'',{duration: 3000});
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
  dataSource = new MatTableDataSource<Almacenadora>(this.almacenadoras);
  selection = new SelectionModel<Almacenadora>(false, []);

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
    //    console.table(this.selection.selected)
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource2.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Almacenadora): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.codigo + 1}`;
  }
}

//----------------------------------------- COMPONENTE DEL DIALOG --------------------------------------- 


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'agragar-almacenadoras.component.html',
  styleUrls: ['./almacenadora.component.css'],
  providers: [AlmacenadoraService]
})
export class DialogAlma {
  public almacenadoras: Almacenadora[];
  public status: string;
  public numeroPagina: number = 0;
  public numeroItems: number = 5;
  public primeraPagina: boolean;
  public ultimaPagina: boolean;
  public cantidadActual: number;
  public almacenadoraModel: Almacenadora;
  public almacenadoraEditable: Almacenadora;
  constructor(
    public dialogRef: MatDialogRef<DialogAlma>,
    @Inject(MAT_DIALOG_DATA) public data: Almacenadora,
    private _almacenadoraService: AlmacenadoraService) {
    this.almacenadoraModel = new Almacenadora(0, 0, '', '', '1', true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  agregarAlmacenadora() {

  }


}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'actualizar-almacenadora.component.html',
  styleUrls: ['./almacenadora.component.css']
})
export class DialogActualizarAlma {

  constructor(
    public dialogRef: MatDialogRef<DialogActualizarAlma>,
    @Inject(MAT_DIALOG_DATA) public data: Almacenadora) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'eliminar-almacenadora.component.html',
  styleUrls: ['./almacenadora.component.css']
})
export class DialogEliminarAlma {

  constructor(
    public dialogRef: MatDialogRef<DialogEliminarAlma>,
    @Inject(MAT_DIALOG_DATA) public data: Almacenadora) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'ver-almacenadora.component.html',
  styleUrls: ['./almacenadora.component.css']
})
export class VerAlmacenadora {

  constructor(
    public dialogRef: MatDialogRef<VerAlmacenadora>,
    @Inject(MAT_DIALOG_DATA) public data: Almacenadora) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}