import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 500;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca= new FormControl();
  mensagemErro= '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter(x => x.length >= 3), //filtrar primeiro e depois 
    tap(() => console.log('fluxo inicial')),
    distinctUntilChanged(),
    switchMap(x => this.service.buscar(x)), // fazer a requisição
    map(x => this.livrosResultado = x),
    catchError(erro => {
      console.log(erro)
      return of()
    })
  )

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter(x => x.length >= 3), //filtrar primeiro e depois 
    tap(() => console.log('fluxo inicial')),
    distinctUntilChanged(),
    switchMap(x => this.service.buscar(x)), // fazer a requisição
    tap(x => console.log('Requisição ao servidor', x)),
    map(y => y.items ?? []),
    map(x => this.livrosResultadoParaLivros(x)),
    catchError(erro => {
      // this.mensagemErro = 'OPA, ocorreu um erro, recarregue!'
      // return EMPTY;
      console.log(erro)
      return throwError(() => new Error( this.mensagemErro = 'OPA, ocorreu um erro, recarregue!'))
    })
  )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(x => {
      return new LivroVolumeInfo(x)
    })
  }
}



