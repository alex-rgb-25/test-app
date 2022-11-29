import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';
import { throws } from 'assert';

@Component({
  selector: 'app-masini-modal',
  templateUrl: './masini-modal.component.html'
})
export class MasiniModalComponent implements OnInit {
  @Input() id_masini: number | undefined;

  modal = {} as any;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_masini) {
      this._spinner.show();
      axios.get(`/api/masini/${this.id_masini}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));
    }
  }

  save(): void {
    this._spinner.show();

    if (!this.id_masini) {
      if(!this.modal.denumire_marca || !this.modal.denumire_marca.trim()){
        this.activeModal.close();
        throw this.toastr.error("Campul denumire marca este obligatoriu")
      } else if(!this.modal.denumire_model || !this.modal.denumire_model.trim()){
        this.activeModal.close();
        throw this.toastr.error("Campul denumire model este obligatoriu")
      } else if(!this.modal.anul_fabricatiei){
        this.activeModal.close();
        throw this.toastr.error("Campul anul fabricatiei este obligatoriu")
      } else if(!this.modal.capacitatea_cilindrica){
        this.activeModal.close();
        throw this.toastr.error("Campul capacitate cilindrica este obligatoriu")
      } else if(this.modal.denumire_model.length > 255){
        this.activeModal.close();
        throw this.toastr.error("Campul denumire model depaseste 255 caractere")
      } else if(this.modal.denumire_marca.length > 255){
        this.activeModal.close();
        throw this.toastr.error("Campul denumire marca depaseste 255 caractere")
      } else if(this.modal.anul_fabricatiei > 9999 || this.modal.anul_fabricatiei < 0){
        this.activeModal.close();
        throw this.toastr.error("Campul anul fabricatiei trebuie sa contina o valoare pozitiva de maxim 4 caractere")
      } else if(this.modal.capacitatea_cilindrica > 9999 || this.modal.capacitatea_cilindrica < 0){
        this.activeModal.close();
        throw this.toastr.error("Campul capacitatea cilindrica trebuie sa contina o valoare pozitiva de maxim 4 caractere")
      }

      else{ 
        if(this.modal.capacitatea_cilindrica < 1500){
          this.modal.taxa_de_impozit = 50
        } else if(this.modal.capacitatea_cilindrica < 2000){
          this.modal.taxa_de_impozit = 100
        } else {
          this.modal.taxa_de_impozit = 200
        }
        axios.post('/api/masini', this.modal).then(() => {
          this._spinner.hide();
          this.toastr.success('Informația a fost salvată cu succes!');
          this.activeModal.close();
        }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
      }
    } else {
      if(!this.modal.denumire_marca.trim()){
        this.activeModal.close();
        throw this.toastr.error("Campul denumire marca este obligatoriu")
      } else if(!this.modal.denumire_model.trim()){
        this.activeModal.close();
        throw this.toastr.error("Campul denumire model este obligatoriu")
      } else if(!this.modal.anul_fabricatiei){
        this.activeModal.close();
        throw this.toastr.error("Campul anul fabricatiei este obligatoriu")
      } else if(!this.modal.capacitatea_cilindrica){
        this.activeModal.close();
        throw this.toastr.error("Campul capacitate cilindrica este obligatoriu")
      } else if(this.modal.denumire_model.length > 255){
        this.activeModal.close();
        throw this.toastr.error("Campul denumire model depaseste 255 caractere")
      } else if(this.modal.denumire_marca.length > 255){
        this.activeModal.close();
        throw this.toastr.error("Campul denumire marca depaseste 255 caractere")
      } else if(this.modal.anul_fabricatiei > 9999 || this.modal.anul_fabricatiei < 0){
        this.activeModal.close();
        throw this.toastr.error("Campul anul fabricatiei trebuie sa contina o valoare pozitiva de maxim 4 caractere")
      } else if(this.modal.capacitatea_cilindrica > 9999 || this.modal.capacitatea_cilindrica < 0){
        this.activeModal.close();
        throw this.toastr.error("Campul capacitatea cilindrica trebuie sa contina o valoare pozitiva de maxim 4 caractere")
      }
      axios.put('/api/masini', this.modal).then(() => {
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
