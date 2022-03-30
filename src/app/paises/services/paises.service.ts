import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = [
    'EU',
    'EFTA',
    'CARICOM',
    'PA',
    'AU',
    'USAN',
    'EEU',
    'AL',
    'ASEAN',
    'CAIS',
    'CEFTA',
    'NAFTA',
    'SAARC',
  ];

  private _regionesOld: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private baseUrl: string = 'https://restcountries.com/v2'
  

  get regiones(): string[]{
    return [...this._regiones]
  }

  get regionesOld(): string[]{
    return [...this._regionesOld]
  }

  constructor( private http: HttpClient) { }

  getPaisesPorRegion( region: string): Observable<PaisSmall[]> {

    const url: string = `${this.baseUrl}/region/${region}?fields=alpha3Code,name`
    return this.http.get<PaisSmall[]>(url)
    //https://restcountries.com/v2/region/americas?fields=alpha3Code,name
    
    // /all?fields=name;capital;alpha2Code;flag;population`
  }

  getPaisPorCodigo( codigo: string):Observable<Pais | null>{

    if( !codigo ) {
      return of(null)
    }

    const url = `${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais>( url )

  }
  getPaisPorCodigoSmall( codigo: string):Observable<PaisSmall>{

    const url = `${this.baseUrl}/alpha/${codigo}?fields=alpha3Code,name`;
    return this.http.get<PaisSmall>( url )

  }

  getPaisesPorCodigos( borders: string[] ):Observable<PaisSmall[]> {
    if( !borders){
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );

  }


}
