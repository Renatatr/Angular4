import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, switchMap, tap } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca= new FormControl();

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    tap(() => console.log('fluxo inicial')),
    switchMap(x => this.service.buscar(x)),
    tap(() => console.log('Requisição ao servidor')),
    map(x => this.livrosResultadoParaLivros(x))
  )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(x => {
      return new LivroVolumeInfo(x)
    })
  }
}



