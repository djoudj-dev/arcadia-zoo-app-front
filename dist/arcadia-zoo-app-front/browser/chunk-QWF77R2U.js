import{a as D,b as z}from"./chunk-D5UEZZMF.js";import{a as L}from"./chunk-5VXZOEXZ.js";import{a as V}from"./chunk-3PZTUIRH.js";import{b as k,d as R}from"./chunk-63Q2HYMA.js";import{a as $}from"./chunk-D7JCWFOM.js";import{$a as j,Db as M,Gb as T,Ja as a,Ka as g,Pa as c,Sb as f,Ua as y,Ya as m,ab as O,ba as E,bb as U,db as S,dc as A,eb as w,fb as r,fc as I,gb as n,hb as h,ib as b,jb as _,kb as l,la as v,ma as x,qb as d,sb as u,zb as F}from"./chunk-OS3QXM5S.js";var P=(i,e)=>e.type;function G(i,e){if(i&1){let t=b();r(0,"div",7)(1,"app-button",12),_("click",function(){let s=v(t).$implicit,p=l();return x(p.changeFilter(s.type))}),n(),r(2,"span"),d(3),n()()}if(i&2){let t=e.$implicit,o=l();a(),m("text",t.label)("type","button")("color",o.currentFilter()===t.type?"tertiary":"secondary")("rounded",!0)("customClass","font-semibold transition-all duration-300 min-w-[120px]"),a(),j("absolute -top-2 -right-2 ",t.badgeColor," text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-md"),a(),u(" ",o.getCount(t.type)," ")}}function N(i,e){i&1&&(r(0,"div",9),h(1,"div",13),n())}function q(i,e){i&1&&(r(0,"div",10)(1,"p",14),d(2," Aucun avis trouv\xE9 pour ce filtre "),n()())}function H(i,e){if(i&1){let t=b();r(0,"app-button",12),_("click",function(){v(t);let s=l().$implicit,p=l(2);return x(p.validateOpinion(s))}),n(),r(1,"app-button",12),_("click",function(){let s;v(t);let p=l().$implicit,C=l(2);return x(C.rejectOpinion((s=p._id)!==null&&s!==void 0?s:""))}),n()}i&2&&(m("text","Valider")("type","button")("color","success")("rounded",!0)("customClass","text-sm px-4 py-2"),a(),m("text","Rejeter")("type","button")("color","danger")("rounded",!0)("customClass","text-sm px-4 py-2"))}function J(i,e){if(i&1){let t=b();r(0,"app-button",12),_("click",function(){let s;v(t);let p=l().$implicit,C=l(2);return x(C.deleteOpinion((s=p._id)!==null&&s!==void 0?s:""))}),n()}i&2&&m("text","Supprimer")("type","button")("color","danger")("rounded",!0)("customClass","text-sm px-4 py-2")}function K(i,e){if(i&1&&(r(0,"article",15)(1,"div",16)(2,"div",17)(3,"div",18)(4,"span",19),d(5),n()(),r(6,"div")(7,"h3",20),d(8),n(),r(9,"p",21),d(10),M(11,"date"),n()()(),h(12,"app-rate",22),n(),r(13,"p",23),d(14),n(),r(15,"div",24),y(16,H,2,10)(17,J,1,5,"app-button",25),n()()),i&2){let t=e.$implicit,o=l(2);a(5),u(" ",t.name.charAt(0)," "),a(3),u(" ",t.name," "),a(2),u(" ",T(11,7,t.date,"dd MMMM yyyy","fr-FR")," "),a(2),m("rating",o.createRatingSignal(t.rating))("isReadOnly",o.readOnlySignal),a(2),u('"',t.message,'"'),a(2),O(!t.validated&&!t.rejected?16:17)}}function Q(i,e){if(i&1&&(r(0,"div",11),S(1,K,18,11,"article",15,U),n()),i&2){let t=l();a(),w(t.opinions())}}var B=class i{constructor(e,t,o,s){this.userOpinionsService=e;this.toastService=t;this.router=o;this.route=s}allOpinions=c([]);readOnlySignal=c(!0);opinions=f(()=>{switch(this.currentFilter()){case"pending":return this.allOpinions().filter(e=>!e.validated&&!e.rejected);case"validated":return this.allOpinions().filter(e=>e.validated);case"rejected":return this.allOpinions().filter(e=>e.rejected);default:return this.allOpinions()}});isLoading=c(!0);currentFilter=c("pending");filters=[{type:"pending",label:"En attente",badgeColor:"bg-yellow-500"},{type:"validated",label:"Valid\xE9s",badgeColor:"bg-green-500"},{type:"rejected",label:"Rejet\xE9s",badgeColor:"bg-red-500"}];pendingCount=f(()=>this.allOpinions().filter(e=>!e.validated&&!e.rejected).length);validatedCount=f(()=>this.allOpinions().filter(e=>e.validated).length);rejectedCount=f(()=>this.allOpinions().filter(e=>e.rejected).length);ngOnInit(){this.loadAllOpinions(),this.initializeFilter()}initializeFilter(){let e=this.router.url.split("/").pop();e&&["pending","validated","rejected"].includes(e)&&this.currentFilter.set(e)}loadAllOpinions(){this.isLoading.set(!0),this.userOpinionsService.getAllUserOpinions().subscribe({next:e=>{this.allOpinions.set(e),this.isLoading.set(!1)},error:e=>{console.error("Erreur lors du chargement des avis:",e),this.toastService.showError("Erreur lors du chargement des avis"),this.isLoading.set(!1)}})}changeFilter(e){this.currentFilter.set(e),this.router.navigate([e],{relativeTo:this.route,replaceUrl:!0})}getCount(e){switch(e){case"pending":return this.pendingCount();case"validated":return this.validatedCount();case"rejected":return this.rejectedCount();default:return 0}}validateOpinion(e){e?._id&&this.userOpinionsService.validateUserOpinions(e._id).subscribe({next:()=>{this.loadAllOpinions(),this.toastService.showSuccess("Avis valid\xE9 avec succ\xE8s")},error:t=>{console.error("Erreur lors de la validation:",t),this.toastService.showError("Erreur lors de la validation")}})}rejectOpinion(e){this.userOpinionsService.rejectUserOpinions(e).subscribe({next:()=>{this.loadAllOpinions(),this.toastService.showSuccess("Avis rejet\xE9 avec succ\xE8s")},error:t=>{console.error("Erreur lors du rejet:",t),this.toastService.showError("Erreur lors du rejet")}})}deleteOpinion(e){confirm("\xCAtes-vous s\xFBr de vouloir supprimer cet avis ?")&&this.userOpinionsService.deleteUserOpinions(e).subscribe({next:()=>{this.loadAllOpinions(),this.toastService.showSuccess("Avis supprim\xE9 avec succ\xE8s")},error:t=>{console.error("Erreur lors de la suppression:",t),this.toastService.showError("Erreur lors de la suppression")}})}createRatingSignal(e){return c(e)}static \u0275fac=function(t){return new(t||i)(g(z),g(V),g(R),g(k))};static \u0275cmp=E({type:i,selectors:[["app-user-opinion-management"]],standalone:!0,features:[F],decls:16,vars:1,consts:[[1,"w-full","bg-gradient-to-b","from-secondary","to-primary","shadow-lg","py-8"],[1,"container","mx-auto","px-4"],[1,"text-center","space-y-4","mb-12"],[1,"text-3xl","md:text-5xl","lg:text-6xl","font-serif","font-bold","text-quinary"],[1,"text-lg","md:text-xl","text-tertiary","font-serif","italic","max-w-4xl","mx-auto"],[1,"flex","justify-center","mb-8"],[1,"bg-white/80","backdrop-blur-sm","rounded-xl","shadow-lg","p-4","flex","gap-4"],[1,"relative"],[1,"space-y-4"],[1,"flex","justify-center","items-center","h-48"],[1,"bg-white/80","backdrop-blur-sm","rounded-xl","shadow-lg","p-8","text-center"],[1,"grid","grid-cols-1","md:grid-cols-2","gap-6"],[3,"click","text","type","color","rounded","customClass"],[1,"animate-spin","rounded-full","h-12","w-12","border-4","border-tertiary","border-t-transparent"],[1,"text-gray-600","font-medium","text-lg"],[1,"bg-white/80","backdrop-blur-sm","rounded-xl","shadow-lg","p-6","transition-all","duration-300","hover:shadow-xl","hover:-translate-y-1"],[1,"flex","items-center","justify-between","mb-4"],[1,"flex","items-center","gap-4"],[1,"w-12","h-12","bg-gradient-to-br","from-secondary","to-tertiary","rounded-full","flex","items-center","justify-center","shadow-md"],[1,"text-white","text-xl","font-semibold"],[1,"font-semibold","text-lg","text-tertiary"],[1,"text-sm","text-gray-500"],[3,"rating","isReadOnly"],[1,"text-gray-700","mb-6","italic"],[1,"flex","justify-end","gap-3","pt-4","border-t","border-gray-200"],[3,"text","type","color","rounded","customClass"]],template:function(t,o){t&1&&(r(0,"section",0)(1,"div",1)(2,"div",2)(3,"h1",3),d(4," Gestion des Avis Visiteurs "),n(),r(5,"p",4),d(6," G\xE9rez les avis et commentaires des visiteurs "),n(),h(7,"app-toast"),n(),r(8,"div",5)(9,"div",6),S(10,G,4,9,"div",7,P),n()(),r(12,"div",8),y(13,N,2,0,"div",9)(14,q,3,0,"div",10)(15,Q,3,0,"div",11),n()()()),t&2&&(a(10),w(o.filters),a(3),O(o.isLoading()?13:o.opinions().length===0?14:15))},dependencies:[I,A,$,D,L],encapsulation:2})};export{B as a};
