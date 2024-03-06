import { Component, OnInit } from '@angular/core';
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
      this.patients.controls['image'].setValue(reader.result);
      this.fetch(file);
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
