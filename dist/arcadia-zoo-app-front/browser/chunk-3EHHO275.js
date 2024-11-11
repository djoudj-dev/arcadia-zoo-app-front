import{p as b,s as e}from"./chunk-H7WWMUX6.js";import{M as h,Q as r,T as o,Y as c,a as p,b as n,k as m,r as s}from"./chunk-FRW6CNJS.js";var d=class l{constructor(a){this.http=a}apiUrl=`${e.apiUrl}/api/animals`;habitatUrl=`${e.apiUrl}/api/habitats`;uploadsUrl=`${e.apiUrl}/uploads`;animalsCache$=new m(1);cacheLoaded=!1;getAnimals(){return this.cacheLoaded||this.http.get(this.apiUrl).pipe(s(a=>a.map(i=>n(p({},i),{image:i.images?`${e.apiUrl}/uploads/animals/${i.images}`:""}))),h(1),r(a=>{this.animalsCache$.next(a),this.cacheLoaded=!0})).subscribe(),this.animalsCache$}getAnimalById(a){return this.getAnimals().pipe(s(i=>{let t=i.find(u=>u.id_animal===a);return t&&t.images&&(t.images=t.images.startsWith("http")?t.images:`${e.apiUrl}/${t.images}`),t}))}getHabitatById(a){return this.http.get(`${this.habitatUrl}/${a}`)}addAnimal(a){return this.http.post(this.apiUrl,a).pipe(r(()=>this.clearCache()))}updateAnimal(a){return this.http.put(`${this.apiUrl}/${a.id_animal}`,a).pipe(r(()=>this.clearCache()))}deleteAnimal(a){return this.http.delete(`${this.apiUrl}/${a}`).pipe(r(()=>this.clearCache()))}clearCache(){this.animalsCache$.next([]),this.cacheLoaded=!1}static \u0275fac=function(i){return new(i||l)(c(b))};static \u0275prov=o({token:l,factory:l.\u0275fac,providedIn:"root"})};export{d as a};