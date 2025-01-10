import{W as a}from"./chunk-TKCV3HAR.js";var n=class extends Error{};n.prototype.name="InvalidTokenError";function d(r){return decodeURIComponent(atob(r).replace(/(.)/g,(e,t)=>{let o=t.charCodeAt(0).toString(16).toUpperCase();return o.length<2&&(o="0"+o),"%"+o}))}function l(r){let e=r.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return d(e)}catch{return atob(e)}}function c(r,e){if(typeof r!="string")throw new n("Invalid token specified: must be a string");e||(e={});let t=e.header===!0?0:1,o=r.split(".")[t];if(typeof o!="string")throw new n(`Invalid token specified: missing part #${t+1}`);let i;try{i=l(o)}catch(s){throw new n(`Invalid token specified: invalid base64 for part #${t+1} (${s.message})`)}try{return JSON.parse(i)}catch(s){throw new n(`Invalid token specified: invalid json for part #${t+1} (${s.message})`)}}var p=class r{STORAGE_PREFIX="app_secure_";TOKEN_KEY=`${this.STORAGE_PREFIX}token`;REFRESH_TOKEN_KEY=`${this.STORAGE_PREFIX}refresh_token`;getToken(){return this.decryptToken(sessionStorage.getItem(this.TOKEN_KEY))}getRefreshToken(){return this.decryptToken(sessionStorage.getItem(this.REFRESH_TOKEN_KEY))}setTokens(e,t){sessionStorage.setItem(this.TOKEN_KEY,this.encryptToken(e)),sessionStorage.setItem(this.REFRESH_TOKEN_KEY,this.encryptToken(t))}removeTokens(){sessionStorage.removeItem(this.TOKEN_KEY),sessionStorage.removeItem(this.REFRESH_TOKEN_KEY)}isTokenExpired(e){try{let t=this.decodeToken(e);return t?t.exp*1e3<=Date.now():!0}catch{return!0}}isTokenExpiringSoon(e,t=5){try{let o=this.decodeToken(e);if(!o)return!0;let i=o.exp*1e3,s=t*60*1e3;return i-Date.now()<=s}catch{return!0}}decodeToken(e){try{return c(e)}catch(t){return console.error("Erreur lors du d\xE9codage du token:",t),null}}refreshToken(){console.log("Pr\xE9parez une logique pour rafra\xEEchir le token.")}decryptToken(e){return e}encryptToken(e){return e}static \u0275fac=function(t){return new(t||r)};static \u0275prov=a({token:r,factory:r.\u0275fac,providedIn:"root"})};export{p as a};
