import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ColaboradoresService } from 'src/app/services/colaboradores.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-deleta-usuario',
  templateUrl: './deleta-usuario.component.html',
  styleUrls: ['./deleta-usuario.component.scss'],
})
export class DeletaUsuarioComponent {
  constructor(
    private dialogRef: MatDialogRef<DeletaUsuarioComponent>, private usarioService: UsuarioService, private colaboradorService: ColaboradoresService,
    private toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onClickDelete(result: boolean) {
    if (result == true) {
      if (this.data.title === 'usuário') {
        this.usarioService.delete(this.data.toDelete).subscribe({
          next: (x) => { this.toastr.success('O usuário foi excluido com sucesso!'); },
          error: (e) => { this.toastr.error('Ocorreu um erro ao excluir o usuário, favor tentar novamente'); },
        });
      }
      if (this.data.title === 'colaborador') {
        this.colaboradorService.delete(this.data.toDelete).subscribe({
          next: (x) => { this.toastr.success('O colaborador foi excluido com sucesso!'); },
          error: (e) => { this.toastr.error('Ocorreu um erro ao excluir o colaborador, favor tentar novamente'); },
        });
      }
    }
    this.dialogRef.close(result);
  }
}
