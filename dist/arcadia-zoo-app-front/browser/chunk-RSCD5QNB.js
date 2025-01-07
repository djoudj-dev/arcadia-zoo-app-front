import{a as X}from"./chunk-GWJNGM3I.js";import{a as K}from"./chunk-5VXZOEXZ.js";import{a as F}from"./chunk-3PZTUIRH.js";import{c as D,e as I,f as N,h as q,j,k as B,p as P,q as L,r as O,t as z,v as G,w as H}from"./chunk-XTDWMBHN.js";import{a as Q}from"./chunk-JTG5FMLG.js";import{d as W}from"./chunk-63Q2HYMA.js";import{a as J}from"./chunk-D7JCWFOM.js";import{Ja as a,Ka as v,Pa as y,Ua as T,Ya as u,a as S,ab as R,b as A,ba as k,db as h,eb as x,fb as n,gb as t,hb as C,ib as E,jb as m,kb as w,la as f,ma as _,qb as l,rb as M,sb as b,vb as d,wb as p,xb as g,zb as V}from"./chunk-OS3QXM5S.js";var U=(c,i)=>i.id;function $(c,i){if(c&1&&(n(0,"option",16),l(1),t()),c&2){let r=i.$implicit;u("ngValue",r),a(),M(r.name)}}function ee(c,i){if(c&1){let r=E();n(0,"div",24)(1,"p",37),l(2," \xCAtes-vous s\xFBr de vouloir supprimer ce compte ? "),t(),n(3,"div",38)(4,"button",39),m("click",function(){f(r);let s=w();return _(s.deleteAccount(s.accountToDelete))}),l(5," Confirmer "),t(),n(6,"button",40),m("click",function(){f(r);let s=w();return _(s.accountToDelete=null)}),l(7," Annuler "),t()()()}}function te(c,i){if(c&1){let r=E();n(0,"div",26)(1,"h4",41),l(2),t(),n(3,"p",42)(4,"span",43),l(5,"Email :"),t(),l(6),t(),n(7,"p",44)(8,"span",43),l(9,"R\xF4le :"),t(),l(10),t(),n(11,"div",45)(12,"app-button",46),m("click",function(){let s=f(r).$implicit,o=w();return _(o.editUser(s))}),t(),n(13,"app-button",46),m("click",function(){let s=f(r).$implicit,o=w();return _(o.confirmDeleteAccount(s.id))}),t()()()}if(c&2){let r=i.$implicit;a(2),b(" ",r.name," "),a(4),b(" ",r.email," "),a(4),b(" ",r.role?r.role.name:"Non d\xE9fini"," "),a(2),u("text","Modifier")("type","button")("color","secondary")("rounded",!0)("customClass","text-xs px-2 py-1"),a(),u("text","Supprimer")("type","button")("color","red")("rounded",!0)("customClass","text-xs px-2 py-1")}}function ne(c,i){if(c&1&&(n(0,"option",16),l(1),t()),c&2){let r=i.$implicit;u("ngValue",r),a(),M(r.name)}}var Y=class c{constructor(i,r,e,s){this.router=i;this.accountService=r;this.countResourceService=e;this.toastService=s}users=y([]);roles=y([]);newUser=y({});accountToDelete=null;ngOnInit(){this.loadUsers(),this.loadRoles()}loadUsers(){this.accountService.getAllUsers().subscribe({next:i=>this.users.set(i||[]),error:i=>{console.error("Erreur de chargement des utilisateurs :",i),this.toastService.showError("Erreur lors du chargement des utilisateurs")}})}loadRoles(){this.accountService.getRoles().subscribe({next:i=>this.roles.set(i||[]),error:i=>{console.error("Erreur de chargement des r\xF4les :",i),this.toastService.showError("Erreur lors du chargement des r\xF4les")}})}createAccount(){let{name:i,email:r,role:e}=this.newUser();if(!i||!r||!e?.id){this.toastService.showError("Veuillez remplir tous les champs requis");return}let s={name:i,email:r,role_id:e.id};this.accountService.createUser(s).subscribe({next:o=>{this.users.update(Z=>[...Z,o]),this.newUser.set({}),this.countResourceService.incrementTotalEmploye(),this.toastService.showSuccess("Compte cr\xE9\xE9 avec succ\xE8s ! Un email a \xE9t\xE9 envoy\xE9 avec les identifiants.")},error:o=>{console.error("Erreur de cr\xE9ation d'utilisateur :",o),this.toastService.showError("Une erreur est survenue lors de la cr\xE9ation du compte")}})}updateAccount(){let{name:i,role:r}=this.newUser();if(!i||!r?.id){this.toastService.showError("Informations de mise \xE0 jour incompl\xE8tes");return}let e=S({},this.newUser());r&&(e.role_id=r.id),this.accountService.updateUser(e).subscribe({next:()=>{this.loadUsers(),this.newUser.set({}),this.toastService.showSuccess("Compte mis \xE0 jour avec succ\xE8s")},error:s=>{console.error("Erreur de mise \xE0 jour d'utilisateur :",s),this.toastService.showError("Une erreur est survenue lors de la mise \xE0 jour du compte")}})}editUser(i){this.newUser.set(A(S({},i),{password:""}))}confirmDeleteAccount(i){this.accountToDelete=i}deleteAccount(i){this.accountService.deleteUser(i).subscribe({next:()=>{this.users.update(r=>r.filter(e=>e.id!==i)),this.toastService.showSuccess("Compte supprim\xE9 avec succ\xE8s"),this.accountToDelete=null},error:r=>{console.error("Erreur de suppression d'utilisateur :",r),this.toastService.showError("Erreur lors de la suppression du compte"),this.accountToDelete=null}})}cancel(){this.newUser.set({})}goBack(){this.router.navigate(["/admin"])}static \u0275fac=function(r){return new(r||c)(v(W),v(X),v(Q),v(F))};static \u0275cmp=k({type:c,selectors:[["app-account-management"]],standalone:!0,features:[V],decls:68,vars:25,consts:[[1,"w-full","bg-gradient-to-b","from-secondary","to-primary","shadow-lg","py-8"],[1,"container","mx-auto","px-4"],[1,"text-center","space-y-4","mb-12"],[1,"text-3xl","md:text-5xl","lg:text-6xl","font-serif","font-bold","text-quinary"],[1,"text-lg","md:text-xl","text-tertiary","font-serif","italic","max-w-4xl","mx-auto"],[1,"grid","grid-cols-1","lg:grid-cols-2","gap-8","max-w-7xl","mx-auto","mb-12"],[1,"bg-white","rounded-2xl","shadow-lg","p-6","space-y-6"],[1,"text-2xl","font-serif","font-semibold","text-tertiary","mb-6"],[1,"space-y-6"],["for","name",1,"block","text-lg","font-medium","text-tertiary","mb-2"],["type","text","id","name","name","name","required","",1,"w-full","p-3","border","border-secondary/30","rounded-lg","focus:ring-2","focus:ring-tertiary","focus:border-transparent",3,"ngModelChange","ngModel"],["for","email",1,"block","text-lg","font-medium","text-tertiary","mb-2"],["type","email","id","email","name","email","required","",1,"w-full","p-3","border","border-secondary/30","rounded-lg","focus:ring-2","focus:ring-tertiary","focus:border-transparent",3,"ngModelChange","ngModel"],["for","role",1,"block","text-lg","font-medium","text-tertiary","mb-2"],["id","role","name","role","required","",1,"w-full","p-3","border","border-secondary/30","rounded-lg","focus:ring-2","focus:ring-tertiary","focus:border-transparent",3,"ngModelChange","ngModel"],["value",""],[3,"ngValue"],[1,"p-4","bg-blue-50","rounded-lg"],[1,"text-sm","text-tertiary"],[1,"flex","gap-4"],[1,"w-1/2",3,"click","text","type","color","rounded"],[1,"bg-white","rounded-2xl","shadow-lg","p-6"],[1,"relative"],[3,"customClass"],[1,"mb-6","p-4","bg-yellow-50","border-l-4","border-yellow-400","rounded-lg"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-4"],[1,"bg-gray-50","rounded-xl","p-4","shadow-md","hover:shadow-lg","transition-all","duration-300"],[1,"flex","justify-center"],[1,"w-full","sm:w-1/3","lg:w-1/4","font-bold","shadow-md","hover:shadow-lg","transition-all","duration-300",3,"click","text","type","color","rounded"],["for","name",1,"block","text-lg","font-medium"],["type","text","id","name","name","name","required","",1,"w-full","p-3","border","rounded-lg","focus:ring-2","focus:ring-tertiary",3,"ngModelChange","ngModel"],["for","email",1,"block","text-lg","font-medium"],["type","email","id","email","name","email","required","",1,"w-full","p-3","border","rounded-lg","focus:ring-2","focus:ring-tertiary",3,"ngModelChange","ngModel"],["for","role",1,"block","text-lg","font-medium"],["id","role","name","role","required","",1,"w-full","p-3","border","rounded-lg","focus:ring-2","focus:ring-tertiary",3,"ngModelChange","ngModel"],[1,"p-4","bg-blue-50","rounded-lg","text-sm"],[1,"w-1/2",3,"click","text","type"],[1,"text-yellow-800"],[1,"mt-4","flex","gap-2","justify-end"],[1,"px-4","py-2","bg-red-500","text-white","rounded","hover:bg-red-600",3,"click"],[1,"px-4","py-2","bg-gray-300","text-gray-700","rounded","hover:bg-gray-400",3,"click"],[1,"text-lg","font-bold","text-tertiary","mb-2"],[1,"text-sm","text-gray-600","mb-1"],[1,"font-semibold"],[1,"text-sm","text-gray-600","mb-3"],[1,"flex","gap-2"],[3,"click","text","type","color","rounded","customClass"]],template:function(r,e){r&1&&(n(0,"section",0)(1,"div",1)(2,"div",2)(3,"h1",3),l(4," Gestion des Comptes "),t(),n(5,"p",4),l(6," Cr\xE9ez et g\xE9rez les comptes utilisateurs "),t(),C(7,"app-toast"),t(),n(8,"div",5)(9,"div",6)(10,"h3",7),l(11),t(),n(12,"form",8)(13,"div")(14,"label",9),l(15," Nom d'utilisateur "),t(),n(16,"input",10),g("ngModelChange",function(o){return p(e.newUser().name,o)||(e.newUser().name=o),o}),t()(),n(17,"div")(18,"label",11),l(19," Email "),t(),n(20,"input",12),g("ngModelChange",function(o){return p(e.newUser().email,o)||(e.newUser().email=o),o}),t()(),n(21,"div")(22,"label",13),l(23," R\xF4le "),t(),n(24,"select",14),g("ngModelChange",function(o){return p(e.newUser().role,o)||(e.newUser().role=o),o}),n(25,"option",15),l(26,"- Choisir un r\xF4le -"),t(),h(27,$,2,2,"option",16,U),t()(),n(29,"div",17)(30,"p",18),l(31," Un email contenant les identifiants sera envoy\xE9 automatiquement. "),t()(),n(32,"div",19)(33,"app-button",20),m("click",function(){return e.newUser().id?e.updateAccount():e.createAccount()}),t(),n(34,"app-button",20),m("click",function(){return e.cancel()}),t()()()(),n(35,"div",21)(36,"h3",7),l(37," Liste des comptes "),t(),n(38,"div",22),C(39,"app-toast",23),t(),T(40,ee,8,0,"div",24),n(41,"div",25),h(42,te,14,13,"div",26,U),t()()(),n(44,"div",27)(45,"app-button",28),m("click",function(){return e.goBack()}),t()()()(),n(46,"form",8)(47,"div")(48,"label",29),l(49,"Nom"),t(),n(50,"input",30),g("ngModelChange",function(o){return p(e.newUser().name,o)||(e.newUser().name=o),o}),t()(),n(51,"div")(52,"label",31),l(53,"Email"),t(),n(54,"input",32),g("ngModelChange",function(o){return p(e.newUser().email,o)||(e.newUser().email=o),o}),t()(),n(55,"div")(56,"label",33),l(57,"R\xF4le"),t(),n(58,"select",34),g("ngModelChange",function(o){return p(e.newUser().role,o)||(e.newUser().role=o),o}),n(59,"option",15),l(60,"- Choisir un r\xF4le -"),t(),h(61,ne,2,2,"option",16,U),t()(),n(63,"div",35),l(64," Un email contenant les identifiants sera envoy\xE9 automatiquement. "),t(),n(65,"div",19)(66,"app-button",36),m("click",function(){return e.newUser().id?e.updateAccount():e.createAccount()}),t(),n(67,"app-button",36),m("click",function(){return e.cancel()}),t()()()),r&2&&(a(11),b(" ",e.newUser().id?"Modifier le compte":"Cr\xE9er un compte"," "),a(5),d("ngModel",e.newUser().name),a(4),d("ngModel",e.newUser().email),a(4),d("ngModel",e.newUser().role),a(3),x(e.roles()),a(6),u("text",e.newUser().id?"Modifier":"Cr\xE9er")("type","button")("color","tertiary")("rounded",!0),a(),u("text","Annuler")("type","button")("color","secondary")("rounded",!0),a(5),u("customClass","relative"),a(),R(e.accountToDelete!=null?40:-1),a(2),x(e.users()),a(3),u("text","Retour")("type","button")("color","tertiary")("rounded",!0),a(5),d("ngModel",e.newUser().name),a(4),d("ngModel",e.newUser().email),a(4),d("ngModel",e.newUser().role),a(3),x(e.roles()),a(5),u("text",e.newUser().id?"Modifier":"Cr\xE9er")("type","button"),a(),u("text","Annuler")("type","button"))},dependencies:[H,B,L,O,D,P,I,N,z,G,j,q,K,J],encapsulation:2})};export{Y as AccountManagementComponent};
