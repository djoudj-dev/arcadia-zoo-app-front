import{Wa as d,Y as o,oa as n,za as s}from"./chunk-X5OSXEGS.js";var a=class t{constructor(e){this.el=e;this.setBorder(this.initialColor)}initialColor="#557a46";defaultColor="#ffffff";borderColor="";onMouseEnter(){this.setBorder(this.borderColor||this.defaultColor)}onMouseLeave(){this.setBorder(this.initialColor)}setBorder(e){this.el.nativeElement.style.border=`solid 1px ${e}`}static \u0275fac=function(r){return new(r||t)(s(n))};static \u0275dir=o({type:t,selectors:[["","appBorderCard",""]],hostBindings:function(r,i){r&1&&d("mouseenter",function(){return i.onMouseEnter()})("mouseleave",function(){return i.onMouseLeave()})},inputs:{borderColor:[0,"appBorderCard","borderColor"]},standalone:!0})};export{a};
