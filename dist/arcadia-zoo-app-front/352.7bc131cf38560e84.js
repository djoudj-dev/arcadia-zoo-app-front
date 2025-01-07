"use strict";(self.webpackChunkarcadia_zoo_app_front=self.webpackChunkarcadia_zoo_app_front||[]).push([[352],{7352:(f,u,i)=>{i.r(u),i.d(u,{AdminDashboardComponent:()=>b});var t=i(4438),l=i(494),d=i(8219),p=i(1593);let m=(()=>{class o{countResourceService;constructor(e){this.countResourceService=e}ngOnInit(){this.loadCountResource()}loadCountResource(){this.countResourceService.getStats().subscribe({next:()=>{console.table([{animaux:this.countResourceService.totalAnimals(),habitats:this.countResourceService.totalHabitats(),services:this.countResourceService.totalServices(),employes:this.countResourceService.totalEmploye(),veterinaires:this.countResourceService.totalVet()}])},error:e=>{console.error("Erreur lors de la r\xe9cup\xe9ration des statistiques:",e)}})}static \u0275fac=function(r){return new(r||o)(t.rXU(p.v))};static \u0275cmp=t.VBU({type:o,selectors:[["app-count-resource"]],standalone:!0,features:[t.aNF],decls:55,vars:5,consts:[[1,"w-full","bg-gradient-to-b","from-secondary","to-primary","shadow-lg","py-8"],[1,"container","mx-auto","px-4"],[1,"text-center","space-y-4","mb-12"],[1,"text-3xl","md:text-5xl","lg:text-6xl","font-serif","font-bold","text-quinary"],[1,"text-lg","md:text-xl","text-tertiary","font-serif","italic","max-w-4xl","mx-auto"],[1,"grid","grid-cols-1","md:grid-cols-2","lg:grid-cols-4","gap-8"],[1,"transform","hover:scale-105","transition-transform","duration-300"],[1,"bg-white","p-6","rounded-2xl","shadow-lg","border-l-4","border-tertiary","hover:shadow-xl"],[1,"flex","flex-col","items-center"],[1,"p-3","bg-tertiary/10","rounded-full","mb-4"],["xmlns","http://www.w3.org/2000/svg","fill","none","viewBox","0 0 24 24","stroke","currentColor",1,"h-8","w-8","text-tertiary"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"],[1,"text-lg","font-serif","font-semibold","text-tertiary"],[1,"text-4xl","font-bold","text-tertiary","mt-2"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"],["stroke-linecap","round","stroke-linejoin","round","stroke-width","2","d","M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"],[1,"flex","gap-4","mt-2"],[1,"text-center","px-3","border-r","border-gray-200"],[1,"text-lg","font-serif","font-semibold","text-tertiary","mt-1"],[1,"text-3xl","font-bold","text-tertiary"],[1,"text-center","px-3"]],template:function(r,n){1&r&&(t.j41(0,"section",0)(1,"div",1)(2,"div",2)(3,"h1",3),t.EFF(4," Statistiques G\xe9n\xe9rales "),t.k0s(),t.j41(5,"p",4),t.EFF(6," Vue d'ensemble des ressources du zoo "),t.k0s()(),t.j41(7,"div",5)(8,"div",6)(9,"div",7)(10,"div",8)(11,"div",9),t.qSk(),t.j41(12,"svg",10),t.nrm(13,"path",11),t.k0s()(),t.joV(),t.j41(14,"h3",12),t.EFF(15," Total Animaux "),t.k0s(),t.j41(16,"p",13),t.EFF(17),t.k0s()()()(),t.j41(18,"div",6)(19,"div",7)(20,"div",8)(21,"div",9),t.qSk(),t.j41(22,"svg",10),t.nrm(23,"path",14),t.k0s()(),t.joV(),t.j41(24,"h3",12),t.EFF(25," Total Habitats "),t.k0s(),t.j41(26,"p",13),t.EFF(27),t.k0s()()()(),t.j41(28,"div",6)(29,"div",7)(30,"div",8)(31,"div",9),t.qSk(),t.j41(32,"svg",10),t.nrm(33,"path",15),t.k0s()(),t.joV(),t.j41(34,"h3",12),t.EFF(35," Total Services "),t.k0s(),t.j41(36,"p",13),t.EFF(37),t.k0s()()()(),t.j41(38,"div",6)(39,"div",7)(40,"div",8)(41,"div",9),t.qSk(),t.j41(42,"svg",10),t.nrm(43,"path",16),t.k0s()(),t.joV(),t.j41(44,"div",17)(45,"div",18)(46,"p",19),t.EFF(47," Employ\xe9s "),t.k0s(),t.j41(48,"p",20),t.EFF(49),t.k0s()(),t.j41(50,"div",21)(51,"p",19),t.EFF(52," V\xe9t\xe9rinaires "),t.k0s(),t.j41(53,"p",20),t.EFF(54),t.k0s()()()()()()()()()),2&r&&(t.R7$(17),t.SpI(" ",n.countResourceService.totalAnimals()," "),t.R7$(10),t.SpI(" ",n.countResourceService.totalHabitats()," "),t.R7$(10),t.SpI(" ",n.countResourceService.totalServices()," "),t.R7$(12),t.SpI(" ",n.countResourceService.totalEmploye()," "),t.R7$(5),t.SpI(" ",n.countResourceService.totalVet()," "))},encapsulation:2})}return o})();const v=(o,a)=>a.route;function x(o,a){if(1&o&&(t.j41(0,"div",11),t.EFF(1),t.k0s()),2&o){const e=t.XpG().$implicit;t.R7$(),t.SpI(" ",e.description," ")}}function h(o,a){if(1&o){const e=t.RV6();t.j41(0,"app-button",10),t.bIt("click",function(){const n=t.eBV(e).$implicit,s=t.XpG();return t.Njj(s.navigateTo(n.route))})("keydown",function(n){const s=t.eBV(e).$implicit,c=t.XpG();return t.Njj("Enter"===n.key&&c.navigateTo(s.route))}),t.DNE(1,x,2,1,"div",11),t.k0s()}if(2&o){const e=a.$implicit,r=t.XpG();t.Y8G("text",e.text)("type","button")("color",r.isActiveRoute(e.route)?"tertiary":"secondary")("rounded",!0)("customClass","w-full font-medium transition-all duration-300"),t.R7$(),t.vxM(e.description?1:-1)}}let b=(()=>{class o{router;navigationItems=[{text:"Animaux",route:"animal-management",description:"G\xe9rer les animaux du zoo"},{text:"Habitats",route:"habitat-management",description:"G\xe9rer les habitats des animaux"},{text:"Services",route:"service-management",description:"G\xe9rer les services du zoo"},{text:"Comptes",route:"account-management",description:"G\xe9rer les comptes utilisateurs"},{text:"Horaires d'ouverture",route:"opening-hours-management",description:"G\xe9rer les horaires du zoo"},{text:"Rapports v\xe9t\xe9rinaires",route:"veterinary-reports",description:"Consulter les rapports v\xe9t\xe9rinaires"},{text:"Historique des actions",route:"history-management",description:"Consulter l'historique des actions"}];activeRoute=(0,t.vPA)("");constructor(e){this.router=e,this.activeRoute.set(this.router.url.split("/").pop()??"")}navigateTo(e){this.activeRoute.set(e),this.router.navigate(["/admin",e])}goBack(){this.router.navigate(["/"])}isActiveRoute(e){return this.activeRoute()===e}static \u0275fac=function(r){return new(r||o)(t.rXU(l.Ix))};static \u0275cmp=t.VBU({type:o,selectors:[["app-admin-dashboard"]],standalone:!0,features:[t.aNF],decls:16,vars:5,consts:[[1,"w-full","bg-gradient-to-b","from-secondary","to-primary","min-h-screen"],[1,"container","mx-auto","px-4","py-8"],[1,"text-center","space-y-4","mb-12"],[1,"text-3xl","md:text-5xl","lg:text-6xl","font-serif","font-bold","text-quinary"],[1,"text-lg","md:text-xl","text-tertiary","font-serif","italic","max-w-4xl","mx-auto"],[1,"bg-white/80","backdrop-blur-sm","rounded-xl","shadow-lg","p-4","mb-8"],[1,"grid","grid-cols-1","sm:grid-cols-2","lg:grid-cols-4","gap-4"],[3,"text","type","color","rounded","customClass"],[1,"bg-white/80","backdrop-blur-sm","rounded-xl","shadow-lg","p-6","mb-8"],[1,"flex","justify-center","mt-8"],[3,"click","keydown","text","type","color","rounded","customClass"],[1,"absolute","bottom-full","left-1/2","transform","-translate-x-1/2","mb-2","px-3","py-1","bg-black/75","text-white","text-sm","rounded-lg","opacity-0","group-hover:opacity-100","transition-opacity","duration-200","whitespace-nowrap","pointer-events-none"]],template:function(r,n){1&r&&(t.j41(0,"section",0)(1,"div",1)(2,"div",2)(3,"h1",3),t.EFF(4," Tableau de Bord Administrateur "),t.k0s(),t.j41(5,"p",4),t.EFF(6," G\xe9rez l'ensemble des fonctionnalit\xe9s du zoo "),t.k0s()(),t.j41(7,"nav",5)(8,"div",6),t.Z7z(9,h,2,6,"app-button",7,v),t.k0s()(),t.j41(11,"div",8),t.nrm(12,"app-count-resource")(13,"router-outlet"),t.k0s(),t.j41(14,"div",9)(15,"app-button",10),t.bIt("click",function(){return n.goBack()})("keydown",function(c){return"Enter"===c.key&&n.goBack()}),t.k0s()()()()),2&r&&(t.R7$(9),t.Dyx(n.navigationItems),t.R7$(6),t.Y8G("text","Retour accueil")("type","button")("color","tertiary")("rounded",!0)("customClass","px-8 py-2 font-medium hover:shadow-lg transition-all duration-300"))},dependencies:[d.Q,m,l.n3],encapsulation:2})}return o})()}}]);