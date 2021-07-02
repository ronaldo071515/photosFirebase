import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]'
})
export class NgDropFilesDirective {

/* mantener relacion con la directiva */
@Input() files: FileItem[] = []; 

  /* hablar con el padre output */
@Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() { }
/* cuando el mause llega */
  @HostListener('dragover', ['$event'])
  public onDragEnter( event: any ) {
    this.mouseSobre.emit( true );

    this._prevenirDetener( event );
  }

/* cuando el mause se vaya */

  @HostListener('dragleave', ['$event'])
  public onDragLeave( event: any ) {
    this.mouseSobre.emit( false );
  }

/* cuando se solto el mause */
  @HostListener('drop', ['$event'])
  public onDrop( event: any ) {
    
    const transferencia = this._getTransferencia( event );
    
    if ( !transferencia ) {
      return;
    }
    this._extraerArchivos( transferencia.files );
    this._prevenirDetener( event );
    
    this.mouseSobre.emit( false );
  }

  private _getTransferencia( event: any ) {
    return event.dataTransfer ? event.dataTransfer: event.originalEvent.dataTransfer 
  }

  private _extraerArchivos ( archivoLista: FileList ) {
    console.log(archivoLista);

    for ( const propiedad in Object.getOwnPropertyNames( archivoLista ) ) {

      const archivoTemporal = archivoLista[ propiedad ];
      
      if ( this._elArchivoPuedeSerCargado( archivoTemporal ) ) {

        const nuevoArchivo = new FileItem( archivoTemporal );
        this.files.push( nuevoArchivo );

      }

    }

    console.log(this.files);

  }

  /* validaciones */

  /* cuando ya se han echo las dos validaciones */

  private _elArchivoPuedeSerCargado( file: File ): boolean {
    
    if ( !this._archivoYaFueDropeado( file.name ) && this._esImagen( file.type ) ) {
      return true;
    } else {
      return false;
    }

  }

  private _prevenirDetener( event ) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _archivoYaFueDropeado( nameFile: string ): boolean {

    for ( const file of this.files ) {

      if ( file.nameFIle === nameFile ) {
        console.log('El archivo' + nameFile + 'ya esta agregado');
        return true;
      }

    }
    return false;
  }

  /* validar que sea imagen */

  private _esImagen( tipoArchivo: string ): boolean {
    return ( tipoArchivo === '' || tipoArchivo === undefined ) ? false : tipoArchivo.startsWith('image');
  }

}
