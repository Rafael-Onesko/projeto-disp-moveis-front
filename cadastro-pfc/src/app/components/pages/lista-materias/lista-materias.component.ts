import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Materia } from 'src/app/interfaces/materia';
import { DeletaUsuarioComponent } from '../../dialogs/deleta-usuario/deleta-usuario.component';
import { MateriaService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-lista-materias',
  templateUrl: './lista-materias.component.html',
  styleUrls: ['./lista-materias.component.scss'],
})
export class ListaMateriasComponent implements AfterViewInit {
  displayedColumns: string[] = ['materia_ID', 'materia_Nome','materia_Bloco','professor_Nome','professor_ID', 'open', 'delete'];
  dadosMaterias = new MatTableDataSource<Materia>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioLogin = localStorage.getItem('usuarioLogin');
  constructor(
    private materiaService: MateriaService,
    public dialog: MatDialog
  ) {
    if (this.usuarioAdmin == 'false') {
      this.displayedColumns = ['materia_ID', 'materia_Nome','materia_Bloco','professor_Nome','professor_ID', 'open'];
    }
  }
  ngAfterViewInit() {
    this.dadosMaterias.paginator = this.paginator;
    this.dadosMaterias.sort = this.sort;
    this.materiaService.getAllMaterias().subscribe((materias) => {
      this.dadosMaterias.data = materias;
    });

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dadosMaterias.filter = filterValue.trim().toLowerCase();

    if (this.dadosMaterias.paginator) {
      this.dadosMaterias.paginator.firstPage();
    }
  }

  openDialog(toDelete: String, title: String) {
    const dialogRef = this.dialog.open(DeletaUsuarioComponent, {
      data: { title, toDelete, dados: this.dadosMaterias, },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dadosMaterias.data = this.dadosMaterias.data.filter((u) => toDelete !== u.materia_ID)
      }
    })
  }
}
