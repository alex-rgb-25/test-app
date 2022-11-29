import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';
import { throws } from 'assert';

@Component({
  selector: 'app-persoane-modal',
  templateUrl: './persoane-modal.component.html'
})
export class PersoaneModalComponent implements OnInit {
  @Input() id_persoane: number | undefined;

  modal = {} as any;
  modal2 = {} as any;
  masini: any = [];

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_persoane) {
      this._spinner.show();
      axios.get(`/api/persoane/${this.id_persoane}`).then(({ data }) => {
        this.modal = data;
        this.modal2 = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));
    }
    this.loadData2()
  }

  loadData2 = (): void => {
    this._spinner.show();
    axios.get('/api/masini').then(({ data }) => {
      this.masini = data;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
  }



  save(): void {
    this._spinner.show();

    if (!this.id_persoane) {


      if(!this.modal.nume || !this.modal.nume.trim()){
        this.activeModal.close();
        throw this.toastr.error("Campul nume este obligatoriu")
      } else if(!this.modal.prenume || !this.modal.prenume.trim()){
        this.activeModal.close();
        throw this.toastr.error("Campul prenume este obligatoriu")
      } else if(!this.modal.cnp.trim() || !this.modal.cnp){
        this.activeModal.close();
        throw this.toastr.error("Campul cnp este obligatoriu")
      } else if(this.modal.nume.length > 255){
        this.activeModal.close();
        throw this.toastr.error("Campul nume depaseste 255 caractere")
      } else if(this.modal.prenume.length > 255){
        this.activeModal.close();
        throw this.toastr.error("Campul prenume depaseste 255 caractere")
      } else if(Number(this.modal.cnp) > 9999999999999 || Number(this.modal.cnp) < 0 ||
        !Number(this.modal.cnp) || this.modal.cnp.length < 13 ){
        this.activeModal.close();
        throw this.toastr.error("Campul cnp trebuie sa contina o valoare pozitiva de 13 caractere")
      }
      

      else{ 
        // 
        let date = new Date();
        
        let subcnp = this.modal.cnp.substring(1, 7);
        let cnpby = subcnp.substring(0,2)
        let cnpmy = subcnp.substring(2, 4)
        let cnpdy = subcnp.substring(4, 6)
        let by = 0;
        if(Number(cnpby) <= 50 ){
          by = 2000 + Number(cnpby)
        } else {
          by = 1900 + Number(cnpby)
        }
        let bm = Number(cnpmy)

        let bd = Number(cnpdy)

        let fullbd = String(by) + "-" + String(bm) + "-" + String(bd)

        let fullBD = new Date(fullbd)
        let age = date.getFullYear() - fullBD.getFullYear()

        if(date.getMonth() == fullBD.getMonth()){
          if(fullBD.getDate() > date.getDate()){
            age = age - 1
          }
        }
        if(date.getMonth() < fullBD.getMonth()){
          age = age - 1;
        }
        /////////////////////////////////////////////////////////////////
        this.modal.varsta = age;


        axios.post('/api/persoane', this.modal).then(() => {

          
        axios.get('/api/persoane').then(({ data }) => {
          //get last persons id
          let pers_id = data[data.length-1].id;
          let con = { id_person: 0, id_car: 0}
          try{
          for(let i = 0; i<this.modal2.masini.length; i++) {
            con.id_person = pers_id;
            con.id_car = this.modal2.masini[i]
            axios.post('/api/junction', con).then(() => {
              this._spinner.hide();
              
            }).catch();
          }
        } catch{}
          window.location.reload();

        }).catch();
      
          this.toastr.success('Informația a fost salvată cu succes!');
          this.activeModal.close();
        }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
      
      }
    } else {

      axios.get(`/api/junction`).then(({ data }) => {

        for( let i = 0; i < data.length; i++){
          
          if(data[i].id_person == this.id_persoane){
            
            axios.delete(`/api/junction/${data[i].id}`).then(() => {
            }).catch();
          }
        }
        this._spinner.hide();

        setInterval(function a(){
        window.location.reload()}, 500)
        let rel = { } as any
        for(let i = 0; i<this.modal2.masini.length; i++) {
          rel.id_person = this.id_persoane;
          rel.id_car = this.modal2.masini[i]
          axios.post('/api/junction', rel).then(() => {
            this._spinner.hide();
          }).catch();
        }
      window.location.reload();
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));


      axios.put('/api/persoane', this.modal).then(() => {
              
        this._spinner.hide();
        this.toastr.success('Informația a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this.toastr.error('Eroare la modificarea informației!'));
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter(t => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }
}