import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
} from '@angular/fire/firestore';

import { inject } from '@angular/core';
import { UserModel } from './user.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private fs: Firestore,
    private http: HttpClient
  ) {}
  public visible = false;
  firestore: Firestore = inject(Firestore);
  users: UserModel[] = [];
  submited = false;
  progressScore = 0;
  isUploadImage = false;
  @ViewChild('fileInput') fileInput!: ElementRef ;

  patients = new FormGroup({
    name: new FormControl<string>('', [
      Validators.minLength(3),
      Validators.required,
    ]),
    surname: new FormControl<string>('', [
      Validators.minLength(3),
      Validators.required,
    ]),
    phone: new FormControl<string>('', [
      Validators.minLength(10),
      Validators.required,
    ]),
    identificationNo: new FormControl<string>('', [
      Validators.minLength(10),
      Validators.required,
    ]),
    description: new FormControl<string>('', []),
    image: new FormControl<any>('', [Validators.required]),
    createDate: new FormControl(new Date()),
    result: new FormControl<number>(0),
  });
  ngOnInit() {
    this.users = [];
    const itemCollection = collection(this.firestore, 'patients');
    collectionData(itemCollection).subscribe((res: any) => {
      res.map;
      this.users = res.map((x: any) => {
        return x;
      });
    });
  }
  getColor(result: number): string {
    switch (result) {
      case 0:
        return 'green';
      case 1:
        return 'blue';
      case 2:
        return 'yellow';
      case 3:
        return 'orange';
      case 4:
        return 'red';
      default:
        return 'black'; // Varsayılan renk, eğer belirtilen değerler dışında bir değer gelirse.
    }
  }
  toggleLiveDemo() {
    this.patients.reset({
      name: '',
      surname: '',
      phone: '',
      identificationNo: '',
      description: '',
      image: '',
      createDate: new Date(),
      result: 0
    });
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Clear the file input
    }
    this.patients.clearValidators();
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
  savePatients() {
    this.submited = true;
    if (!this.patients.valid) {
      this.toastr.error(
        'Lütfen Bilgileri Geçerli Giriniz. </br> İsim,Soyisim alanı en az 3 karakter olacak! </br> TC Kimlik No ve Telefon numarası alanı en az 10 karakter olacak!',
        'Hata',
        {
          enableHtml: true,
          closeButton: true,
        }
      );
    } else {
      const collectionInstance = collection(this.fs, 'patients');
      addDoc(collectionInstance, this.patients.value)
        .then(() => {
          this.toastr.success('Kayıt başarıyla oluşturuldu !');
          this.visible = !this.visible;
        })
        .catch((error) => console.log(error));
    }
  }
  handleUpload(event: any) {
    this.isUploadImage = true;
    const file: File = event.target.files[0];
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (ctx) {  // Check if ctx is not null
          // Resize parameters
          const MAX_WIDTH = 800; // max width for the resized image
          const MAX_HEIGHT = 800; // max height for the resized image
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
  
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // You can adjust the quality from 0 to 1
  
          this.patients.controls['image'].setValue(resizedDataUrl);
          this.fetch(file);
        } else {
          console.error('2D context is not available.');
        }
      };
    };
  }
  fetch(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);

    this.http.post('http://127.0.0.1:8000/uploadfile/', formData).subscribe(
      (res: any) => {
        this.patients.controls['result'].setValue(res[0]);
        this.progressScore = (res[0] as number) * 20;
      },
      (hata) => {
        this.toastr.error(hata);
      }
    );
  }
}
