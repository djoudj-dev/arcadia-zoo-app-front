import{p as l,s}from"./chunk-H7WWMUX6.js";import{Ia as e,T as i,Y as o}from"./chunk-FRW6CNJS.js";var r=class a{constructor(t){this.http=t}apiUrl=s.apiUrl+"/admin/stats-management/stats";totalAnimals=e(0);totalHabitats=e(0);totalServices=e(0);totalEmploye=e(0);totalVet=e(0);getStats(){this.http.get(this.apiUrl).subscribe(t=>{this.totalAnimals.set(t.totalAnimals),this.totalHabitats.set(t.totalHabitats),this.totalServices.set(t.totalServices),this.totalEmploye.set(t.totalEmployes),this.totalVet.set(t.totalVets)})}incrementTotalAnimals(){this.totalAnimals.update(t=>t+1)}decrementTotalAnimals(){this.totalAnimals.update(t=>t-1)}incrementTotalHabitats(){this.totalHabitats.update(t=>t+1)}decrementTotalHabitats(){this.totalHabitats.update(t=>t-1)}incrementTotalServices(){this.totalServices.update(t=>t+1)}decrementTotalServices(){this.totalServices.update(t=>t-1)}incrementTotalEmploye(){this.totalEmploye.update(t=>t+1)}decrementTotalEmploye(){this.totalEmploye.update(t=>t-1)}incrementTotalVet(){this.totalVet.update(t=>t+1)}decrementTotalVet(){this.totalVet.update(t=>t-1)}static \u0275fac=function(n){return new(n||a)(o(l))};static \u0275prov=i({token:a,factory:a.\u0275fac,providedIn:"root"})};export{r as a};