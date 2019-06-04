import { Component, OnInit, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormaDesembolso } from 'src/app/models/forma-desembolso.model';
import { FormaDesembolsoService } from 'src/app/services/forma-desembolso.service';

@Component({
  selector: 'app-forma-desembolso',
  templateUrl: './forma-desembolso.component.html',
  styleUrls: ['./forma-desembolso.component.css'],
  providers: [FormaDesembolsoService]
})
export class FormasDesembolsoComponent implements OnInit {
  public formas: FormaDesembolso[];
  
  public status: string;
  public numeroPagina: number = 0;
  public numeroItems: number = 5;
  public primeraPagina: boolean;
  public ultimaPagina: boolean;
  public listarNumeroPagina: number = 0;
  public cantidadActual: number;
  public formaDesModel: FormaDesembolso;
  public formaDesEditable: FormaDesembolso;
  public formaDesSeleccionado: number[];

  public dataSource2;

  constructor(public dialog: MatDialog, private _formaDesService: FormaDesembolsoService) {
    this.limpiarVariables();
  }

  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(CrearFormaDes, {
      width: '500px',
      data: { codigo: this.formaDesModel.codigo, descripcion: this.formaDesModel.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.formaDesModel.codigo = result.codigo;
        this.formaDesModel.descripcion = result.descripcion;
        console.log(result);
        console.table(this.formaDesModel);
        this.agregar();
      }
    });
  }


  openDialogEdit(): void {
    const dialogRef = this.dialog.open(ActualizarFormaDes, {
      width: '500px',
      data: { codigo: this.formaDesEditable.codigo, descripcion: this.formaDesEditable.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.formaDesEditable.codigo = result.codigo;
        this.formaDesEditable.descripcion = result.descripcion;
        console.log(result);
        console.table(this.formaDesEditable);
        this.editar();
      }
    });
  }

  openDialogView(): void {
    const dialogRef = this.dialog.open(VerFormaDes, {
      width: '500px',
      data: { codigo: this.formaDesEditable.codigo, descripcion: this.formaDesEditable.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.formaDesEditable.codigo = result.codigo;
        this.formaDesEditable.descripcion = result.descripcion;
        console.log(result);
        console.table(this.formaDesEditable);
      }
    });
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(EliminarFormaDes, {
      width: '500px',
      data: { codigo: this.formaDesEditable.codigo, descripcion: this.formaDesEditable.descripcion }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result != undefined) {
        this.formaDesEditable.codigo = result.codigo;
        this.formaDesEditable.descripcion = result.descripcion;
        console.log(result);
        console.table(this.formaDesEditable);
        this.eliminar(this.formaDesSeleccionado[0]);
      }
    });
  }

  ngOnInit() {
    this.listarPoderesParaTabla();
  }

  limpiarVariables() {
    this.formaDesEditable = new FormaDesembolso(0, 0, '', '', true);
    this.formaDesModel = new FormaDesembolso(0, 0, '', '', true);
  }

  siguientePagina(){
    if(!this.ultimaPagina){
      ++this.listarNumeroPagina;
      this.listarPoderesParaTabla()
    }
  }

  anteriorPagina(){
    if(!this.primeraPagina){
      --this.listarNumeroPagina;
      this.listarPoderesParaTabla()
    }
  }

  listarPoderesParaTabla() {
    this._formaDesService.listarPagina(this.numeroPagina, this.numeroItems).subscribe(
      response => {
        if (response.content) {
          this.formas = response.content;
          this.dataSource2 = new MatTableDataSource<FormaDesembolso>(this.formas);
          console.log(this.formas);
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

  setPoder(id) {
    if(this.formaDesSeleccionado == undefined) return;
    this._formaDesService.listarFormaDes(id).subscribe(
      response => {
        if (response.code == 0) {
          this.formaDesEditable = response;
          console.log(this.formaDesEditable)
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
    this._formaDesService.crearFormaDes(this.formaDesModel).subscribe(
      response => {
        console.log(response)
        this.listarPoderesParaTabla();
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
    this._formaDesService.actualizarFormaDes(this.formaDesEditable).subscribe(
      response => {
        console.log(response);
        this.listarPoderesParaTabla();
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
    if(this.formaDesSeleccionado == undefined) return;
    this._formaDesService.eliminarFormaDes(id).subscribe(
      response => {
        if (response.code == 0) {
          this.formaDesEditable = response;
          console.log(this.formaDesEditable)
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
  dataSource = new MatTableDataSource<FormaDesembolso>(this.formas);
  selection = new SelectionModel<FormaDesembolso>(false, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  imprimir() {
    this.formaDesSeleccionado = this.selection.selected.map(row => row.codigo);
    console.log(this.formaDesSeleccionado[0]);
    if (this.formaDesSeleccionado[0]) {
      this.setPoder(this.formaDesSeleccionado[0]);
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
  checkboxLabel(row?: FormaDesembolso): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.codigo + 1}`;
  }
}

//----------------------------------------- COMPONENTE DEL DIALOG --------------------------------------- 


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'agregar-forma-desembolso.component.html',
  styleUrls: ['./forma-desembolso.component.css'],
  providers: [FormaDesembolsoService]
})
export class CrearFormaDes {
  public almacenadoras: FormaDesembolso[];
  public status: string;
  public numeroPagina: number = 0;
  public numeroItems: number = 5;
  public primeraPagina: boolean;
  public ultimaPagina: boolean;
  public cantidadActual: number;
  public almacenadoraModel: FormaDesembolso;
  public almacenadoraEditable: FormaDesembolso;
  constructor(
    public dialogRef: MatDialogRef<CrearFormaDes>,
    @Inject(MAT_DIALOG_DATA) public data: FormaDesembolso,
    private _almacenadoraService: FormaDesembolsoService) {
    this.almacenadoraModel = new FormaDesembolso(0, 0, '', '', true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  agregarAlmacenadora() {

  }


}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'actualizar-forma-desembolso.component.html',
  styleUrls: ['./forma-desembolso.component.css']
})
export class ActualizarFormaDes {

  constructor(
    public dialogRef: MatDialogRef<ActualizarFormaDes>,
    @Inject(MAT_DIALOG_DATA) public data: FormaDesembolso) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'eliminar-forma-desembolso.component.html',
  styleUrls: ['./forma-desembolso.component.css']
})
export class EliminarFormaDes {

  constructor(
    public dialogRef: MatDialogRef<EliminarFormaDes>,
    @Inject(MAT_DIALOG_DATA) public data: FormaDesembolso) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'ver-forma-desembolso.component.html',
  styleUrls: ['./forma-desembolso.component.css']
})
export class VerFormaDes {

  constructor(
    public dialogRef: MatDialogRef<VerFormaDes>,
    @Inject(MAT_DIALOG_DATA) public data: FormaDesembolso) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}