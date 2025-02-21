import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Professor } from 'src/app/interfaces/professor';
import { ProfessorService } from 'src/app/services/professores.service';
import { DeletaUsuarioComponent } from '../../dialogs/deleta-usuario/deleta-usuario.component';

@Component({
  selector: 'app-lista-professores',
  templateUrl: './lista-professores.component.html',
  styleUrls: ['./lista-professores.component.scss'],
})
export class ListaProfessoresComponent implements AfterViewInit {
  displayedColumns: string[] = ['professor_ID', 'professor_Nome', 'open', 'delete'];
  dadosProfessores = new MatTableDataSource<Professor>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioLogin = localStorage.getItem('usuarioLogin');
  constructor(
    private professorService: ProfessorService,
    public dialog: MatDialog
  ) {
    if (this.usuarioAdmin == 'false') {
      this.displayedColumns = ['professor_ID', 'professor_Nome', 'open'];
    }
  }
  ngAfterViewInit() {
    this.dadosProfessores.paginator = this.paginator;
    this.dadosProfessores.sort = this.sort;
    this.professorService.getAllProfessores().subscribe((professores) => {
      this.dadosProfessores.data = professores;
    });

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dadosProfessores.filter = filterValue.trim().toLowerCase();

    if (this.dadosProfessores.paginator) {
      this.dadosProfessores.paginator.firstPage();
    }
  }

  openDialog(toDelete: String, title: String) {
    const dialogRef = this.dialog.open(DeletaUsuarioComponent, {
      data: { title, toDelete, dados: this.dadosProfessores, },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dadosProfessores.data = this.dadosProfessores.data.filter((u) => toDelete !== u.professor_ID)
      }
    })
  }
}
