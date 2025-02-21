import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DeletaUsuarioComponent } from '../../dialogs/deleta-usuario/deleta-usuario.component';
import { RoleService } from 'src/app/services/roles.service';
import { Role } from 'src/app/interfaces/role';

@Component({
  selector: 'app-lista-roles',
  templateUrl: './lista-roles.component.html',
  styleUrls: ['./lista-roles.component.scss'],
})
export class ListaRolesComponent implements AfterViewInit {
  displayedColumns: string[] = ['roleNome', 'open', 'delete'];
  dadosRoles = new MatTableDataSource<Role>();
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  usuarioAdmin = localStorage.getItem('usuarioAdmin');
  usuarioLogin = localStorage.getItem('usuarioLogin');
  constructor(
    private roleService: RoleService,
    public dialog: MatDialog
  ) {
    if (this.usuarioAdmin == 'false') {
      this.displayedColumns = ['roleNome', 'open'];
    }
  }
  ngAfterViewInit() {
    this.dadosRoles.paginator = this.paginator;
    this.dadosRoles.sort = this.sort;
    this.roleService.getAllRoles().subscribe((roles) => {
      this.dadosRoles.data = roles;
    });

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dadosRoles.filter = filterValue.trim().toLowerCase();

    if (this.dadosRoles.paginator) {
      this.dadosRoles.paginator.firstPage();
    }
  }

  openDialog(toDelete: String, title: String) {
    const dialogRef = this.dialog.open(DeletaUsuarioComponent, {
      data: { title, toDelete, dados: this.dadosRoles, },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.dadosRoles.data = this.dadosRoles.data.filter((u) => toDelete !== u.roleNome)
      }
    })
  }
}
