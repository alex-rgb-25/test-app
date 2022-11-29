import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PersoaneModalComponent } from './persoane-modal/persoane-modal.component'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { throws } from 'assert';

@Component({
  selector: 'app-persoane',
  templateUrl: './persoane.component.html',
  styleUrls: ['./persoane.component.scss']
})
export class PersoaneComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  persoane: any = [];
  nume: string = '';
  prenume: string = '';
  cnp: string = "";
  varsta: string = "";
  filtered: any = []
  info: any = [];
  masini: any = [];
  pers2: any = [];

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }



  filter2 = (): void => {

    this.info = { 
      nume: this.nume, 
      prenume: this.prenume, 
      cnp: this.cnp,
      varsta: this.varsta,
    }
    let vals = Object.values(this.info)
    let keys = Object.keys(this.info)
    let ok = 1;

    this.filtered= [];
    this._spinner.show();
    axios.get('/api/persoane').then(({ data }) => {
      this.persoane = data;
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

        this.persoane = this.filtered;

        this.pers2=[];
      
      let prevID = this.persoane[0].id
      let mas = [];
      for(let i = 0; i<this.persoane.length; i++){
        if(this.persoane[i].id != prevID){
          
          this.pers2.push({...this.persoane[i-1], masini: mas})
          mas = [];
          prevID = this.persoane[i].id;
          mas.push({marca: this.persoane[i]["masini.denumire_marca"], model: this.persoane[i]["masini.denumire_model"],
        anul: this.persoane[i]["masini.anul_fabricatiei"],
        capacitate: this.persoane[i]["masini.capacitatea_cilindrica"],
        taxa: this.persoane[i]["masini.taxa_de_impozit"] })
        }else{
          mas.push({marca: this.persoane[i]["masini.denumire_marca"], model: this.persoane[i]["masini.denumire_model"],
        anul:this.persoane[i]["masini.anul_fabricatiei"], capacitate: this.persoane[i]["masini.capacitatea_cilindrica"],
      taxa: this.persoane[i]["masini.taxa_de_impozit"] })

        }
        
        if( i == this.persoane.length-1){
          this.pers2.push({ ...this.persoane[i], masini: mas })
        }
      }
      
      console.log("INFO:> ", this.persoane)
      this._spinner.hide();
    }).catch();
  }




  ngOnInit(): void {
    this.loadData();
    
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/persoane').then(({ data }) => {
      this.persoane = data;
      this._spinner.hide();
      this.pers2=[];
      
      try{
      let prevID = this.persoane[0].id
    
      let mas = [];
      for(let i = 0; i<this.persoane.length; i++){
        if(this.persoane[i].id != prevID){
          
          this.pers2.push({...this.persoane[i-1], masini: mas})
          mas = [];
          prevID = this.persoane[i].id;
          mas.push({marca: this.persoane[i]["masini.denumire_marca"], model: this.persoane[i]["masini.denumire_model"],
        anul: this.persoane[i]["masini.anul_fabricatiei"],
        capacitate: this.persoane[i]["masini.capacitatea_cilindrica"],
        taxa: this.persoane[i]["masini.taxa_de_impozit"] })
        }else{
          mas.push({marca: this.persoane[i]["masini.denumire_marca"], model: this.persoane[i]["masini.denumire_model"],
        anul:this.persoane[i]["masini.anul_fabricatiei"], capacitate: this.persoane[i]["masini.capacitatea_cilindrica"],
      taxa: this.persoane[i]["masini.taxa_de_impozit"] })

        }
        
        if( i == this.persoane.length-1){
          this.pers2.push({ ...this.persoane[i], masini: mas })
        }
      }
    }catch{}

    }).catch();
    
  }



  addEdit = (id_persoane?: number): void => {
    const modalRef = this._modal.open(PersoaneModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_persoane = id_persoane;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (persoane: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți informația având tipul <b>${persoane.nume}</b>, denumirea: <b>${persoane.prenume}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/persoane/${persoane.id}`).then(() => {
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
