import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { MasiniModalComponent } from './masini-modal/masini-modal.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { throws } from 'assert';

@Component({
  selector: 'app-masini',
  templateUrl: './masini.component.html',
  styleUrls: ['./masini.component.scss']
})
export class MasiniComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  masini: any = [];
  marca: string = '';
  model: string = '';
  an: string = "";
  capacitate: string = "";
  taxa: string = "";
  filtered: any = []
  info: any = []

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }

  filter2 = (): void => {

    this.info = { 
      denumire_marca: this.marca, 
      denumire_model: this.model, 
      anul_fabricatiei: this.an,
      capacitatea_cilindrica: this.capacitate,
      taxa_de_impozit: this.taxa 
    }
    let vals = Object.values(this.info)
    let keys = Object.keys(this.info)
    let ok = 1;

    this.filtered= [];
    this._spinner.show();
    axios.get('/api/masini').then(({ data }) => {
      this.masini = data;
        for(let i=0; i<data.length; i++) {
          ok = 1;
          for(let j=0; j<5; j++){
            if(vals[j] != ""){
              if(data[i][keys[j]] != vals[j]){
                ok = 0;
              }
            }
          }

          if(ok == 1){
              this.filtered.push(data[i])
          }
        }

        this.masini = this.filtered;
      
      console.log("INFO:> ", this.masini)
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
  }



  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/masini').then(({ data }) => {
      this.masini = data;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
  }

  addEdit = (id_masini?: number): void => {
    const modalRef = this._modal.open(MasiniModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_masini = id_masini;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (masini: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți informația având tipul <b>${masini.name}</b>, denumirea: <b>${masini.name}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/masini/${masini.id}`).then(() => {
        this.toastr.success('Informația a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ștergerea informației!'));
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-informations')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-informations', 0);
    this.limit = 70;
  }
}
