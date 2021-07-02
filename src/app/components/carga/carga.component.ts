import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {

  inElement = false;
  files: FileItem[] = [];

  constructor(private _loadImage: CargaImagenesService) { }

  ngOnInit(): void {
  }

  saveImage() {
    this._loadImage.loadImages( this.files );
  }

  limpiarArchivos() {
    this.files = [];
  }


}
