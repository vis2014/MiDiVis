/** Apache License 2.0 Applies **/
/** @author Sun Sibai & Liu Yu **/
var statkeyw=new Array(numofoct*7); // white key statistics
var statkeyb=new Array(numofoct*5); // black key statistics
for (st in statkeyw) {statkeyw[st]=0;}
for (st in statkeyb) {statkeyb[st]=0;}
var driftInterval; // drift handler
function pos2idxw(y) { // position to key index (white panel)
 return Math.round((hgh-2.5*pianow-y)/keywwid);
}
function pos2idxb(y) { // position to key index (black panel)
 var oct=Math.floor((hgh-2.5*pianow-y-keybwid/2)/keywwid/7); // octave number
 var rel=Math.round((hgh-2.5*pianow-y-keybwid/2)/keywwid)-oct*7; // blackaux[index%5]
 return blackaux.indexOf(rel)+oct*5;
}
function drop2stat(note) {
 var type=note.getAttribute('class');
 switch (type) {
  case 'notew': statkeyw[pos2idxw(parseFloat(note.getAttribute('y')))]+=parseFloat(note.getAttribute('width'));break;
  case 'noteb': statkeyb[pos2idxb(parseFloat(note.getAttribute('y')))]+=parseFloat(note.getAttribute('width'));break;
  default:
 }
 note.parentNode.removeChild(note);
}
function drift(note) {
 var x=parseFloat(note.getAttribute('x'));
 var w=parseFloat(note.getAttribute('width'));
 x-=driftspd;
 if (x+w<0) {drop2stat(note);} else {note.setAttribute('x',x);}
}
function driftbarline(note) {
 var x=parseFloat(note.getAttribute('x1'));
 x-=driftspd;
 if (x<0) {drop2stat(note);} else {note.setAttribute('x1',x);note.setAttribute('x2',x);}
}
function extend(note) {
 var w=parseFloat(note.getAttribute('width'));
 w+=driftspd;
 note.setAttribute('width',w);
}
function updatenotes() {
 var ns=d3.selectAll('rect.notew')[0];
 for (n in ns) {drift(ns[n]);}
 ns=d3.selectAll('rect.noteb')[0];
 for (n in ns) {drift(ns[n]);}
 ns=d3.selectAll('line.barline')[0];
 for (n in ns) {driftbarline(ns[n]);}
 ns=d3.selectAll('rect.press')[0];
 for (n in ns) {extend(ns[n]);}
}
function driftTrigger() {
 if (driftInterval) {
  clearInterval(driftInterval);
  driftInterval=null;
  if (autobarInterval) {clearInterval(autobarInterval);autobarInterval=null;}
  // also clear statistics
  statkeyw=new Array(numofoct*7,0);
  statkeyb=new Array(numofoct*5,0);
 } else {
  driftInterval=setInterval('updatenotes();',refreshT);
 }
}