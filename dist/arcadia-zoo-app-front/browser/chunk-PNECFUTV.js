import{a as h}from"./chunk-GWO2KCD4.js";import{a as y}from"./chunk-DXKISGBH.js";import{o as S}from"./chunk-2QYQOEU4.js";import{c as x,d as g}from"./chunk-ZZFP4HC6.js";import{t as _}from"./chunk-H7WWMUX6.js";import{$ as u,$a as l,Da as i,Ea as c,Pa as r,Va as t,Wa as e,Xa as f,cb as n,eb as d,kb as b}from"./chunk-FRW6CNJS.js";var v=class p{constructor(s){this.statsService=s}ngOnInit(){this.statsService.getStats()}static \u0275fac=function(o){return new(o||p)(c(h))};static \u0275cmp=u({type:p,selectors:[["app-stats"]],standalone:!0,features:[b],decls:31,vars:5,consts:[[1,"p-6","bg-gray-100","rounded-lg","shadow-md"],[1,"text-2xl","font-semibold","text-center","text-gray-800","mb-6"],[1,"grid","grid-cols-1","md:grid-cols-2","lg:grid-cols-4","gap-6","text-center"],[1,"bg-white","p-6","rounded-lg","shadow-md","border","border-gray-200"],[1,"text-lg","font-semibold","text-gray-600"],[1,"text-3xl","font-bold","text-blue-500","mt-2"],[1,"text-3xl","font-bold","text-green-500","mt-2"],[1,"text-3xl","font-bold","text-indigo-500","mt-2"],[1,"mt-2"],[1,"text-3xl","font-bold","text-red-500"],[1,"text-lg","font-semibold","text-gray-600","mt-2"]],template:function(o,a){o&1&&(t(0,"div",0)(1,"h2",1),n(2," Statistiques G\xE9n\xE9rales "),e(),t(3,"div",2)(4,"div",3)(5,"p",4),n(6,"Nombre total d'animaux"),e(),t(7,"p",5),n(8),e()(),t(9,"div",3)(10,"p",4),n(11,"Nombre total d'habitats"),e(),t(12,"p",6),n(13),e()(),t(14,"div",3)(15,"p",4),n(16," Nombre total de services "),e(),t(17,"p",7),n(18),e()(),t(19,"div",3)(20,"p",4),n(21," Nombre total du personnel "),e(),t(22,"div",8)(23,"p",4),n(24,"Employ\xE9s :"),e(),t(25,"p",9),n(26),e(),t(27,"p",10),n(28,"V\xE9t\xE9rinaires :"),e(),t(29,"p",9),n(30),e()()()()()),o&2&&(i(8),d(" ",a.statsService.totalAnimals()," "),i(5),d(" ",a.statsService.totalHabitats()," "),i(5),d(" ",a.statsService.totalServices()," "),i(8),d(" ",a.statsService.totalEmploye()," "),i(4),d(" ",a.statsService.totalVet()," "))},encapsulation:2})};var E=class p{constructor(s,o){this.router=s;this.tokenService=o}navigateTo(s){this.router.navigate([s])}goBack(){this.router.navigate(["/"])}static \u0275fac=function(o){return new(o||p)(c(g),c(y))};static \u0275cmp=u({type:p,selectors:[["app-dashboard"]],standalone:!0,features:[b],decls:22,vars:28,consts:[[1,"admin-dashboard","p-4","sm:p-8","bg-primary"],[1,"text-xl","sm:text-2xl","lg:text-3xl","font-bold","mb-6","sm:mb-8","text-center"],[1,"bg-secondary","rounded-lg","shadow-lg","shadow-tertiary","mb-4"],[1,"flex","flex-wrap","gap-2","justify-center","py-4","px-2"],[1,"font-bold","py-1","sm:px-4","sm:py-2","text-sm","sm:text-base",3,"click","text","type","color","rounded"],[1,"flex","justify-center","pt-4"],[1,"w-full","sm:w-1/4","lg:w-1/5"],[1,"w-full","font-bold","py-1","sm:px-4","sm:py-2","text-sm","sm:text-base",3,"click","text","type","color","rounded"]],template:function(o,a){o&1&&(t(0,"div",0)(1,"h1",1),n(2," Panneau d'administration du Zoo "),e(),t(3,"nav",2)(4,"ul",3)(5,"li")(6,"app-button",4),l("click",function(){return a.navigateTo("admin/account-management")}),e()(),t(7,"li")(8,"app-button",4),l("click",function(){return a.navigateTo("admin/service-management")}),e()(),t(9,"li")(10,"app-button",4),l("click",function(){return a.navigateTo("admin/habitat-management")}),e()(),t(11,"li")(12,"app-button",4),l("click",function(){return a.navigateTo("admin/animal-management")}),e()(),t(13,"li")(14,"app-button",4),l("click",function(){return a.navigateTo("admin/vet-reports")}),e()(),t(15,"li")(16,"app-button",4),l("click",function(){return a.navigateTo("admin/habitats-dashboard")}),e()()()(),f(17,"app-stats")(18,"router-outlet"),t(19,"div",5)(20,"div",6)(21,"app-button",7),l("click",function(){return a.goBack()}),e()()()()),o&2&&(i(6),r("text","Gestion des comptes")("type","button")("color","tertiary")("rounded",!0),i(2),r("text","Gestion des services")("type","button")("color","tertiary")("rounded",!0),i(2),r("text","Gestion des habitats")("type","button")("color","tertiary")("rounded",!0),i(2),r("text","Gestion des animaux")("type","button")("color","tertiary")("rounded",!0),i(2),r("text","Comptes rendus des v\xE9t\xE9rinaires")("type","button")("color","tertiary")("rounded",!0),i(2),r("text","Consultation des habitats")("type","button")("color","tertiary")("rounded",!0),i(5),r("text","Retour accueil")("type","button")("color","tertiary")("rounded",!0))},dependencies:[_,S,x,v],encapsulation:2})};export{E as DashboardComponent};
