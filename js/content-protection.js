(()=>{"use strict";
const editable=e=>!!(e&&e.closest&&e.closest('input,textarea,select,[contenteditable="true"]'));
const block=e=>{if(!editable(e.target)){e.preventDefault();e.stopImmediatePropagation();return false;}};
["contextmenu","selectstart","dragstart","copy","cut","paste"].forEach(t=>document.addEventListener(t,block,true));
document.addEventListener("keydown",e=>{if(editable(e.target))return;const k=(e.key||"").toLowerCase();const mod=e.ctrlKey||e.metaKey;const blocked=mod&&["a","c","x","v","s","u","p"].includes(k);const dev=e.key==="F12"||(e.ctrlKey&&e.shiftKey&&["i","j","c","k"].includes(k))||(e.metaKey&&e.altKey&&["i","j","c"].includes(k));if(blocked||dev){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll("img").forEach(img=>{img.draggable=false;img.setAttribute("draggable","false");img.addEventListener("contextmenu",e=>e.preventDefault(),true);});});
})();