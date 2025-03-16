import{H as t,Nc as p,Qc as n,_ as o,da as a,q as i}from"./chunk-RMHEMJYH.js";var l=class s{constructor(r){this.http=r}apiUrl=`${n.apiUrl}/api/admin/account-management`;getAllUsers(){return this.http.get(this.apiUrl).pipe(t(r=>this.handleError("chargement des utilisateurs",r)))}createUser(r){return this.http.post(this.apiUrl,r).pipe(t(e=>this.handleError("cr\xE9ation dutilisateur",e)))}updateUser(r){return this.http.put(`${this.apiUrl}/${r.id}`,r).pipe(t(e=>this.handleError("mise \xE0 jour dutilisateur",e)))}deleteUser(r){return this.http.delete(`${this.apiUrl}/${r}`).pipe(t(e=>this.handleError("suppression dutilisateur",e)))}getRoles(){return this.http.get(`${this.apiUrl}/roles`).pipe(t(r=>this.handleError("chargement des r\xF4les",r)))}handleError(r,e){return console.error(`Erreur lors de ${r} :`,e.message),i(()=>new Error(`Erreur de ${r}.`))}updatePassword(r,e){return this.http.post(`${this.apiUrl}/update-password`,{currentPassword:r,newPassword:e})}static \u0275fac=function(e){return new(e||s)(a(p))};static \u0275prov=o({token:s,factory:s.\u0275fac,providedIn:"root"})};export{l as a};
