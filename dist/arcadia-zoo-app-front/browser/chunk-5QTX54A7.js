import{a as ct}from"./chunk-3GWMFATD.js";import{a as mt}from"./chunk-PXFAUB5N.js";import{a as ot}from"./chunk-7EALMZ3I.js";import{a as X}from"./chunk-YQ5HTG6F.js";import{a as st}from"./chunk-GAVMKF42.js";import{c as K,e as Q,f as Y,g as Z,h as tt,i as et,r as it,t as at,u as rt}from"./chunk-3GFJ5VFU.js";import{a as lt}from"./chunk-5VTNPVQH.js";import{d as J}from"./chunk-P5Z6PEHU.js";import{a as nt}from"./chunk-SHRURUTQ.js";import{$ as D,Ab as A,E as H,Eb as W,Fa as M,Hb as L,Ka as c,La as g,Qa as F,T as y,Va as x,W as R,Za as b,a as h,b as _,bb as v,c as V,ca as U,eb as B,fb as N,fc as q,gb as n,hb as s,ib as w,jb as k,kb as d,lb as m,lc as G,ma as p,na as u,nc as P,o as $,oa as z,pa as O,qc as C,rb as l,tb as S,wb as T,xb as I,yb as j}from"./chunk-TKCV3HAR.js";var E=class o{constructor(i,t){this.http=i;this.habitatService=t}apiUrl=`${C.apiUrl}/api/admin/habitat-management`;getAllHabitats(){return this.http.get(this.apiUrl).pipe(y(i=>console.log("Habitats re\xE7us:",i)),H(i=>this.handleError("chargement des habitats",i)))}createHabitat(i){return this.http.post(this.apiUrl,i).pipe(y(t=>{console.log("R\xE9ponse du serveur (cr\xE9ation):",t),this.habitatService.clearCache()}),H(t=>(console.error("Erreur d\xE9taill\xE9e (cr\xE9ation):",t),this.handleError("cr\xE9ation de l'habitat",t))))}updateHabitat(i,t){let e=new G({Accept:"application/json"}),r={};return t.forEach((a,f)=>{r[f]=a}),console.log("Donn\xE9es envoy\xE9es pour mise \xE0 jour:",{id:i,data:r}),this.http.put(`${this.apiUrl}/${i}`,r,{headers:e}).pipe(y(a=>{console.log("R\xE9ponse du serveur (mise \xE0 jour):",a),this.habitatService.clearCache()}),H(a=>(console.error("Erreur d\xE9taill\xE9e (mise \xE0 jour):",a),a.error instanceof ErrorEvent?console.error("Erreur client:",a.error.message):console.error("Erreur serveur:",{status:a.status,message:a.message,error:a.error}),this.handleError("mise \xE0 jour de l'habitat",a))))}deleteHabitat(i){return this.http.delete(`${this.apiUrl}/${i}`).pipe(y(()=>{console.log("Habitat supprim\xE9 avec succ\xE8s:",i),this.habitatService.clearCache()}),H(t=>(console.error("Erreur lors de la suppression:",t),this.handleError("suppression de l'habitat",t))))}handleError(i,t){let e=`Erreur lors de ${i}. `;return t.error instanceof ErrorEvent?e+=`Message d'erreur: ${t.error.message}`:(e+=`Code d'erreur: ${t.status}, `,e+=`Message: ${t.error?.message||t.message}`),console.error(e),console.error("D\xE9tails complets de l'erreur:",t),$(()=>new Error(e))}static \u0275fac=function(t){return new(t||o)(D(P),D(st))};static \u0275prov=R({token:o,factory:o.\u0275fac,providedIn:"root"})};var bt=(o,i)=>i.id_habitat;function ht(o,i){o&1&&(n(0,"div",17),z(),n(1,"svg",30),w(2,"path",31),s(),O(),n(3,"p",32)(4,"span",33),l(5,"Cliquez pour t\xE9l\xE9charger"),s(),l(6," ou glissez-d\xE9posez "),s(),n(7,"p",34),l(8," PNG, JPG ou WEBP (MAX. 5MB) "),s()())}function gt(o,i){if(o&1&&w(0,"img",18),o&2){let t=m();b("src",t.newHabitatData.images,M)}}function ft(o,i){if(o&1){let t=k();n(0,"div",35)(1,"p",44),l(2,"Confirmer la suppression ?"),s(),n(3,"div",45)(4,"button",46),d("click",function(){p(t);let r=m().$implicit,a=m();return u(a.deleteHabitat(r.id_habitat))}),l(5," Supprimer "),s(),n(6,"button",47),d("click",function(){p(t);let r=m().$implicit,a=m();return u(a.cancelDeleteHabitat(r.id_habitat))}),l(7," Annuler "),s()()()}}function _t(o,i){if(o&1&&(l(0),W(1,"slice")),o&2){let t=m().$implicit;S(" ",L(1,1,t.description,0,100),"... ")}}function xt(o,i){if(o&1&&l(0),o&2){let t=m().$implicit;S(" ",t.description," ")}}function vt(o,i){o&1&&l(0," Lire la suite ")}function wt(o,i){o&1&&l(0," Voir moins ")}function Ht(o,i){if(o&1){let t=k();x(0,ft,8,0,"div",35),n(1,"div",26)(2,"div",36),w(3,"img",37),n(4,"div",38)(5,"h4",39),l(6),s(),n(7,"p",40)(8,"span",33),l(9,"Description:"),s(),n(10,"span"),x(11,_t,2,5)(12,xt,1,1),s(),n(13,"button",41),d("click",function(){let r=p(t).$implicit,a=m();return u(a.toggleDescription(r.id_habitat))}),x(14,vt,1,0)(15,wt,1,0),s()()(),n(16,"div",42)(17,"app-button",43),d("click",function(){let r=p(t).$implicit,a=m();return u(a.editHabitat(r.id_habitat))})("keydown.enter",function(){let r=p(t).$implicit,a=m();return u(a.editHabitat(r.id_habitat))}),s(),n(18,"app-button",43),d("click",function(){let r=p(t).$implicit,a=m();return u(a.confirmDeleteHabitat(r.id_habitat))})("keydown.enter",function(){let r=p(t).$implicit,a=m();return u(a.confirmDeleteHabitat(r.id_habitat))}),s()()()()}if(o&2){let t=i.$implicit;v(t.showDeleteConfirmation?0:-1),c(3),b("src",t.images,M)("alt",t.name),c(3),S(" ",t.name," "),c(5),v(t.showDescription?12:11),c(3),v(t.showDescription?15:14),c(3),b("text","Modifier")("type","button")("color","secondary")("rounded",!0)("customClass","text-xs px-2 py-1"),c(),b("text","Supprimer")("type","button")("color","red")("rounded",!0)("customClass","text-xs px-2 py-1")}}function yt(o,i){o&1&&(n(0,"p",27),l(1," Aucun habitat n'a \xE9t\xE9 cr\xE9\xE9 "),s())}var dt=class o{constructor(i,t,e,r,a,f){this.router=i;this.habitatManagement=t;this.countResourceService=e;this.toastService=r;this.fileSecurityService=a;this.imageOptimizer=f}habitats=F([]);selectedFile=F(null);newHabitatData={};imageBaseUrl=`${C.apiUrl}/api`;ngOnInit(){this.loadHabitats()}loadHabitats(){this.habitatManagement.getAllHabitats().subscribe({next:i=>{let t=e=>e?e.startsWith("http")?e:`${this.imageBaseUrl}/${e.replace(/^\/+/,"")}`:null;this.habitats.set(i.map(e=>_(h({},e),{showDescription:!1,showDeleteConfirmation:!1,images:t(e.images)})))},error:i=>{console.error("Erreur lors de la r\xE9cup\xE9ration des habitats:",i),this.toastService.showError("Erreur lors du chargement des habitats")}})}onFileSelected(i){return V(this,null,function*(){let t=i.target.files?.[0];if(t)try{let e=yield this.fileSecurityService.scan(t);if(!e.isSafe){this.toastService.showError(e.threats.join(`
`));return}this.selectedFile.set(t);let r=new FileReader;r.onload=()=>{this.newHabitatData.images=r.result},r.readAsDataURL(t),this.toastService.showSuccess("Image s\xE9lectionn\xE9e avec succ\xE8s")}catch(e){console.error("Erreur lors du traitement du fichier:",e),this.toastService.showError("Erreur lors du traitement du fichier")}})}createHabitat(){if(this.validateHabitatData()){let i=this.buildFormData();this.habitatManagement.createHabitat(i).subscribe({next:()=>{this.resetForm(),this.loadHabitats(),this.countResourceService.incrementTotalHabitats(),this.toastService.showSuccess("Habitat cr\xE9\xE9 avec succ\xE8s")},error:t=>{console.error("Erreur lors de la cr\xE9ation de l'habitat :",t),this.toastService.showError("Erreur lors de la cr\xE9ation de l'habitat")}})}else this.toastService.showError("Veuillez remplir tous les champs requis")}updateHabitat(){if(this.validateHabitatData(!0)){let i=this.buildFormData();this.habitatManagement.updateHabitat(this.newHabitatData.id_habitat.toString(),i).subscribe({next:t=>{let r=(a=>a?a.startsWith("http")?a:`${this.imageBaseUrl}/${a.replace(/^\/+/,"")}`:"")(t.images);this.habitats.update(a=>a.map(f=>f.id_habitat===t.id_habitat?_(h({},t),{showDescription:f.showDescription,images:r}):f)),this.resetForm(),this.toastService.showSuccess("Habitat mis \xE0 jour avec succ\xE8s"),this.loadHabitats()},error:t=>{console.error("Erreur lors de la mise \xE0 jour de l'habitat :",t),this.toastService.showError("Erreur lors de la mise \xE0 jour de l'habitat")}})}else this.toastService.showError("Veuillez remplir tous les champs requis")}editHabitat(i){let t=this.habitats().find(e=>e.id_habitat===i);t&&(this.newHabitatData=h({},t),this.toastService.showSuccess("Habitat s\xE9lectionn\xE9 pour modification"))}confirmDeleteHabitat(i){this.habitats.update(t=>t.map(e=>e.id_habitat===i?_(h({},e),{showDeleteConfirmation:!0}):e))}cancelDeleteHabitat(i){this.habitats.update(t=>t.map(e=>e.id_habitat===i?_(h({},e),{showDeleteConfirmation:!1}):e))}deleteHabitat(i){if(!i){this.toastService.showError("ID d'habitat invalide");return}this.habitatManagement.deleteHabitat(i.toString()).subscribe({next:()=>{this.habitats.update(t=>t.filter(e=>e.id_habitat!==i)),this.countResourceService.decrementTotalHabitats(),this.loadHabitats(),this.resetForm(),this.toastService.showSuccess("Habitat supprim\xE9 avec succ\xE8s")},error:t=>{console.error("Erreur lors de la suppression de l'habitat:",t),this.toastService.showError("Erreur lors de la suppression de l'habitat")}})}resetForm(){this.newHabitatData={},this.selectedFile.set(null)}cancel(){this.resetForm(),this.toastService.showSuccess("Formulaire r\xE9initialis\xE9")}toggleDescription(i){this.habitats.update(t=>t.map(e=>e.id_habitat===i?_(h({},e),{showDescription:!e.showDescription}):e))}goBack(){this.router.navigate(["/admin"])}validateHabitatData(i=!1){let{name:t,description:e}=this.newHabitatData,r=i||this.newHabitatData.images||this.selectedFile();return console.log("Validation des donn\xE9es:",{name:t,description:e,hasImage:r,newHabitatData:this.newHabitatData,selectedFile:this.selectedFile()}),!!(t&&e&&r)}buildFormData(){let i=new FormData,t=this.newHabitatData;Object.entries(t).forEach(([r,a])=>{a!=null&&i.append(r,a.toString())});let e=this.selectedFile();if(e){let r=this.imageOptimizer.sanitizeFileName(e.name);i.append("images",e,r)}return i}static \u0275fac=function(t){return new(t||o)(g(J),g(E),g(lt),g(X),g(mt),g(ct))};static \u0275cmp=U({type:o,selectors:[["app-habitat-management"]],standalone:!0,features:[A],decls:42,vars:17,consts:[[1,"w-full","bg-gradient-to-b","from-secondary","to-primary","shadow-lg","py-8"],[1,"container","mx-auto","px-4"],[1,"text-center","space-y-4","mb-12"],[1,"text-3xl","md:text-5xl","lg:text-6xl","font-serif","font-bold","text-quinary"],[1,"text-lg","md:text-xl","text-tertiary","font-serif","italic","max-w-4xl","mx-auto"],[1,"flex","flex-col","lg:flex-row","gap-8"],[1,"w-full","lg:w-1/2","bg-white","rounded-2xl","shadow-lg","p-6","space-y-6"],[1,"text-2xl","font-serif","font-semibold","text-tertiary","mb-6"],["enctype","multipart/form-data",1,"space-y-6",3,"ngSubmit"],["for","name",1,"block","text-lg","font-medium","text-tertiary","mb-2"],["type","text","id","name","name","name","required","","placeholder","Nom de l'habitat",1,"w-full","p-3","border","border-secondary/30","rounded-lg","focus:ring-2","focus:ring-tertiary","focus:border-transparent",3,"ngModelChange","ngModel"],["for","description",1,"block","text-lg","font-medium","text-tertiary","mb-2"],["id","description","name","description","required","","rows","4","placeholder","Description de l'habitat",1,"w-full","p-3","border","border-secondary/30","rounded-lg","focus:ring-2","focus:ring-tertiary","focus:border-transparent",3,"ngModelChange","ngModel"],[1,"mb-4"],["for","habitatImage",1,"block","text-sm","font-medium","text-gray-700","mb-2"],[1,"flex","items-center","justify-center","w-full"],[1,"flex","flex-col","items-center","justify-center","w-full","h-64","border-2","border-gray-300","border-dashed","rounded-lg","cursor-pointer","bg-gray-50","hover:bg-gray-100","transition-all","duration-300"],[1,"flex","flex-col","items-center","justify-center","pt-5","pb-6"],["alt","Aper\xE7u",1,"w-full","h-full","object-cover","rounded-lg",3,"src"],["id","habitatImage","type","file","accept","image/*",1,"hidden",3,"change"],[1,"flex","gap-4","pt-4"],[1,"w-1/2",3,"text","type","color","rounded"],[1,"w-1/2",3,"click","keydown.enter","text","type","color","rounded"],[1,"w-full","lg:w-1/2","space-y-8"],[1,"bg-white","rounded-2xl","shadow-lg","p-6"],[1,"space-y-4"],[1,"bg-gray-50","rounded-xl","p-4","shadow-md","hover:shadow-lg","transition-all","duration-300"],[1,"text-center","text-gray-500","italic"],[1,"flex","justify-center","pt-8"],[1,"w-full","sm:w-1/3","lg:w-1/4","font-bold","shadow-md","hover:shadow-lg","transition-all","duration-300",3,"click","keydown.enter","text","type","color","rounded"],["aria-hidden","true","xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 20 16",1,"w-8","h-8","mb-4","text-gray-500"],["stroke","currentColor","stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"],[1,"mb-2","text-sm","text-gray-500"],[1,"font-semibold"],[1,"text-xs","text-gray-500"],[1,"mt-4"],[1,"flex","flex-col","sm:flex-row","items-center","gap-4"],[1,"w-32","h-32","object-cover","rounded-lg","shadow-md",3,"src","alt"],[1,"flex-1","space-y-2"],[1,"text-lg","font-bold","text-tertiary"],[1,"text-sm","text-gray-600"],[1,"text-tertiary","hover:text-tertiary/80","ml-2","underline",3,"click"],[1,"flex","gap-2"],[3,"click","keydown.enter","text","type","color","rounded","customClass"],[1,"text-gray-800"],[1,"flex","justify-end","gap-2","mt-2"],[1,"px-4","py-2","bg-red-500","text-white","rounded","hover:bg-red-600",3,"click"],[1,"px-4","py-2","bg-gray-300","text-gray-700","rounded","hover:bg-gray-400",3,"click"]],template:function(t,e){t&1&&(n(0,"section",0)(1,"div",1)(2,"div",2)(3,"h1",3),l(4," Gestion des Habitats "),s(),n(5,"p",4),l(6," Cr\xE9ez et g\xE9rez les habitats du zoo "),s()(),n(7,"div",5)(8,"div",6)(9,"h3",7),l(10),s(),n(11,"form",8),d("ngSubmit",function(){return e.newHabitatData.id_habitat?e.updateHabitat():e.createHabitat()}),n(12,"div")(13,"label",9),l(14," Nom de l'habitat "),s(),n(15,"input",10),j("ngModelChange",function(a){return I(e.newHabitatData.name,a)||(e.newHabitatData.name=a),a}),s()(),n(16,"div")(17,"label",11),l(18," Description "),s(),n(19,"textarea",12),j("ngModelChange",function(a){return I(e.newHabitatData.description,a)||(e.newHabitatData.description=a),a}),s()(),n(20,"div",13)(21,"label",14),l(22," Image de l'habitat "),s(),n(23,"div",15)(24,"label",16),x(25,ht,9,0,"div",17)(26,gt,1,1,"img",18),n(27,"input",19),d("change",function(a){return e.onFileSelected(a)}),s()()()(),n(28,"div",20),w(29,"app-button",21),n(30,"app-button",22),d("click",function(){return e.cancel()})("keydown.enter",function(){return e.cancel()}),s()()()(),n(31,"div",23)(32,"div",24)(33,"h3",7),l(34," Liste des habitats "),s(),n(35,"div",25),w(36,"app-toast"),B(37,Ht,19,16,"div",26,bt),x(39,yt,2,0,"p",27),s()()()(),n(40,"div",28)(41,"app-button",29),d("click",function(){return e.goBack()})("keydown.enter",function(){return e.goBack()}),s()()()()),t&2&&(c(10),S(" ",e.newHabitatData.id_habitat?"Modifier l'habitat":"Cr\xE9er un habitat"," "),c(5),T("ngModel",e.newHabitatData.name),c(4),T("ngModel",e.newHabitatData.description),c(6),v(e.newHabitatData.images?26:25),c(4),b("text",e.newHabitatData.id_habitat?"Modifier":"Cr\xE9er")("type","submit")("color","tertiary")("rounded",!0),c(),b("text","Annuler")("type","button")("color","secondary")("rounded",!0),c(7),N(e.habitats()),c(2),v(e.habitats().length?-1:39),c(2),b("text","Retour")("type","button")("color","tertiary")("rounded",!0))},dependencies:[rt,et,K,Q,Y,it,at,tt,Z,q,ot,nt],encapsulation:2})};export{dt as HabitatManagementComponent};
