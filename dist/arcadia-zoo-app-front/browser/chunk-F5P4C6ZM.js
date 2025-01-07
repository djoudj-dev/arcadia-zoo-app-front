import{a as w}from"./chunk-3PZTUIRH.js";import{d as E}from"./chunk-63Q2HYMA.js";import{$ as a,A as m,E as u,Pa as v,S as p,Sb as f,V as s,Y as g,_ as k,lc as T,o as c,oc as S}from"./chunk-OS3QXM5S.js";var R=new g("JWT_OPTIONS"),I=(()=>{class o{constructor(e=null){this.tokenGetter=e&&e.tokenGetter||function(){}}urlBase64Decode(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:{t+="==";break}case 3:{t+="=";break}default:throw new Error("Illegal base64url string!")}return this.b64DecodeUnicode(t)}b64decode(e){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="";if(e=String(e).replace(/=+$/,""),e.length%4===1)throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");for(let h=0,d,i,x=0;i=e.charAt(x++);~i&&(d=h%4?d*64+i:i,h++%4)?n+=String.fromCharCode(255&d>>(-2*h&6)):0)i=t.indexOf(i);return n}b64DecodeUnicode(e){return decodeURIComponent(Array.prototype.map.call(this.b64decode(e),t=>"%"+("00"+t.charCodeAt(0).toString(16)).slice(-2)).join(""))}decodeToken(e=this.tokenGetter()){return e instanceof Promise?e.then(t=>this._decodeToken(t)):this._decodeToken(e)}_decodeToken(e){if(!e||e==="")return null;let t=e.split(".");if(t.length!==3)throw new Error("The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.");let n=this.urlBase64Decode(t[1]);if(!n)throw new Error("Cannot decode the token.");return JSON.parse(n)}getTokenExpirationDate(e=this.tokenGetter()){return e instanceof Promise?e.then(t=>this._getTokenExpirationDate(t)):this._getTokenExpirationDate(e)}_getTokenExpirationDate(e){let t;if(t=this.decodeToken(e),!t||!t.hasOwnProperty("exp"))return null;let n=new Date(0);return n.setUTCSeconds(t.exp),n}isTokenExpired(e=this.tokenGetter(),t){return e instanceof Promise?e.then(n=>this._isTokenExpired(n,t)):this._isTokenExpired(e,t)}_isTokenExpired(e,t){if(!e||e==="")return!0;let n=this.getTokenExpirationDate(e);return t=t||0,n===null?!1:!(n.valueOf()>new Date().valueOf()+t*1e3)}getAuthScheme(e,t){return typeof e=="function"?e(t):e}}return o.\u0275fac=function(e){return new(e||o)(k(R))},o.\u0275prov=s({token:o,factory:o.\u0275fac}),o})();var l=class o{TOKEN_KEY="access_token";REFRESH_TOKEN_KEY="refresh_token";jwtHelper=new I;setTokens(r,e){localStorage.setItem(this.TOKEN_KEY,r),localStorage.setItem(this.REFRESH_TOKEN_KEY,e)}getToken(){return localStorage.getItem(this.TOKEN_KEY)}getRefreshToken(){return localStorage.getItem(this.REFRESH_TOKEN_KEY)}removeTokens(){localStorage.removeItem(this.TOKEN_KEY),localStorage.removeItem(this.REFRESH_TOKEN_KEY)}isTokenExpiringSoon(r){let e=this.jwtHelper.getTokenExpirationDate(r);if(!e)return!0;let t=5*60*1e3;return e.getTime()-Date.now()<t}static \u0275fac=function(e){return new(e||o)};static \u0275prov=s({token:o,factory:o.\u0275fac,providedIn:"root"})};var b=class o{apiUrl=`${S.apiUrl}`;http=a(T);router=a(E);toastService=a(w);tokenSecurityService=a(l);currentUserSignal=v(null);isAuthenticated=f(()=>!!this.currentUserSignal());userRole=f(()=>this.currentUserSignal()?.role?.name);constructor(){this.initializeCurrentUser(),this.isAuthenticated()&&m(6e4).subscribe(()=>this.checkTokenExpiration())}initializeCurrentUser(){let r=localStorage.getItem("user"),e=this.tokenSecurityService.getToken();if(r&&e)try{let t=JSON.parse(r);this.currentUserSignal.set(t)}catch{this.handleInvalidUserData()}}login(r,e){return this.http.post(`${this.apiUrl}/api/auth/login`,{email:r,password:e}).pipe(p(t=>{this.handleSuccessfulLogin(t.user)}),u(t=>this.handleLoginError(t)))}refreshToken(){let r=this.tokenSecurityService.getRefreshToken();return r?this.http.post(`${this.apiUrl}/auth/token/refresh`,{refreshToken:r}).pipe(p(e=>{this.tokenSecurityService.setTokens(e.accessToken,e.refreshToken)}),u(e=>(console.error("Erreur de rafra\xEEchissement du token:",e),this.logout(),c(()=>e)))):(this.logout(),c(()=>new Error("Refresh token non trouv\xE9")))}logout(){this.currentUserSignal.set(null),localStorage.removeItem("user"),this.tokenSecurityService.removeTokens(),this.toastService.showSuccess("D\xE9connexion r\xE9ussie !",2500),setTimeout(()=>this.router.navigate(["/login"]),2500)}checkTokenExpiration(){let r=this.tokenSecurityService.getToken();r&&this.tokenSecurityService.isTokenExpiringSoon(r)&&this.refreshToken().subscribe()}handleSuccessfulLogin(r){if(r.role&&r.token)this.tokenSecurityService.setTokens(r.token,r.refreshToken??""),this.currentUserSignal.set(r),localStorage.setItem("user",JSON.stringify(r)),this.toastService.showSuccess("Connexion r\xE9ussie. Bienvenue!");else throw new Error("Donn\xE9es utilisateur invalides")}handleLoginError(r){return this.toastService.showError(r.error?.message||"Erreur de connexion. V\xE9rifiez vos identifiants."),c(()=>r)}handleInvalidUserData(){this.logout()}static \u0275fac=function(e){return new(e||o)};static \u0275prov=s({token:o,factory:o.\u0275fac,providedIn:"root"})};export{l as a,b};
