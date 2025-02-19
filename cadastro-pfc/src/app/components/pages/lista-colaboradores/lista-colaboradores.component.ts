import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Colaboradores } from 'src/app/interfaces/colaborador';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { DeletaUsuarioComponent } from '../../dialogs/deleta-usuario/deleta-usuario.component';

@Component({
  selector: 'app-lista-colaboradores',
  templateUrl: './lista-colaboradores.component.html',
  styleUrls: ['./lista-colaboradores.component.scss'],
})
export class ListaColaboradoresComponent implements AfterViewInit {
  displayedColumns: string[] = ['matricula', 'nome', 'tipo', 'open', 'delete',];
  dadosColaborador = new MatTableDataSource<Colaboradores>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioLogin = localStorage.getItem('usuarioLogin');
  constructor(
    private colaboradorService: ColaboradoresService,
    public dialog: MatDialog
  ) { }
  ngAfterViewInit() {
    this.dadosColaborador.paginator = this.paginator;
    this.dadosColaborador.sort = this.sort;
    this.colaboradorService.getAllColaboradores().subscribe((colaboradores) => {
      this.dadosColaborador.data = colaboradores;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dadosColaborador.filter = filterValue.trim().toLowerCase();

    if (this.dadosColaborador.paginator) {
      this.dadosColaborador.paginator.firstPage();
    }
  }
  retornaTipo(tipo: number) {
    if (tipo == 1) { return 'Estagiário'; }
    if (tipo == 2) { return 'Efetivo'; }
    if (tipo == 3) { return 'Terceirizado'; }
    else { return ''; }
  }

  openDialog(toDelete: number, title: String) {
    const dialogRef = this.dialog.open(DeletaUsuarioComponent, {
      data: { title, toDelete, dados: this.dadosColaborador, },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) { this.dadosColaborador.data = this.dadosColaborador.data.filter((u) => toDelete !== u.id); }
    });
  }
}
