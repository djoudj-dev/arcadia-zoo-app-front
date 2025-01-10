import{a as B}from"./chunk-YQ5HTG6F.js";import{a as N}from"./chunk-3TXI3TAG.js";import"./chunk-IQHRYKAE.js";import{$a as x,Ab as D,Eb as $,Fa as w,Gb as k,Ka as r,La as _,R as h,Va as f,Za as R,a as u,ab as C,b as g,bb as c,ca as S,cb as V,eb as I,ec as A,fb as M,gb as o,gc as F,hb as a,ib as p,jb as T,kb as j,lb as m,ma as b,na as E,rb as s,s as v,tb as l,vb as L,x as y}from"./chunk-TKCV3HAR.js";function q(n,i){n&1&&(o(0,"div",3),p(1,"div",7),a())}function z(n,i){if(n&1&&(o(0,"div",4),s(1),a()),n&2){let e=m();r(),l(" ",e.error," ")}}function J(n,i){n&1&&(o(0,"div",5),s(1," Aucun rapport v\xE9t\xE9rinaire disponible. "),a())}function U(n,i){if(n&1&&(o(0,"p",16)(1,"span",17),s(2,"D\xE9tails suppl\xE9mentaires:"),a(),s(3),a()),n&2){let e=m().$implicit;r(3),l(" ",e.additional_details," ")}}function G(n,i){if(n&1){let e=T();o(0,"div",8)(1,"div",9)(2,"div",10),p(3,"img",11),o(4,"div",12)(5,"div")(6,"h3",13),s(7),a(),o(8,"p",14),s(9),$(10,"date"),a()(),o(11,"div",15)(12,"p",16)(13,"span",17),s(14,"Alimentation recommand\xE9e:"),a(),s(15),a(),f(16,U,4,1,"p",16),o(17,"p",14)(18,"span",17),s(19,"V\xE9t\xE9rinaire:"),a(),s(20),a()()()(),o(21,"div",18)(22,"span",19),p(23,"i"),s(24),a(),o(25,"button",20),j("click",function(){let d=b(e).$implicit,P=m(2);return E(P.toggleReportStatus(d))}),s(26),a()()()()}if(n&2){let e,t=i.$implicit,d=m(2);r(3),R("src",t.animal_photo,w)("alt",t.animal_name),r(4),l(" Animal: ",t.animal_name," "),r(2),l(" Date de visite: ",k(10,18,t.visit_date,"dd/MM/yyyy")," "),r(6),L(" ",t.recommended_food_quantity,"",t.food_unit," de ",t.recommended_food_type," "),r(),c(t.additional_details?16:-1),r(4),l(" ",t.user_name," "),r(2),x(d.getStateClass(t.animal_state)),r(),C("fas fa-",d.getStateIcon(t.animal_state),""),r(),l(" ",t.animal_state," "),r(),x(d.getStatusButtonClass((e=t.is_processed)!==null&&e!==void 0?e:!1)),r(),l(" ",t.is_processed?"Trait\xE9":"Non trait\xE9"," ")}}function H(n,i){if(n&1&&(o(0,"div",6),I(1,G,27,21,"div",8,V),a()),n&2){let e=m();r(),M(e.reports)}}var O=class n{constructor(i,e){this.veterinaryReportsService=i;this.toastService=e}reports=[];isLoading=!0;error=null;ngOnInit(){this.loadReports()}loadReports(){this.isLoading=!0,this.veterinaryReportsService.getAllReports().pipe(v(i=>i.map(e=>g(u({},e),{id_veterinary_reports:e._id,is_processed:e.is_treated||!1}))),h(i=>y(i.map(e=>this.veterinaryReportsService.fetchAnimalDetails(e.id_animal).pipe(v(t=>g(u({},e),{animal_photo:t.images||"",animal_name:t.name}))))))).subscribe({next:i=>{this.reports=i,this.isLoading=!1,this.toastService.showSuccess("Rapports charg\xE9s avec succ\xE8s")},error:i=>{this.error="Erreur lors du chargement des rapports",this.isLoading=!1,console.error("Erreur:",i),this.toastService.showError("Erreur lors du chargement des rapports")}})}getStateClass(i){let e="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap min-w-[140px] justify-center";switch(i.toLowerCase()){case"bonne sant\xE9":return`${e} bg-green-100 text-green-700`;case"malade":return`${e} bg-red-100 text-red-700`;case"en traitement":return`${e} bg-yellow-100 text-yellow-700`;case"en observation":return`${e} bg-blue-100 text-blue-700`;default:return`${e} bg-gray-100 text-gray-700`}}getStateIcon(i){switch(i.toLowerCase()){case"bonne sant\xE9":return"check-circle";case"malade":return"exclamation-circle";case"en traitement":return"clock";case"en observation":return"eye";default:return"information-circle"}}toggleReportStatus(i){let e=i._id||i.id_veterinary_reports;if(!e){this.toastService.showError("ID du rapport non d\xE9fini");return}let t=!i.is_processed;this.veterinaryReportsService.updateReportStatus(e,t).subscribe({next:()=>{i.is_processed=t,i.is_treated=t,this.toastService.showSuccess("Statut du rapport mis \xE0 jour avec succ\xE8s")},error:d=>{console.error("Erreur lors de la mise \xE0 jour du statut:",d),i.is_processed=!t,i.is_treated=!t,this.toastService.showError("Erreur lors de la mise \xE0 jour du statut")}})}getStatusButtonClass(i){return i?"bg-green-100 text-green-700 hover:bg-green-200":"bg-yellow-100 text-yellow-700 hover:bg-yellow-200"}static \u0275fac=function(e){return new(e||n)(_(N),_(B))};static \u0275cmp=S({type:n,selectors:[["app-reports-veterinary-management"]],standalone:!0,features:[D],decls:8,vars:4,consts:[[1,"container","mx-auto","px-4","py-8"],[1,"bg-white","rounded-lg","shadow-lg","p-6"],[1,"text-2xl","font-serif","text-tertiary","mb-6"],[1,"flex","justify-center","items-center","py-8"],[1,"bg-red-100","text-red-700","p-4","rounded-lg","mb-6"],[1,"text-center","py-8","text-gray-600"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-6"],[1,"animate-spin","rounded-full","h-8","w-8","border-b-2","border-tertiary"],[1,"bg-gray-50","rounded-lg","p-6","shadow-sm"],[1,"flex","justify-between","items-start"],[1,"flex","items-start","gap-4","w-full"],[1,"w-16","h-16","rounded-full","object-cover",3,"src","alt"],[1,"space-y-4","flex-grow"],[1,"text-lg","font-medium","text-tertiary"],[1,"text-sm","text-gray-600"],[1,"space-y-2"],[1,"text-sm"],[1,"font-medium"],[1,"flex","flex-col","items-end","gap-2"],[1,"ml-2"],[1,"px-3","py-1","rounded-full","text-sm","font-medium","transition-colors",3,"click"]],template:function(e,t){e&1&&(o(0,"div",0)(1,"div",1)(2,"h1",2),s(3," Rapports V\xE9t\xE9rinaires "),a(),f(4,q,2,0,"div",3)(5,z,2,1,"div",4)(6,J,2,0,"div",5)(7,H,3,0,"div",6),a()()),e&2&&(r(4),c(t.isLoading?4:-1),r(),c(t.error?5:-1),r(),c(!t.isLoading&&!t.error&&t.reports.length===0?6:-1),r(),c(!t.isLoading&&t.reports.length>0?7:-1))},dependencies:[F,A],encapsulation:2})};export{O as ReportsVeterinaryManagement};
