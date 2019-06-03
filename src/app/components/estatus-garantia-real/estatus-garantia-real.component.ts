import { Component, OnInit, Inject } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { EstatusGarantiaReal } from 'src/app/models/estatus-garantia-real.model';
import { EstatusGarantiaRealService } from 'src/app/services/estatus-garantia-real.service';


@Component({
  selector: 'app-estatus-garantia-real',
  templateUrl: './estatus-garantia-real.component.html',
  styleUrls: ['./estatus-garantia-real.component.css'],
  providers: [EstatusGarantiaRealService]
})
export class EstatusGarantiaRealComponent implements OnInit {
  public estatusGarantias: EstatusGarantiaReal[];
  public status: string;
  public numeroPagina: number = 0;
  public numeroItems: number = 7;
  public primeraPagina: boolean;
  public ultimaPagina: boolean;
  public cantidadActual: number;
  public estatusGarantiaModel: EstatusGarantiaReal;
  public estatusGarantiaEditable: EstatusGarantiaReal;
  public dataSource2;

  constructor(public dialog: MatDialog, private _estatusGarantia: EstatusGarantiaRealService) {
    this.limpiarVariables()
  }

  openDialogAdd(): void {
    const dialogRef = this.dialog.open(DailogAgregarEstatusGarantiaReal, {
      width: '500px',
      data: {estatus: this.estatusGarantiaModel.codigo, descripcion: this.estatusGarantiaModel.descripcion}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.estatusGarantiaModel.codigo = result.codigo
      this.estatusGarantiaModel.descripcion = result.descripcion;
      this.agregar(); 
    });
  }

  openDialogEdit(): void {
    const dialogRef = this.dialog.open(DailogEditarEstatusGarantiaReal, {
      width: '500px',
      data: {estatus: this.estatusGarantiaModel.codigo, descripcion: this.estatusGarantiaModel.descripcion}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.estatusGarantiaModel.codigo = result.codigo
      this.estatusGarantiaModel.descripcion = result.descripcion;
    });
  }

  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DailogEliminarEstatusGarantiaReal, {
      width: '500px',
      data: {estatus: this.estatusGarantiaModel.codigo, descripcion: this.estatusGarantiaModel.descripcion}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.estatusGarantiaModel.codigo = result.codigo
      this.estatusGarantiaModel.descripcion = result.descripcion;
    });
  }

  ngOnInit() {
    this.listarGarantiasRealesParaTabla()
  }

  limpiarVariables(){
    this.estatusGarantiaModel = new EstatusGarantiaReal(0,'','','',true),
    this.estatusGarantiaEditable = new EstatusGarantiaReal(0,'','','',true)
  }

  listarGarantiasRealesParaTabla(){
    this._estatusGarantia.listarPagina(this.numeroPagina, this.numeroItems).subscribe(
      response => {
        if (response.content) {
          this.estatusGarantias = response.content;
          this.dataSource2 = new MatTableDataSource<EstatusGarantiaReal>(this.estatusGarantias);
          console.log(this.estatusGarantias);
          this.primeraPagina = response.first;
          this.ultimaPagina = response.last;
          this.cantidadActual = response.numberOfElements;
          this.status = 'ok';
        }
      }, error => {
        let errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          alert(error.description)
          this.status = 'error';
        }
      }
    );
  }

  agregar() {
    this._estatusGarantia.crearEstatusGarantia(this.estatusGarantiaModel).subscribe(
      response => {
        console.log(response)
        this.listarGarantiasRealesParaTabla();
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

  displayedColumns: string[] = ['select','estatus', 'descripcion'];
  dataSource = new MatTableDataSource<EstatusGarantiaReal>(this.estatusGarantias);
  selection = new SelectionModel<EstatusGarantiaReal>(false, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: EstatusGarantiaReal): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.codigo + 1}`;
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './agregar-estado-garantia-real.component.html',
  styleUrls: ['./estatus-garantia-real.component.css']
})
export class DailogAgregarEstatusGarantiaReal {

  constructor(
    public dialogRef: MatDialogRef<DailogAgregarEstatusGarantiaReal>,
    @Inject(MAT_DIALOG_DATA) public data: EstatusGarantiaReal) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './editar-estado-garantia-real.component.html',
  styleUrls: ['./estatus-garantia-real.component.css']
})
export class DailogEditarEstatusGarantiaReal {

  constructor(
    public dialogRef: MatDialogRef<DailogEditarEstatusGarantiaReal>,
    @Inject(MAT_DIALOG_DATA) public data: EstatusGarantiaReal) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './eliminar-estado-garantia-real.component.html',
  styleUrls: ['./estatus-garantia-real.component.css']
})
export class DailogEliminarEstatusGarantiaReal {

  constructor(
    public dialogRef: MatDialogRef<DailogEliminarEstatusGarantiaReal>,
    @Inject(MAT_DIALOG_DATA) public data: EstatusGarantiaReal) {}

    onNoClick(): void {
      this.dialogRef.close();
    }

}