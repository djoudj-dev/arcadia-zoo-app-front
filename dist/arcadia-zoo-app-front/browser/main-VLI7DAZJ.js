import{a as ot}from"./chunk-KOYNCSVB.js";import{a as at}from"./chunk-TVVECW45.js";import{a as st}from"./chunk-PKGBZS2H.js";import{a as R}from"./chunk-DXKISGBH.js";import{a as Qe,b as K,c as Xe,d as Ye,g as et,h as tt,i as it,n as nt,p as rt}from"./chunk-2QYQOEU4.js";import{a as Ge,b as Je,c as We,d as F,e as M,f as Ke}from"./chunk-ZZFP4HC6.js";import{h as Be,i as Pe,l as ee,p as Z,q as $e,r as Ze,s as E,t as te}from"./chunk-H7WWMUX6.js";import{$ as u,$a as h,A as Me,Aa as je,C as _,Cb as $,Da as a,Ea as p,Eb as Ve,Ia as g,Na as k,O as Re,Oa as Ne,Pa as m,Q as L,Qa as He,Ra as f,T as S,Ta as V,Ua as B,Va as r,Wa as o,Xa as c,Y as b,Ya as W,Z as w,a as j,ab as I,b as N,ba as X,cb as s,db as O,eb as Y,ia as U,j as _e,ja as z,ka as T,kb as d,la as D,lb as x,mb as P,nb as Le,o as H,ob as Ue,pb as ze,qa as Te,r as ke,ra as De,ta as Oe,x as Se,xb as qe,y as Ie,z as Fe,za as q}from"./chunk-FRW6CNJS.js";var y=class t{alertMessage=g(null);alertType=g(null);setAlert(i,e="info"){this.alertMessage.set(i),this.alertType.set(e)}clearAlert(){this.alertMessage.set(null),this.alertType.set(null)}static \u0275fac=function(e){return new(e||t)};static \u0275prov=S({token:t,factory:t.\u0275fac,providedIn:"root"})};var C=class t{constructor(i,e,n,l){this.http=i;this.router=e;this.tokenService=n;this.alertService=l;this.initializeCurrentUser()}currentUserSignal=g(null);apiUrl=`${E.apiUrl}/auth`;initializeCurrentUser(){let i=localStorage.getItem("user"),e=this.tokenService.getToken();if(console.log("Utilisateur stock\xE9 r\xE9cup\xE9r\xE9:",i),i&&e)try{let n=JSON.parse(i);console.log("Utilisateur apr\xE8s parsing:",n),n&&n.role?(this.currentUserSignal.set(n),console.log("Utilisateur initialis\xE9 dans currentUserSignal:",this.currentUserSignal())):console.warn("R\xF4le manquant dans les donn\xE9es de l'utilisateur au d\xE9marrage")}catch(n){console.error("Erreur lors du parsing des donn\xE9es utilisateur :",n),localStorage.removeItem("user"),this.tokenService.removeToken()}}login(i,e){return this.http.post(`${this.apiUrl}/login`,{email:i,password:e}).pipe(L(n=>{let l=n.user;console.log("Utilisateur re\xE7u apr\xE8s connexion:",l),l.role&&l.token?(this.currentUserSignal.set(l),localStorage.setItem("user",JSON.stringify(l)),this.tokenService.setToken(l.token),this.alertService.setAlert("Connexion r\xE9ussie. Bienvenue!","success"),console.log("Utilisateur mis \xE0 jour dans AuthService:",this.currentUserSignal())):console.error("R\xF4le ou token manquant dans les donn\xE9es de l'utilisateur")}),_(n=>(console.error("Erreur de connexion",n),this.alertService.setAlert("Erreur de connexion. V\xE9rifiez vos identifiants.","error"),H(()=>new Error("Identifiants incorrects")))))}logout(){this.currentUserSignal.set(null),localStorage.removeItem("user"),this.tokenService.removeToken(),this.alertService.setAlert("D\xE9connexion r\xE9ussie.","info"),this.router.navigate(["/login"])}isAuthenticated(){return!!this.tokenService.getToken()}hasRole(i){let n=this.currentUserSignal()?.role?.name?.toLowerCase();return console.log("R\xF4le de l'utilisateur:",n,"R\xF4les requis:",i.map(l=>l.toLowerCase())),i.some(l=>l.toLowerCase()===n)}static \u0275fac=function(e){return new(e||t)(b(Z),b(F),b(R),b(y))};static \u0275prov=S({token:t,factory:t.\u0275fac,providedIn:"root"})};var we=t=>{let i=w(C),e=w(R),n=w(F);if(!i.isAuthenticated()||e.isTokenExpired())return console.log("Token expir\xE9 ou utilisateur non authentifi\xE9, redirection vers la page de connexion."),n.navigate(["/login"]),!1;let l=t.data?.roles;return l&&(!i.currentUserSignal()||!i.hasRole(l))?(console.log("Acc\xE8s refus\xE9. R\xF4les requis:",l,", R\xF4le de l'utilisateur:",i.currentUserSignal()?.role?.name),n.navigate(["/unauthorized"]),!1):!0};var G=class t{constructor(i,e,n,l){this.authService=i;this.router=e;this.ngZone=n;this.alertService=l}timeoutDuration=3e5;inactivitySubscription;startMonitoring(){this.inactivitySubscription=this.ngZone.runOutsideAngular(()=>Me(Se(window,"mousemove"),Se(window,"keydown")).pipe(L(()=>console.log("Activit\xE9 d\xE9tect\xE9e, r\xE9initialisation du timer")),Re(()=>Ie(this.timeoutDuration))).subscribe(()=>{this.ngZone.run(()=>{console.log("Inactivit\xE9 d\xE9tect\xE9e, d\xE9connexion de l'utilisateur"),this.authService.logout(),this.alertService.setAlert("Vous avez \xE9t\xE9 d\xE9connect\xE9 en raison de l'inactivit\xE9."),this.router.navigate(["/login"])})}))}stopMonitoring(){this.inactivitySubscription&&(this.inactivitySubscription.unsubscribe(),console.log("Surveillance d'inactivit\xE9 arr\xEAt\xE9e."))}static \u0275fac=function(e){return new(e||t)(b(C),b(F),b(De),b(y))};static \u0275prov=S({token:t,factory:t.\u0275fac,providedIn:"root"})};function Ct(t,i){t&1&&(r(0,"div",10),s(1,"Un email valide est requis."),o())}function St(t,i){if(t&1&&(r(0,"div",4)(1,"label",8),s(2,"Email"),o(),c(3,"input",9),k(4,Ct,2,0,"div",10),o()),t&2){let e,n=I();a(4),f((e=n.loginForm.get("email"))!=null&&e.invalid&&((e=n.loginForm.get("email"))!=null&&e.touched)?4:-1)}}function yt(t,i){t&1&&(r(0,"div",10),s(1," Le mot de passe doit comporter au moins 6 caract\xE8res. "),o())}function wt(t,i){if(t&1&&(r(0,"div",5)(1,"label",11),s(2,"Mot de passe"),o(),c(3,"input",12),k(4,yt,2,0,"div",10),o()),t&2){let e,n=I();a(4),f((e=n.loginForm.get("password"))!=null&&e.invalid&&((e=n.loginForm.get("password"))!=null&&e.touched)?4:-1)}}var re=class t{constructor(i,e){this.fb=i;this.authService=e;this.loginForm=this.fb.group({email:["",[K.required,K.email]],password:["",[K.required,K.minLength(6)]]})}loginForm;errorMessage="";router=w(F);inactivityService=w(G);onSubmit(){if(this.loginForm.valid){let{email:i,password:e}=this.loginForm.value;this.authService.login(i,e).subscribe({next:()=>{this.errorMessage="",this.inactivityService.startMonitoring(),this.router.navigate(["/dashboard"])},error:n=>{this.errorMessage="Identifiants incorrects, veuillez r\xE9essayer.",console.error("Erreur lors de la connexion:",n)}})}else this.errorMessage="Veuillez v\xE9rifier les informations fournies."}getErrorMessage(i){let e=this.loginForm.get(i);return e?.hasError("required")?`${i} est requis.`:e?.hasError("email")?"Veuillez fournir un email valide.":e?.hasError("minlength")?"Le mot de passe doit contenir au moins 6 caract\xE8res.":""}static \u0275fac=function(e){return new(e||t)(p(nt),p(C))};static \u0275cmp=u({type:t,selectors:[["app-login"]],standalone:!0,features:[d],decls:9,vars:7,consts:[[1,"h-auto","flex","items-center","justify-center","bg-primary"],[1,"bg-secondary","p-6","rounded-lg","shadow-lg","w-full","max-w-xs","sm:max-w-md","my-8"],[1,"text-xl","sm:text-2xl","font-bold","text-center","mb-6","text-quinary"],[3,"ngSubmit","formGroup"],[1,"mb-4"],[1,"mb-6"],[1,"flex","justify-center"],[1,"w-1/2","sm:w-1/3","lg:w-1/4","font-bold",3,"text","type","color","rounded"],["for","email",1,"block","text-sm","font-medium","text-gray-700"],["id","email","formControlName","email","type","email","placeholder","Entrez votre email",1,"mt-1","block","w-full","px-3","py-2","border","border-gray-300","rounded-md","shadow-sm","focus:outline-none","focus:ring-primary","focus:border-primary","sm:text-sm"],[1,"text-red-500","text-xs","mt-2"],["for","password",1,"block","text-sm","font-medium","text-gray-700"],["id","password","formControlName","password","type","password","placeholder","Entrez votre mot de passe",1,"mt-1","block","w-full","px-3","py-2","border","border-gray-300","rounded-md","shadow-sm","focus:outline-none","focus:ring-primary","focus:border-primary","sm:text-sm"]],template:function(e,n){e&1&&(r(0,"section",0)(1,"div",1)(2,"h2",2),s(3," Connexion "),o(),r(4,"form",3),h("ngSubmit",function(){return n.onSubmit()}),k(5,St,5,1,"div",4)(6,wt,5,1,"div",5),r(7,"div",6),c(8,"app-button",7),o()()()()),e&2&&(a(4),m("formGroup",n.loginForm),a(),f(n.loginForm.get("email")?5:-1),a(),f(n.loginForm.get("password")?6:-1),a(2),m("text","Connexion")("type","submit")("color","tertiary")("rounded",!0))},dependencies:[rt,et,Qe,Xe,Ye,tt,it,te],encapsulation:2})};var oe=class t{static \u0275fac=function(e){return new(e||t)};static \u0275cmp=u({type:t,selectors:[["app-zoo-intro"]],standalone:!0,features:[d],decls:11,vars:0,consts:[[1,"container","mx-auto"],[1,"text-center"],[1,"text-2xl","sm:text-4xl","sm:pt-2","lg:text-6xl","font-bold","font-serif","mb-4","mt-4"],[1,"px-4"],["aria-hidden","true","xmlns","http://www.w3.org/2000/svg","fill","currentColor","viewBox","0 0 18 14",1,"w-8","h-8","text-gray-400","dark:text-gray-600","mb-4"],["d","M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"],[1,"text-base","sm:text-lg","md:text-xl","text-quinary","font-sans","leading-relaxed","max-w-8xl","mx-auto","my-4"],[1,"flex","justify-center","mb-8"],["src","images/img_home/img-back.webp","alt","Savane",1,"w-full","h-96","object-cover","rounded-lg"]],template:function(e,n){e&1&&(r(0,"section",0)(1,"div",1)(2,"h1",2),s(3," Bienvenue sur le site du Zoo Arcadia "),o(),r(4,"blockquote",3),T(),r(5,"svg",4),c(6,"path",5),o(),D(),r(7,"p",6),s(8," Le Zoo Arcadia fond\xE9 en 1960, est un parc zoologique situ\xE9 pr\xE8s de la l\xE9gendaire for\xEAt de Broc\xE9liande, en Bretagne, France. Ce zoo, reconnu pour son engagement en faveur du bien-\xEAtre animal et de l'\xE9cologie, est un lieu de conservation o\xF9 les animaux sont soigneusement r\xE9partis selon leurs habitats naturels : savane, jungle, et marais. Chaque jour, une \xE9quipe de v\xE9t\xE9rinaires effectue des contr\xF4les rigoureux sur chaque animal avant l\u2019ouverture du zoo pour garantir leur bonne sant\xE9. De plus, l\u2019alimentation des animaux est minutieusement calcul\xE9e pour r\xE9pondre aux besoins nutritionnels sp\xE9cifiques de chaque esp\xE8ce. "),o()()(),r(9,"div",7),c(10,"img",8),o()())},encapsulation:2})};var Et=(t,i)=>i.id_habitat,At=t=>["/habitat",t];function _t(t,i){if(t&1&&(r(0,"a",5)(1,"div",6)(2,"div",7),s(3),o()(),r(4,"div",8),c(5,"img",9),o()()),t&2){let e=i.$implicit;m("routerLink",P(4,At,e.id_habitat)),a(3),Y(" ",e.name," "),a(2),m("src",e.images,q)("alt","Habitat de "+e.name)}}var ae=class t{constructor(i){this.habitatService=i}habitats=g([]);ngOnInit(){this.habitatService.getHabitats().subscribe(i=>{this.habitats.set(i.map(e=>N(j({},e),{image:e.images.startsWith("http")?e.images:`${E.apiUrl}/uploads/${e.images}`})))})}static \u0275fac=function(e){return new(e||t)(p(at))};static \u0275cmp=u({type:t,selectors:[["app-habitats-overview"]],standalone:!0,features:[d],decls:9,vars:0,consts:[[1,"w-screen","bg-secondary","shadow","pb-4","pt-4"],[1,"text-center","mb-4"],[1,"text-xl","sm:text-2xl","md:text-6xl","font-bold","text-primary","font-serif"],[1,"text-base","sm:text-lg","md:text-xl","text-quinary","font-sans","leading-relaxed","max-w-7xl","mx-auto","mt-4"],[1,"flex","flex-col","sm:flex-row","sm:flex-nowrap","justify-center","gap-6","px-6","sm:px-12","pb-4"],["appBorderCard","",1,"w-full","sm:w-1/4","flex","flex-col","items-center","rounded-lg","shadow",3,"routerLink"],[1,"w-full"],[1,"text-center","font-bold","py-2","bg-tertiary","text-white","rounded-t-lg"],[1,"relative","group","w-full","h-64"],[1,"w-full","h-full","object-cover","rounded-b-lg",3,"src","alt"]],template:function(e,n){e&1&&(r(0,"section",0)(1,"div",1)(2,"h1",2),s(3," Nos Habitats "),o(),r(4,"h3",3),s(5," Explorez la beaut\xE9 sauvage et la diversit\xE9 fascinante de trois \xE9cosyst\xE8mes uniques : la savane, la jungle et les marais. Dans la vaste \xE9tendue herbeuse de la savane, observez les majestueux lions, \xE9l\xE9phants et antilopes, parfaitement adapt\xE9s aux conditions chaudes et arides. En entrant dans la jungle dense et luxuriante, laissez-vous envo\xFBter par l'ambiance myst\xE9rieuse et les sons des animaux exotiques cach\xE9s dans cet \xE9cosyst\xE8me vibrant. Enfin, p\xE9n\xE9trez les marais, un monde humide et myst\xE9rieux o\xF9 reptiles et amphibiens prosp\xE8rent, rappelant l\u2019importance vitale de cet \xE9quilibre naturel. Chaque habitat vous d\xE9voile la richesse de la vie sous ses formes les plus \xE9tonnantes. "),o()(),r(6,"div",4),V(7,_t,6,6,"a",5,Et),o()()),e&2&&(a(7),B(n.habitats()))},dependencies:[ot,M],encapsulation:2})};var kt=(t,i)=>i.id_service,It=t=>["/service",t];function Ft(t,i){if(t&1&&(r(0,"div",5)(1,"a",6),c(2,"img",7),r(3,"div",8)(4,"span",9),s(5),o(),r(6,"span",10),s(7),o()(),r(8,"div",11)(9,"span",12),s(10),o()()()()),t&2){let e=i.$implicit;a(),m("routerLink",P(6,It,e.id_service)),a(),m("src",e.images,q)("alt",e.name),a(3),O(e.name),a(2),O(e.description),a(3),O(e.name)}}var se=class t{constructor(i){this.serviceService=i}services=g([]);ngOnInit(){this.loadServices()}loadServices(){this.serviceService.getServices().subscribe(i=>{this.services.set(i.map(e=>N(j({},e),{images:e.images.startsWith("http")?e.images:`${E.apiUrl}/${e.images}`})))})}static \u0275fac=function(e){return new(e||t)(p(st))};static \u0275cmp=u({type:t,selectors:[["app-services-overview"]],standalone:!0,features:[d],decls:9,vars:0,consts:[[1,"w-full","bg-secondary","shadow","py-4"],[1,"text-center"],[1,"text-xl","font-bold","font-serif","text-primary","sm:text-2xl","md:text-4xl","lg:text-5xl","xl:text-6xl"],[1,"text-base","sm:text-lg","md:text-xl","text-quinary","font-sans","leading-relaxed","max-w-7xl","mx-auto","my-4"],[1,"flex","flex-col","gap-4","py-4","px-4","justify-center","sm:flex-row","sm:flex-wrap","md:gap-8","sm:px-6","md:px-8","lg:px-10","xl:px-12"],["appTouchInteraction","",1,"relative","group","w-full","sm:w-1/2","md:w-1/3","lg:w-1/4","mx-auto"],[3,"routerLink"],[1,"w-full","h-full","object-cover","rounded-full",3,"src","alt"],[1,"overlay","absolute","inset-0","flex","flex-col","items-center","justify-center","bg-quaternary","bg-opacity-100","opacity-0","group-hover:opacity-100","transition-opacity","rounded-full"],[1,"text-quinary","text-lg","sm:text-xl","md:text-2xl","lg:text-xl","xl:text-3xl","2xl:text-2xl"],[1,"text-primary","text-center","text-sm","sm:text-base","md:text-lg","lg:text-base","xl:text-base","2xl:text-lg","px-2","mt-2"],[1,"absolute","top-4","left-0","right-0","flex","items-center","justify-center","md:hidden"],[1,"text-primary","text-lg","sm:text-xl","font-sans","bg-quinary","bg-opacity-80","px-2","py-1","rounded","mt-2"]],template:function(e,n){e&1&&(r(0,"section",0)(1,"div",1)(2,"h1",2),s(3," Nos Services "),o(),r(4,"h3",3),s(5," D\xE9couvrez nos services pour une exp\xE9rience enrichissante au zoo ! D\xE9tendez-vous au restaurant, situ\xE9 pr\xE8s de l'entr\xE9e, avec des options v\xE9g\xE9tariennes, v\xE9ganes et sans gluten, ouvert de 11h \xE0 15h. Plongez au c\u0153ur de la vie animale avec une visite guid\xE9e men\xE9e par un expert, en petits groupes de 10, pour explorer les habitats et les efforts de conservation. D\xE9parts \xE0 10h, 14h, et 16h depuis le pavillon d'accueil. Enfin, embarquez pour une visite en petit train panoramique, id\xE9ale pour les familles, avec commentaires audio, disponible de 9h \xE0 18h. "),o()(),r(6,"div",4),V(7,Ft,11,8,"div",5,kt),o()()),e&2&&(a(7),B(n.services()))},dependencies:[M],encapsulation:2})};var le=class t{modalOpenSubject=new _e(!1);modalOpen$=this.modalOpenSubject.asObservable();openModal(){this.modalOpenSubject.next(!0)}closeModal(){this.modalOpenSubject.next(!1)}static \u0275fac=function(e){return new(e||t)};static \u0275prov=S({token:t,factory:t.\u0275fac,providedIn:"root"})};var me=class t{constructor(i){this.http=i}apiUrl="http://localhost:3000/api/reviews";getReviews(){return this.http.get(`${this.apiUrl}?validated=true`).pipe(_(i=>{throw console.error("Erreur lors de la r\xE9cup\xE9ration des avis du backend :",i),i}))}addReview(i){return this.http.post(this.apiUrl,i).pipe(_(e=>{throw console.error("Erreur lors de l'envoi de l'avis au backend",e),e}))}validateReview(i){return this.http.patch(`${this.apiUrl}/${i}`,{validated:!0}).pipe(_(e=>{throw console.error("Erreur lors de la validation de l'avis :",e),e}))}static \u0275fac=function(e){return new(e||t)(b(Z))};static \u0275prov=S({token:t,factory:t.\u0275fac,providedIn:"root"})};var ce=class t{constructor(i,e){this.modalService=i;this.reviewService=e;this.reviewService.getReviews().subscribe(n=>{this.reviews.set(n)})}set stars(i){this._stars=i||[1,2,3,4,5]}get stars(){return this._stars}set rating(i){this._rating=i??0}get rating(){return this._rating}reviews=g([]);currentReviewIndex=g(0);_stars=[1,2,3,4,5];_rating=0;changeReview(i){let e=this.reviews();i==="previous"&&this.currentReviewIndex()>0?this.currentReviewIndex.set(this.currentReviewIndex()-1):i==="next"&&this.currentReviewIndex()<e.length-1&&this.currentReviewIndex.set(this.currentReviewIndex()+1)}openModal(){this.modalService.openModal()}static \u0275fac=function(e){return new(e||t)(p(le),p(me))};static \u0275cmp=u({type:t,selectors:[["app-review"]],inputs:{stars:"stars",rating:"rating"},standalone:!0,features:[d],decls:0,vars:0,template:function(e,n){},encapsulation:2})};var pe=class t{constructor(i){this.el=i;this.setBorder(this.initialColor)}initialColor="#ffffff";defaultColor="#557a46";borderColor="";onMouseEnter(){this.setBorder(this.borderColor||this.defaultColor)}onMouseLeave(){this.setBorder(this.initialColor)}setBorder(i){this.el.nativeElement.style.border=`solid 1px ${i}`}static \u0275fac=function(e){return new(e||t)(p(Oe))};static \u0275dir=X({type:t,selectors:[["","appBorderCardAnimal",""]],hostBindings:function(e,n){e&1&&h("mouseenter",function(){return n.onMouseEnter()})("mouseleave",function(){return n.onMouseLeave()})},inputs:{borderColor:[0,"appBorderAnimalCard","borderColor"]},standalone:!0})};var ue=class t{animals=[];count=4;updateAnimals=new Te;intervalSubscription;ngOnInit(){this.updateDisplayedAnimals(),this.intervalSubscription=Fe(5e3).subscribe(()=>{this.updateDisplayedAnimals()})}ngOnDestroy(){this.intervalSubscription&&this.intervalSubscription.unsubscribe()}updateDisplayedAnimals(){let e=[...this.animals].sort(()=>.5-Math.random()).slice(0,this.count);this.updateAnimals.emit(e)}static \u0275fac=function(e){return new(e||t)};static \u0275dir=X({type:t,selectors:[["","appRandomAnimals",""]],inputs:{animals:"animals",count:"count"},outputs:{updateAnimals:"updateAnimals"},standalone:!0})};var de=class t{constructor(i){this.http=i}apiUrl=`${E.apiUrl}/api/animals`;uploadsUrl=`${E.apiUrl}`;getAnimals(){return console.log("Fetching animals from:",this.apiUrl),this.http.get(this.apiUrl).pipe(ke(i=>i.map(e=>N(j({},e),{images:e.images?`${this.uploadsUrl}/${e.images}`:""}))),L(i=>console.log("Fetched animals:",i)),_(i=>(console.error("Error fetching animals:",i),H(i))))}static \u0275fac=function(e){return new(e||t)(b(Z))};static \u0275prov=S({token:t,factory:t.\u0275fac,providedIn:"root"})};var Dt=(t,i)=>i.id_animal,Ot=t=>["/animal",t];function jt(t,i){if(t&1&&(r(0,"div",5)(1,"a",6)(2,"div",7)(3,"h2",8),s(4),o(),r(5,"div",9),c(6,"img",10),o()()()()),t&2){let e=i.$implicit;a(),m("routerLink",P(4,Ot,e.id_animal)),a(3),Y(" ",e.name," "),a(2),m("src",e.images,q)("alt",e.name)}}var ve=class t{constructor(i,e){this.animalOverviewService=i;this.route=e}animal=g(void 0);animals=g([]);displayedAnimals=g([]);imageBaseUrl=`${E.apiUrl}`;ngOnInit(){this.animalOverviewService.getAnimals().subscribe(i=>{this.animals.set(i),this.displayedAnimals.set(this.getRandomAnimals(this.animals(),3))})}getRandomAnimals(i,e){return i.sort(()=>.5-Math.random()).slice(0,e)}onUpdateDisplayedAnimals(i){this.displayedAnimals.set(i)}static \u0275fac=function(e){return new(e||t)(p(de),p(Je))};static \u0275cmp=u({type:t,selectors:[["app-animals-overview"]],standalone:!0,features:[d],decls:9,vars:2,consts:[[1,"w-full","bg-primary","shadow","py-4"],[1,"text-center"],[1,"text-xl","sm:text-2xl","md:text-6xl","text-quinary","font-bold","font-serif"],[1,"text-base","sm:text-lg","md:text-xl","text-quinary","font-sans","leading-relaxed","max-w-7xl","mx-auto","my-4"],["appRandomAnimals","",1,"flex","flex-wrap","justify-center","gap-2","sm:gap-4","md:gap-6","lg:gap-4","mb-4","px-4",3,"updateAnimals","animals","count"],[1,"flex","justify-center","pt-4","w-full","sm:w-1/2","md:w-1/2","lg:w-1/2","xl:w-1/4"],[1,"w-full",3,"routerLink"],["appBorderCardAnimal","",1,"bg-secondary","shadow-lg","rounded-lg","p-6","text-center"],[1,"text-xl","font-bold","text-primary","mb-4"],[1,"w-full","h-full","overflow-hidden","rounded-lg","flex","justify-center","items-center"],["loading","lazy",1,"w-96","h-96","object-cover","rounded-lg",3,"src","alt"]],template:function(e,n){e&1&&(r(0,"section",0)(1,"div",1)(2,"h1",2),s(3," Nos Animaux "),o(),r(4,"h3",3),s(5," D\xE9couvrez les animaux fascinants qui peuplent nos trois habitats uniques. Dans la jungle luxuriante, le tigre Raihan r\xF4de silencieusement, tandis que le singe Ziko s'amuse dans les hauteurs, le perroquet Kapi explore la canop\xE9e color\xE9e, et le serpent Liana chasse discr\xE8tement. Les marais myst\xE9rieux abritent Grom, le puissant crocodile, ainsi que Nymbus, le h\xE9ron \xE9l\xE9gant, Flip la grenouille chanteuse, et Sly le serpent aquatique. Dans la savane aride, Aslan, le lion majestueux, r\xE8gne en ma\xEEtre aux c\xF4t\xE9s de Tembo, l'\xE9l\xE9phant imposant, Zuri, la girafe \xE9lanc\xE9e, et Dash, le rapide gu\xE9pard. Chaque animal r\xE9v\xE8le un aper\xE7u captivant de son habitat naturel. "),o()(),r(6,"div",4),h("updateAnimals",function(J){return n.onUpdateDisplayedAnimals(J)}),V(7,jt,7,6,"div",5,Dt),o()()),e&2&&(a(6),m("animals",n.animals())("count",3),a(),B(n.displayedAnimals()))},dependencies:[pe,M,ue],encapsulation:2})};var fe=class t{static \u0275fac=function(e){return new(e||t)};static \u0275cmp=u({type:t,selectors:[["app-home"]],standalone:!0,features:[d],decls:5,vars:0,template:function(e,n){e&1&&c(0,"app-zoo-intro")(1,"app-habitats-overview")(2,"app-animals-overview")(3,"app-services-overview")(4,"app-review")},dependencies:[oe,ae,ve,se,ce],encapsulation:2})};var mt=[{path:"",component:fe,title:"Accueil"},{path:"animal/:id",loadComponent:()=>import("./chunk-LAJBL3AC.js").then(t=>t.AnimalComponent),title:"Animal"},{path:"habitat/:id",loadComponent:()=>import("./chunk-5UK65HS5.js").then(t=>t.HabitatComponent),title:"Habitat"},{path:"habitats",loadComponent:()=>import("./chunk-ETDLHAWU.js").then(t=>t.HabitatsComponent),title:"Habitats"},{path:"services",loadComponent:()=>import("./chunk-PGZ66RKO.js").then(t=>t.ServicesComponent),title:"Services"},{path:"service/:id",loadComponent:()=>import("./chunk-MUZWY7Q4.js").then(t=>t.ServiceComponent),title:"Service"},{path:"contact",loadComponent:()=>import("./chunk-RESKCUPU.js").then(t=>t.ContactComponent),title:"Contact"},{path:"login",component:re,title:"Connexion"},{path:"admin",loadComponent:()=>import("./chunk-PNECFUTV.js").then(t=>t.DashboardComponent),title:"Admin",canActivate:[we],data:{roles:["Admin"]},children:[{path:"account-management",loadComponent:()=>import("./chunk-475ZH5Q6.js").then(t=>t.AccountManagementComponent),title:"Gestion des comptes"},{path:"service-management",loadComponent:()=>import("./chunk-EOUBGWAH.js").then(t=>t.ServiceManagementComponent),title:"Modification des services"},{path:"habitat-management",loadComponent:()=>import("./chunk-UXIOG4KP.js").then(t=>t.HabitatManagementComponent),title:"Gestion des habitats"},{path:"animal-management",loadComponent:()=>import("./chunk-5QVKMZT7.js").then(t=>t.AnimalManagementComponent),title:"Gestion des animaux"},{path:"vet-reports",loadComponent:()=>import("./chunk-F5KJYO73.js").then(t=>t.ReportsVeterinaireDashboardComponent),title:"Comptes rendus des v\xE9t\xE9rinaires"},{path:"habitats-dashboard",loadComponent:()=>import("./chunk-7HGRYGMV.js").then(t=>t.HabitatsDashboardComponent),title:"Consultation des habitats"}]},{path:"employe",loadComponent:()=>import("./chunk-VRD6NTKL.js").then(t=>t.EmployeComponent),title:"Employ\xE9",canActivate:[we],data:{roles:["Employ\xE9"]}},{path:"**",redirectTo:""}];var ct=(t,i)=>{let e=w(R),n=w(C),l=w(y),J=e.getToken();console.log("Jeton r\xE9cup\xE9r\xE9 par l\u2019intercepteur:",J);let Ae=J?t.clone({setHeaders:{Authorization:`Bearer ${J}`},withCredentials:!0}):t.clone({withCredentials:!0});return console.log("Requ\xEAte avec jeton:",Ae),i(Ae).pipe(_(Q=>(console.error("Erreur dans l\u2019intercepteur:",Q),(Q.status===401||Q.status===403)&&(l.setAlert("Votre session a expir\xE9. Vous avez \xE9t\xE9 d\xE9connect\xE9."),n.logout()),H(()=>Q))))};var pt={providers:[qe({eventCoalescing:!0}),Ke(mt),$e(Ze([ct]))]};var ge=class t{static \u0275fac=function(e){return new(e||t)};static \u0275cmp=u({type:t,selectors:[["app-banner"]],standalone:!0,features:[d],decls:2,vars:0,consts:[[1,"w-full","pt-14"],["src","images/banner.webp","alt","Banni\xE8re Zoo Arcadia.",1,"w-full","md:h-[30rem]"]],template:function(e,n){e&1&&(r(0,"div",0),c(1,"img",1),o())},encapsulation:2})};var Ee=()=>["/"],ut=()=>["/services"],dt=()=>["/habitats"],vt=()=>["/contact"],ft=()=>["/veterinaire"],gt=()=>["/employe"],ht=()=>["/admin"];function Nt(t,i){t&1&&c(0,"img",4)}function Ht(t,i){t&1&&c(0,"img",5)}function Lt(t,i){t&1&&(r(0,"li",7)(1,"a",8),s(2," V\xE9t\xE9rinaire "),o()()),t&2&&(a(),m("routerLink",x(1,ft)))}function Ut(t,i){t&1&&(r(0,"li",7)(1,"a",8),s(2," Employe "),o()()),t&2&&(a(),m("routerLink",x(1,gt)))}function zt(t,i){t&1&&(r(0,"li",7)(1,"a",8),s(2," Admin "),o()()),t&2&&(a(),m("routerLink",x(1,ht)))}function qt(t,i){if(t&1){let e=W();r(0,"li",7)(1,"a",11),h("click",function(){U(e);let l=I();return z(l.logout())}),s(2," D\xE9connexion "),o()()}}function Vt(t,i){t&1&&(r(0,"li",10)(1,"a",8),s(2," V\xE9t\xE9rinaire "),o()()),t&2&&(a(),m("routerLink",x(1,ft)))}function Bt(t,i){t&1&&(r(0,"li",7)(1,"a",8),s(2," Employe "),o()()),t&2&&(a(),m("routerLink",x(1,gt)))}function Pt(t,i){t&1&&(r(0,"li",10)(1,"a",8),s(2," Admin "),o()()),t&2&&(a(),m("routerLink",x(1,ht)))}function $t(t,i){if(t&1){let e=W();r(0,"li",10)(1,"a",11),h("click",function(){U(e);let l=I();return z(l.logout())}),s(2," D\xE9connexion "),o()()}}var he=class t{constructor(i,e){this.authService=i;this.router=e;Ve(()=>{let n=this.authService.currentUserSignal();console.log("Utilisateur actuel dans NavComponent:",n);let l=this.userRoles();console.log("R\xF4les apr\xE8s le subscribe dans NavComponent:",l)})}isMenuOpen=!1;userAuthenticated=$(()=>!!this.authService.currentUserSignal());userRoles=$(()=>{let i=this.authService.currentUserSignal();return{admin:!!(i&&i.role&&i.role.name==="Admin"),veterinaire:!!(i&&i.role&&i.role.name==="Veterinaire"),employe:!!(i&&i.role&&i.role.name==="Employe")}});ngOnInit(){}toggleMenu(){this.isMenuOpen=!this.isMenuOpen}logout(){this.authService.logout(),this.router.navigate(["/"])}static \u0275fac=function(e){return new(e||t)(p(C),p(F))};static \u0275cmp=u({type:t,selectors:[["app-nav"]],standalone:!0,features:[d],decls:42,vars:31,consts:[[1,"bg-secondary","z-50","fixed","top-0","w-full","shadow"],["id","main-nav",1,"bg-secondary","w-full","mx-auto","p-4","flex","items-center","justify-between","flex-wrap","md:p-5"],["aria-label","Accueil du portfolio",1,"text-lg","lg:text-xl","text-primary","font-bold",3,"routerLink"],["aria-controls","main-navlist","id","menu-toggler",1,"cursor-pointer","w-7","md:hidden",3,"click"],["width","28","height","28","src","images/menu.svg","alt","Ouvrir le menu"],["width","28","height","28","src","images/cross.svg","alt","Fermer le menu"],["id","main-navlist",1,"hidden","md:flex","items-center","w-full","md:w-auto","pt-4","md:pt-0","text-primary"],[1,"block","py-3","md:inline","md:py-0","md:mr-6"],[1,"text-sm","uppercase","font-semibold","hover:text-quaternary",3,"routerLink"],["id","main-navlist-mobile",1,"bg-secondary","text-center","w-full","pt-4","text-primary","md:hidden"],[1,"block","py-3","md:mr-6"],[1,"text-sm","uppercase","font-semibold","hover:text-quaternary",3,"click"]],template:function(e,n){e&1&&(r(0,"nav",0)(1,"div",1)(2,"a",2),s(3," Zoo Arcadia "),o(),r(4,"button",3),h("click",function(){return n.toggleMenu()}),k(5,Nt,1,0,"img",4)(6,Ht,1,0,"img",5),o(),r(7,"ul",6)(8,"li",7)(9,"a",8),s(10," Accueil "),o()(),r(11,"li",7)(12,"a",8),s(13," Services "),o()(),r(14,"li",7)(15,"a",8),s(16," Habitats "),o()(),r(17,"li",7)(18,"a",8),s(19," Contact "),o()(),k(20,Lt,3,2,"li",7)(21,Ut,3,2,"li",7)(22,zt,3,2,"li",7)(23,qt,3,0,"li",7),o()(),r(24,"ul",9)(25,"li",10)(26,"a",8),s(27," Accueil "),o()(),r(28,"li",10)(29,"a",8),s(30," Services "),o()(),r(31,"li",10)(32,"a",8),s(33," Habitats "),o()(),r(34,"li",10)(35,"a",8),s(36," Contact "),o()(),k(37,Vt,3,2,"li",10)(38,Bt,3,2,"li",7)(39,Pt,3,2,"li",10)(40,$t,3,0,"li",10),o()(),c(41,"app-banner")),e&2&&(a(2),m("routerLink",x(22,Ee)),a(2),Ne("aria-expanded",n.isMenuOpen),a(),f(n.isMenuOpen?-1:5),a(),f(n.isMenuOpen?6:-1),a(3),m("routerLink",x(23,Ee)),a(3),m("routerLink",x(24,ut)),a(3),m("routerLink",x(25,dt)),a(3),m("routerLink",x(26,vt)),a(2),f(n.userRoles().veterinaire?20:-1),a(),f(n.userRoles().employe?21:-1),a(),f(n.userRoles().admin?22:-1),a(),f(n.userAuthenticated()?23:-1),a(),He("hidden",!n.isMenuOpen),a(2),m("routerLink",x(27,Ee)),a(3),m("routerLink",x(28,ut)),a(3),m("routerLink",x(29,dt)),a(3),m("routerLink",x(30,vt)),a(2),f(n.userRoles().veterinaire?37:-1),a(),f(n.userRoles().employe?38:-1),a(),f(n.userRoles().admin?39:-1),a(),f(n.userAuthenticated()?40:-1))},dependencies:[ge,ee,M],encapsulation:2})};var xe=class t{openModal(){let i=document.getElementById("modal");i?.classList.remove("hidden"),i?.classList.add("flex")}closeModal(){let i=document.getElementById("modal");i?.classList.add("hidden"),i?.classList.remove("flex")}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=u({type:t,selectors:[["app-footer"]],standalone:!0,features:[d],decls:40,vars:4,consts:[[1,"bg-secondary"],[1,"flex","flex-col","items-center","justify-center","px-6","py-4"],[1,"flex","justify-center","gap-4","pb-2"],["href","#",1,"text-quinary","hover:text-primary"],["xmlns","http://www.w3.org/2000/svg","fill","currentColor","viewBox","0 0 320 512",1,"h-8","w-8"],["d","M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z"],["xmlns","http://www.w3.org/2000/svg","fill","currentColor","viewBox","0 0 448 512",1,"h-8","w-8"],["d","M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9-51.3-114.9-114.9-114.9zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"],["d","M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z"],["d","M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 1 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z"],[1,"w-full","sm:w-2/5","md:w-1/3","lg:w-1/5","pb-2","pt-2"],[3,"click","text","type","color","rounded"],[1,"text-sm","font-bold","text-center","bg-quinary-500","mt-2"],["id","modal",1,"fixed","inset-0","z-50","items-center","justify-center","bg-gray-900","bg-opacity-50","hidden"],[1,"bg-white","rounded-lg","shadow-lg","p-6","text-center","flex","flex-col","items-center","justify-center","w-full","max-w-full","sm:max-w-md","mx-auto"],[1,"text-lg","font-bold","text-slate-900","mb-4"],[1,"list-none","mt-4","text-sm","text-slate-600","space-y-2"],[1,"font-bold","text-quinary"],[1,"mt-4","text-sm","text-slate-600"],[1,"w-full","h-64","mt-4"],["src",je`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2668.735021438556!2d-2.1739626!3d48.018829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x480faceab3587495%3A0xcdc883e818be2eb2!2sFor%C3%AAt%20de%20Broc%C3%A9liande!5e0!3m2!1sfr!2sfr!4v1728318223640!5m2!1sfr!2sfr`,"width","100%","height","250","allowfullscreen","","loading","lazy","referrerpolicy","no-referrer-when-downgrade","onload","this.style.display = 'block';",2,"border","0"],[1,"mt-4","bg-tertiary","text-primary","px-4","py-2","rounded-md","focus:outline-none",3,"click"]],template:function(e,n){e&1&&(r(0,"footer",0)(1,"div",1)(2,"div",2)(3,"a",3),T(),r(4,"svg",4),c(5,"path",5),o()(),D(),r(6,"a",3),T(),r(7,"svg",6),c(8,"path",7),o()(),D(),r(9,"a",3),T(),r(10,"svg",6),c(11,"path",8),o()(),D(),r(12,"a",3),T(),r(13,"svg",6),c(14,"path",9),o()()(),D(),r(15,"div",10)(16,"app-button",11),h("click",function(){return n.openModal()}),o()(),r(17,"p",12),s(18," Copyright \xA9 2024 N\xE9dellec Julien. Tous droits r\xE9serv\xE9s. "),o()(),r(19,"div",13)(20,"div",14)(21,"h3",15),s(22," Plan d'acc\xE8s et Horaires "),o(),r(23,"ul",16)(24,"li")(25,"span",17),s(26,"Du Lundi au Vendredi :"),o(),s(27," de 9h00 \xE0 19h00 "),o(),r(28,"li")(29,"span",17),s(30,"Et du Samedi au Dimanche :"),o(),s(31," de 9h00 \xE0 20h00 "),o()(),r(32,"p",18)(33,"span",17),s(34,"Adresse :"),o(),s(35," 666 chemin de l'\xE9trange, 35380 Paimpont, France "),o(),r(36,"div",19),c(37,"iframe",20),o(),r(38,"button",21),h("click",function(){return n.closeModal()}),s(39," Fermer "),o()()()()),e&2&&(a(16),m("text","Plan d'acc\xE8s et Horaires")("type","button")("color","tertiary")("rounded",!0))},dependencies:[te],encapsulation:2})};var Zt=(t,i,e)=>({"alert-card":!0,"alert-success":t,"alert-error":i,"alert-info":e});function Gt(t,i){if(t&1){let e=W();r(0,"div",0)(1,"div",1)(2,"div",2)(3,"span",3),s(4),Ue(5,"titlecase"),o(),r(6,"button",4),h("click",function(){U(e);let l=I();return z(l.clearAlert())}),s(7,"\xD7"),o()(),r(8,"div",5)(9,"p"),s(10),o()(),r(11,"div",6)(12,"button",7),h("click",function(){U(e);let l=I();return z(l.clearAlert())}),s(13,"Fermer"),o()()()()}if(t&2){let e=I();a(),m("ngClass",Le(5,Zt,e.alertType()==="success",e.alertType()==="error",e.alertType()==="info")),a(3),O(ze(5,3,e.alertType())),a(6),O(e.alertMessage())}}var be=class t{constructor(i){this.alertService=i}alertMessage=$(()=>this.alertService.alertMessage());alertType=$(()=>this.alertService.alertType());clearAlert(){this.alertService.clearAlert()}static \u0275fac=function(e){return new(e||t)(p(y))};static \u0275cmp=u({type:t,selectors:[["app-alert"]],standalone:!0,features:[d],decls:1,vars:1,consts:[[1,"alert-overlay"],[3,"ngClass"],[1,"alert-header"],[1,"alert-title"],[1,"close-btn",3,"click"],[1,"alert-body"],[1,"alert-footer"],[1,"close-alert-btn",3,"click"]],template:function(e,n){e&1&&k(0,Gt,14,9,"div",0),e&2&&f(n.alertMessage()&&n.alertType()?0:-1)},dependencies:[ee,Be,Pe],styles:[".alert-overlay[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:flex;justify-content:center;align-items:center}.alert-card[_ngcontent-%COMP%]{padding:1rem;border-radius:8px;box-shadow:0 4px 8px #0003;width:80%;max-width:400px;text-align:center}.alert-success[_ngcontent-%COMP%]{background-color:#d4edda;color:#155724}.alert-error[_ngcontent-%COMP%]{background-color:#f8d7da;color:#721c24}.alert-info[_ngcontent-%COMP%]{background-color:#cce5ff;color:#004085}.alert-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center}.alert-title[_ngcontent-%COMP%]{font-weight:700}.close-btn[_ngcontent-%COMP%], .close-alert-btn[_ngcontent-%COMP%]{background:transparent;border:none;font-size:1.2rem;cursor:pointer}"]})};var Ce=class t{constructor(i,e,n,l){this.tokenService=i;this.authService=e;this.inactivityService=n;this.alertService=l}inactivitySubscription;ngOnInit(){this.tokenService.getToken()?this.tokenService.isTokenExpired()?(this.authService.logout(),this.alertService.setAlert("Votre session a expir\xE9, vous avez \xE9t\xE9 d\xE9connect\xE9.")):this.inactivityService.startMonitoring():console.log("Aucun token trouv\xE9, l'utilisateur est un visiteur.")}ngOnDestroy(){this.inactivityService.stopMonitoring()}static \u0275fac=function(e){return new(e||t)(p(R),p(C),p(G),p(y))};static \u0275cmp=u({type:t,selectors:[["app-root"]],standalone:!0,features:[d],decls:4,vars:0,template:function(e,n){e&1&&c(0,"app-nav")(1,"app-alert")(2,"router-outlet")(3,"app-footer")},dependencies:[he,xe,We,be]})};Ge(Ce,pt).catch(t=>console.error(t));
