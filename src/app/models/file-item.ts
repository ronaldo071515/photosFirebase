export class FileItem {
    public file: File;
    public nameFIle: string;
    public url: string;
    public upload: boolean;
    public progress: number;


    constructor(file: File) {
        /* hacemos un par de seteos */
        this.file = file;
        this.nameFIle = file.name;
        
        this.upload = false;
        this.progress = 0;
    }
}