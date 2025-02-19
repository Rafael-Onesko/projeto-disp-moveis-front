import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DeletaUsuarioComponent } from '../../dialogs/deleta-usuario/deleta-usuario.component';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss'],
})
export class ListaUsuariosComponent implements AfterViewInit {
  displayedColumns: string[] = ['email', 'nome', 'open', 'delete'];
  dadosUsuarios = new MatTableDataSource<Usuario>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioLogin = localStorage.getItem('usuarioLogin');
  constructor(
    private usuarioService: UsuarioService,
    public dialog: MatDialog
  ) {
    if (this.usuarioAdmin == 'false') {
      this.displayedColumns = ['email', 'nome', 'open'];
    }
  }
  ngAfterViewInit() {
    this.dadosUsuarios.paginator = this.paginator;
    this.dadosUsuarios.sort = this.sort;
    this.usuarioService.getAllUsuarios().subscribe((usuarios) => {
      this.dadosUsuarios.data = usuarios;
    });

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dadosUsuarios.filter = filterValue.trim().toLowerCase();

    if (this.dadosUsuarios.paginator) {
      this.dadosUsuarios.paginator.firstPage();
    }
  }

  openDialog(toDelete: String, title: String) {
    const dialogRef = this.dialog.open(DeletaUsuarioComponent, {
      data: { title, toDelete, dados: this.dadosUsuarios, },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dadosUsuarios.data = this.dadosUsuarios.data.filter((u) => toDelete !== u.email)
      }
    })
  }
}
