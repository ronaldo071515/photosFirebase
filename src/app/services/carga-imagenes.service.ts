import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { FileItem } from '../models/file-item';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  private FOLDER_IMAGES = 'img'

  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage) { }

  loadImages(images: FileItem[]) {
    console.log(images);
/* Hacer referencia al storage de firebase */
    /* const storageRef = firebase.storage().ref(); */

    for (const item of images) {

      item.upload = true;

      if ( item.progress >= 100 ) {
        continue;
      }

      const file = item.file;
      const filePath = `${ this.FOLDER_IMAGES }/${ item.nameFIle }`;
      const fileRef = this.storage.ref( filePath );
      const uploadTask = this.storage.upload(filePath, file);
  
      // con esta función nos suscribimos a los cambios en el progreso
      uploadTask.percentageChanges().subscribe( resp => {
        console.log(resp);
        item.progress = resp;
      });
      // obtengo el url de descarga cuando este disponible
      uploadTask.snapshotChanges().pipe(
              finalize(
                () => fileRef.getDownloadURL().subscribe( url => {
                  console.log('Imagen cargada con exito');
                  item.url = url;
                  item.upload = false;
                  this.saveImage({
                    nombre: item.nameFIle,
                    url: item.url
                  });
                })
              )
            ).subscribe();

    }

  }


  private saveImage( image: { nombre: string, url: string } ) {
    this.db.collection( `/${ this.FOLDER_IMAGES }` ).add( image ); /* se guarda en la carpeta */
  }

}
